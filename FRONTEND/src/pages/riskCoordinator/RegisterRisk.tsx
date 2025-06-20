import React, { useState } from "react";
import RiskRegistrationForm from "@/components/form/RiskRegistrationForm";
import RiskDetailsModal from "@/components/modals/RiskDetailsModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIES = [
  "All Categories",
  "Academic",
  "Compliance",
  "Financial",
  "Fraud and Corruption",
  "Governance",
  "Health, Safety and Welfare",
  "Human capital",
  "ICT",
  "Infrastructure Management",
  "Operational",
  "Research & Consultancy"
];
const STATUSES = ["All Statuses", "Open", "Mitigating", "Under Review"];

const statusStyles = {
  Open: "bg-blue-100 text-blue-800",
  Mitigating: "bg-yellow-100 text-yellow-800",
  "Under Review": "bg-purple-100 text-purple-800",
};
const severityStyles = {
  Critical: "bg-red-500 text-white",
  High: "bg-red-200 text-red-800",
  Medium: "bg-yellow-200 text-yellow-800",
};

const RegisterRiskPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [risks, setRisks] = useState([
    {
      id: "RISK-2024-001",
      title: "Insufficient IT Infrastructure for Online Learning",
      owner: "Dr. Sarah Johnson",
      category: "ICT",
      description: "The current IT infrastructure may not be sufficient to support the increasing demand for online learning platforms, particularly during peak usage periods. This could lead to system slowdowns, connection issues, and potential service disruptions affecting both students and faculty.",
      department: "DICT",
      status: "Open",
      rating: 7,
      severity: "High",
      lastUpdated: "2024-03-15",
      impact: "High impact on academic delivery and student experience. Could affect thousands of students and faculty members, potentially disrupting academic activities and damaging institutional reputation.",
      likelihood: "Medium probability of occurrence, particularly during examination periods and peak registration times.",
      controls: "Current controls include basic load balancing and server monitoring. Regular maintenance is performed, but the system lacks redundancy and advanced scaling capabilities.",
      mitigation: "1. Upgrade server infrastructure with cloud-based solutions\n2. Implement advanced load balancing\n3. Establish redundancy systems\n4. Regular capacity planning and monitoring\n5. Develop contingency plans for system failures"
    }
  ]);

  const handleViewRisk = (risk) => {
    setSelectedRisk(risk);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRisk(null);
  };

  const handleSaveRisk = (updatedRisk) => {
    setRisks(prevRisks => 
      prevRisks.map(risk => 
        risk.id === updatedRisk.id ? updatedRisk : risk
      )
    );
    toast.success("Risk updated successfully");
    handleCloseModal();
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(search.toLowerCase()) ||
                         risk.id.toLowerCase().includes(search.toLowerCase()) ||
                         risk.owner.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All Categories" || risk.category === category;
    const matchesStatus = status === "All Statuses" || risk.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (showForm) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <Button variant="outline" className="mb-4" onClick={() => setShowForm(false)}>
          ← Back to List
        </Button>
        <RiskRegistrationForm />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-1">Risks Register</h1>
      <p className="text-muted-foreground mb-4">View and manage all identified risks across the university</p>
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search risks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-full md:w-64"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1 flex justify-end">
          <Button onClick={() => setShowForm(true)} className="bg-primary text-white">Register New Risk</Button>
        </div>
      </div>
      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="py-3 px-4 font-semibold">Risk ID</th>
              <th className="py-3 px-4 font-semibold">Risk Title</th>
              <th className="py-3 px-4 font-semibold">Risk Owner</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRisks.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6">No risks found.</td></tr>
            ) : (
              filteredRisks.map((risk, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{risk.id}</td>
                  <td className="py-3 px-4">{risk.title}</td>
                  <td className="py-3 px-4">{risk.owner}</td>
                  <td className="py-3 px-4">{risk.category}</td>
                  <td className="py-3 px-4">
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary/80"
                      onClick={() => handleViewRisk(risk)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <RiskDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        risk={selectedRisk}
        onSave={handleSaveRisk}
      />
    </div>
  );
};

export default RegisterRiskPage;
