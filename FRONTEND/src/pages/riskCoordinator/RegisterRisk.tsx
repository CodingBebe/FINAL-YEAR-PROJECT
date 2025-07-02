import React, { useState, useEffect } from "react";
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
  const [risks, setRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Default to true as data loads on mount

  // Extracted fetch function for reusability (e.g., after a new risk is registered)
  const fetchRisksData = async () => {
    setIsLoading(true); // Set loading to true before starting the fetch
    try {
      const res = await fetch("http://localhost:3000/api/risks");
      const data = await res.json();
      if (data.success) {
        setRisks(data.data);
      } else {
        toast.error("Failed to fetch risks");
      }
    } catch (err) {
      console.error("Error fetching risks:", err); // Log the error for debugging
      toast.error("Failed to fetch risks. Please check console for details.");
    } finally {
      setIsLoading(false); // Set loading to false whether successful or not
    }
  };

  useEffect(() => {
    fetchRisksData(); // Initial fetch on component mount
  }, []); // Empty dependency array means this runs once on mount

  const handleViewRisk = (risk) => {
    console.log('Selected risk for details modal:', risk);
    setSelectedRisk(risk);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRisk(null);
  };

  // Assuming RiskRegistrationForm has an onSubmit prop that calls this
  const handleRiskRegistered = async () => {
    setShowForm(false); // Close the form
    await fetchRisksData(); // Re-fetch the list of risks to update the table
    toast.success("Risk registered successfully!");
  };

  const handleSaveRisk = (updatedRisk) => {
    setRisks(prevRisks => 
      prevRisks.map(risk => 
        risk.riskId === updatedRisk.riskId ? updatedRisk : risk
      )
    );
    toast.success("Risk updated successfully");
    handleCloseModal();
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(search.toLowerCase()) ||
                          (risk.riskId || '').toLowerCase().includes(search.toLowerCase()) ||
                          (risk.principalOwner || "").toLowerCase().includes(search.toLowerCase());
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
        {/* Pass a callback to RiskRegistrationForm to refetch data after submission */}
        <RiskRegistrationForm onRiskRegistered={handleRiskRegistered} />
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
      <Card >
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="py-3 px-4 font-semibold w-15">Risk ID</th>
              <th className="py-3 px-4 font-semibold w-85">Risk Title</th>
              <th className="py-3 px-4 font-semibold w-48">Risk Owner</th>
              <th className="py-3 px-4 font-semibold w-64">Category</th>
              <th className="py-3 px-4 font-semibold w-24">Actions</th>
            </tr>
          </thead>
          
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading risks...
                    </div>
                  </td>
                </tr>
              ) : filteredRisks.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6">No risks found.</td></tr>
              ) : (
                filteredRisks.map((risk, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{risk.riskId}</td>
                    <td className="py-3 px-4">{risk.title}</td>
                    <td className="py-3 px-4">{risk.principalOwner}</td>
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