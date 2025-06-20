import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Total Risks", value: 5, description: "Across all departments" },
  { label: "Open Risks", value: 2, description: "Requiring attention" },
  { label: "Mitigating", value: 2, description: "In progress" },
  { label: "Closed Risks", value: 0, description: "Successfully mitigated" },
];

const severityData = [
  { name: "Low", value: 0 },
  { name: "Medium", value: 2 },
  { name: "High", value: 2 },
  { name: "Critical", value: 1 },
];
const severityColors = ["#10B981", "#FBBF24", "#F59E0B", "#DC2626"];

const categoryData = [
  { name: "Academic", value: 1 },
  { name: "Compliance", value: 1 },
  { name: "Financial", value: 1 },
  { name: "Fraud and Corruption", value: 1 },
  { name: "Governance", value: 1 },
  { name: "Health, Safety and Welfare", value: 1 },
  { name: "Human capital", value: 1 },
  { name: "ICT", value: 1 },
  { name: "Infrastructure Management", value: 1 },
  { name: "Operational", value: 1 },
  { name: "Research & Consultancy", value: 1 },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-1">Welcome back, Prof.</h1>
      <p className="text-muted-foreground mb-8">Here's an overview of the University's risk management status</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="shadow-none border border-muted-foreground/10">
            <CardHeader>
              <CardTitle className="text-lg">{stat.label}</CardTitle>
              <CardDescription className="text-3xl font-bold text-black dark:text-white">{stat.value}</CardDescription>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Severity Distribution</CardTitle>
            <CardDescription>Overview of risks by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {severityData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={severityColors[idx]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-4">
                <span className="text-green-600 font-medium">Low</span>
                <span className="text-yellow-500 font-medium">Medium</span>
                <span className="text-orange-500 font-medium">High</span>
                <span className="text-red-600 font-medium">Critical</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risks by Category</CardTitle>
            <CardDescription>Distribution of risks across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Bar dataKey="value" fill="#0e7490" radius={[4, 4, 0, 0]} />
                <RechartsTooltip />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 