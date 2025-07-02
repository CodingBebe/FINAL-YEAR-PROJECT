import { useState, useEffect, useRef } from "react";
import RiskChampionRegistrationForm from "@/components/form/RiskChampionRegistrationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

// Make sure these units are defined only ONCE, ideally fetched from an API
// or a shared constant file if they are static and used across multiple components.
const units = [
  "DHRMA", "DSS", "UH",
  "DPGS", "DUS", "DES", "Principals",
  "Deans", "Directors",
  "DRP", "DPS",
  "IPMO", "DIEN",
  "TDTC", "DSS/Commandant Auxiliary Police",
  "DoSS", "SoAF",
  "CoNAS", "CoET",
  "Auxiliary Police", "DICT",
  "DLS", "PMU",
  "QAU", "DoF",
  "CCC & STC",
  "DPDI", "DICA", "CMU",
];

const RiskChampionsPage = () => {
  // State for showing/hiding the registration form modal
  const [showForm, setShowForm] = useState(false);

  // State for champions data (using 'any' for now, consider defining an interface for better typing)
  const [champions, setChampions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  // activeTab is declared but not used in the provided snippet.
  const [activeTab, setActiveTab] = useState("champions");
  const [showActionsIdx, setShowActionsIdx] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState<any | null>(null);
  const [newUnit, setNewUnit] = useState("");
  const actionsMenuRef = useRef<HTMLDivElement>(null); // Specify ref type

  // --- NEW STATE FOR LOADING ---
  const [isLoading, setIsLoading] = useState(true); // Default to true as data loads on mount

  // Helper function to re-fetch champions (extracted for reusability)
  const fetchChampions = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch("http://localhost:3000/api/auth/risk-champions");
      if (!response.ok) throw new Error("Failed to fetch champions");
      const data = await response.json();
      setChampions(
        data.users.map((user: any) => ({
          ...user,
          unit: user.unit_id || user.unit || "",
          risks: 0,
          completion: 0,
          status: "Active",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        }))
      );
    } catch (error) {
      console.error("Error fetching champions:", error);
      toast.error("Failed to load champions data.");
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes (success or failure)
    }
  };

  useEffect(() => {
    fetchChampions(); // Initial fetch on component mount
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsIdx(null);
      }
    }
    if (showActionsIdx !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsIdx]);

  const handleRegister = async (champion: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register-risk-champion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(champion),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      await fetchChampions(); // Re-fetch champions after registration
      setShowForm(false); // Close the form modal
      toast.success("Risk champion registered successfully");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "An unexpected error occurred during registration.");
    }
  };

  // The previous fetchChampions function definition was here.
  // It's now correctly placed at the top and called from useEffect and handleRegister.

  const filteredChampions = champions.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.unit || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-1">Risk Champions</h1>
      <p className="text-muted-foreground mb-4">Manage Units' risk champions</p>
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search champions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-full md:w-64"
        />
        <div className="flex-1 flex justify-end md:justify-end">
          <Button onClick={() => setShowForm(true)} className="bg-primary text-white px-6 py-2 rounded-md font-semibold">
            Add Risk Champion
          </Button>
        </div>
      </div>

      {/* RiskChampionRegistrationForm Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto relative">
            {/* Close button for the modal */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <RiskChampionRegistrationForm
              units={units}
              onRegister={handleRegister}
              onCancel={() => setShowForm(false)} // Pass onCancel to close the modal
            />
          </div>
        </div>
      )}

      <Card>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="py-3 px-4 font-semibold w-15">Champion</th>
              <th className="py-3 px-4 font-semibold w-85">Unit</th>
              <th className="py-3 px-4 font-semibold w-48">Risks Submitted</th>
              <th className="py-3 px-4 font-semibold w-64">Completion Rate</th>
              <th className="py-3 px-4 font-semibold w-24">Status</th>
              <th className="py-3 px-4 font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? ( // Conditional rendering based on isLoading state
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    {/* Basic spinner */}
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading champions...
                  </div>
                </td>
              </tr>
            ) : filteredChampions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">No champions found.</td>
              </tr>
            ) : (
              filteredChampions.map((champ, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 flex items-center space-x-3">
                    <img
                      src={champ.avatar}
                      alt={champ.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <div className="font-semibold">{champ.name}</div>
                      <div className="text-xs text-gray-500">{champ.email}</div>
                    </div>
                  </td>
                  <td className="py-2 px-4">{champ.unit}</td>
                  <td className="py-2 px-4">{champ.risks}</td>
                  <td className="py-2 px-4">{champ.completion}%</td>
                  <td className="py-2 px-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{champ.status}</span>
                  </td>
                  <td className="py-2 px-4 text-center" style={{ position: "relative" }}>
                    <button
                      className="bg-blue-50 text-blue-700 rounded-xl px-4 py-2 font-medium shadow-sm hover:bg-blue-100 border border-blue-100 transition"
                      onClick={() => {
                        setShowActionsIdx(idx);
                        setSelectedChampion(champ);
                      }}
                    >
                      View
                    </button>
                    {showActionsIdx === idx && (
                      <div ref={actionsMenuRef} className="absolute bg-white border rounded shadow-lg mt-2 right-0 z-10">
                        <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => { setShowUpdateModal(true); setShowActionsIdx(null); setNewUnit(champ.unit); }}>Update Unit</button>
                        <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600" onClick={() => { setShowDeleteModal(true); setShowActionsIdx(null); }}>Delete Champion</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Existing Update Modal */}
      {showUpdateModal && selectedChampion && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowUpdateModal(false)}>&times;</button>
            <h2 className="text-xl font-semibold mb-4">Update Unit</h2>
            <select
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="">Select unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                try {
                  console.log("Updating champion:", selectedChampion._id, "with unit:", newUnit);
                  const response = await fetch(`http://localhost:3000/api/auth/risk-champions/${selectedChampion._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ unit_id: newUnit }),
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update unit");
                  }

                  setShowUpdateModal(false);
                  await fetchChampions(); // Re-fetch champions after update
                  toast.success("Unit updated successfully");
                } catch (error: any) {
                  console.error("Update error:", error);
                  toast.error(error.message);
                }
              }}>Update</Button>
            </div>
          </div>
        </div>
      )}
      {/* Existing Delete Champion Modal */}
      {showDeleteModal && selectedChampion && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowDeleteModal(false)}>&times;</button>
            <h2 className="text-xl font-semibold mb-4">Delete Risk Champion</h2>
            <p>Are you sure you want to delete <span className="font-semibold">{selectedChampion.email}</span>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" onClick={async () => {
                try {
                  console.log("Deleting champion:", selectedChampion._id);
                  const response = await fetch(`http://localhost:3000/api/auth/risk-champions/${selectedChampion._id}`, {
                    method: "DELETE"
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to delete champion");
                  }

                  setShowDeleteModal(false);
                  await fetchChampions(); // Re-fetch champions after deletion
                  toast.success("Champion deleted successfully");
                } catch (error: any) {
                  console.error("Delete error:", error);
                  toast.error(error.message);
                }
              }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskChampionsPage;