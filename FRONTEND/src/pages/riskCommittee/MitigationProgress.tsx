import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const demoRisks = [
  {
    id: 1,
    title: "Data Breach",
    owner: "IT Dept",
    status: "In Progress",
    dueDate: "2024-07-10",
    progress: 60,
  },
  {
    id: 2,
    title: "Fire Safety",
    owner: "Facilities",
    status: "Overdue",
    dueDate: "2024-06-30",
    progress: 30,
  },
  {
    id: 3,
    title: "Financial Fraud",
    owner: "Finance",
    status: "Completed",
    dueDate: "2024-06-15",
    progress: 100,
  },
  {
    id: 4,
    title: "Power Outage",
    owner: "Operations",
    status: "Not Started",
    dueDate: "2024-08-01",
    progress: 0,
  },
];

const statusColors = {
  "Not Started": "bg-gray-200 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-800",
  "Completed": "bg-green-100 text-green-800",
  "Overdue": "bg-red-100 text-red-800",
};

const owners = ["All Owners", "IT Dept", "Facilities", "Finance", "Operations"];
const statuses = ["All Statuses", "Not Started", "In Progress", "Completed", "Overdue"];

export default function MitigationProgress() {
  const [search, setSearch] = useState("");
  const [owner, setOwner] = useState(owners[0]);
  const [status, setStatus] = useState(statuses[0]);

  const filtered = demoRisks.filter(risk => {
    const matchesSearch =
      risk.title.toLowerCase().includes(search.toLowerCase()) ||
      String(risk.id).includes(search);
    const matchesOwner = owner === "All Owners" || risk.owner === owner;
    const matchesStatus = status === "All Statuses" || risk.status === status;
    return matchesSearch && matchesOwner && matchesStatus;
  });

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-1">Mitigation Progress</h1>
      <p className="text-muted-foreground mb-8">Track progress on risk mitigation activities</p>
      <Card>
        <CardHeader>
          <CardTitle>Mitigation Progress</CardTitle>
          <CardDescription>Monitor and follow up on risk mitigation actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <Input
              className="w-full md:w-64"
              placeholder="Search by risk title or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {owners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
<table className="w-full text-sm table-auto">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="py-3 px-4 font-semibold">Risk ID</th>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Owner</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Progress</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6">No mitigation records found.</td></tr>
                ) : (
                  filtered.map((risk, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{risk.id}</td>
                      <td className="py-3 px-4">{risk.title}</td>
                      <td className="py-3 px-4">{risk.owner}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[risk.status] || "bg-gray-100 text-gray-800"}`}>{risk.status}</span>
                      </td>
                      <td className="py-3 px-4">{risk.dueDate}</td>
                      <td className="py-3 px-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${risk.progress === 100 ? "bg-green-500" : risk.progress === 0 ? "bg-gray-400" : "bg-blue-500"}`}
                            style={{ width: `${risk.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs ml-2">{risk.progress}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 