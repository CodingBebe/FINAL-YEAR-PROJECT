import { useState, useEffect, useRef } from "react";
import RiskChampionRegistrationForm from "@/components/form/RiskChampionRegistrationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const units = [
 "DHRMA", "DSS", "UH",
 "DPGS", "DUS", "DES", "Principals",
 "Deans",  "Directors",
 "DRP", "DPS", 
 "IPMO", "DIEN", 
 "TDTC","DSS/Commandant Auxiliary Police",
 "DoSS","SoAF",
 "CoNAS","CoET", 
 "Auxiliary Police","DICT", 
 "DLS",  "PMU", 
 "QAU","DoF", 
 "CCC & STC",
 "DPDI","DICA","CMU", 
];

const RiskChampionsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("champions");
  const [showActionsIdx, setShowActionsIdx] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [newUnit, setNewUnit] = useState("");
  const actionsMenuRef = useRef(null);

  useEffect(() => {
    async function fetchChampions() {
      try {
        const response = await fetch("http://localhost:3000/api/risk-champions");
        if (!response.ok) throw new Error("Failed to fetch champions");
        const data = await response.json();
        setChampions(
          data.users.map(user => ({
            ...user,
            unit: user.unit_id || user.unit || "",
            risks: 0,
            completion: 0,
            status: "Active",
            avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
          }))
        );
      } catch (error) {
        // Optionally show a toast or log error
      }
    }
    fetchChampions();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
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

  const handleRegister = async (champion) => {
    try {
      const response = await fetch("http://localhost:3000/api/register-risk-champion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(champion),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      // After successful registration, refetch champions from backend
      const championsResponse = await fetch("http://localhost:3000/api/risk-champions");
      if (!championsResponse.ok) throw new Error("Failed to fetch champions");
      const data = await championsResponse.json();
      setChampions(
        data.users.map(user => ({
          ...user,
          unit: user.unit_id || user.unit || "",
          risks: 0,
          completion: 0,
          status: "Active",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        }))
      );
      setShowForm(false);
      toast.success("Risk champion registered successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredChampions = champions.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.unit || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Risk Champions</h1>
          <p className="text-gray-500">Manage Units' risk champions</p>
        </div>
        <Button
          style={{ backgroundColor: "#22395D", color: "#fff" }}
          className="hover:bg-[#1a2b47]"
          onClick={() => setShowForm(true)}
        >
          + Add Risk Champion
        </Button>
      </div>
      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-medium ${activeTab === "champions" ? "bg-white shadow" : "bg-gray-100"}`}
          onClick={() => setActiveTab("champions")}
        >
          Risk Champions
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${activeTab === "performance" ? "bg-white shadow" : "bg-gray-100"}`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${activeTab === "training" ? "bg-white shadow" : "bg-gray-100"}`}
          onClick={() => setActiveTab("training")}
        >
          Training & Resources
        </button>
      </div>
      {activeTab === "champions" && (
        <div className="bg-white rounded-lg shadow p-6" /*style={{ overflow: "visible" }}*/>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Risk Champions</h2>
              <p className="text-gray-500 text-sm">Manage Units' risk champions and their responsibilities</p>
            </div>
            <Input
              className="w-64"
              placeholder="Search champions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Champion</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Unit</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Risks Submitted</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Completion Rate</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Status</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChampions.map((champ, idx) => (
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
                ))}
                {filteredChampions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">No champions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal for registration */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Register New Risk Champion</h2>
            <RiskChampionRegistrationForm onRegister={handleRegister} />
          </div>
        </div>
      )}
      {/* Update Unit Modal */}
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
                  const response = await fetch(`http://localhost:3000/api/risk-champions/${selectedChampion._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ unit_id: newUnit }),
                  });
                  
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update unit");
                  }
                  
                  setShowUpdateModal(false);
                  // Refresh champions
                  const championsResponse = await fetch("http://localhost:3000/api/risk-champions");
                  const data = await championsResponse.json();
                  setChampions(data.users.map(user => ({ ...user, unit: user.unit_id || user.unit || "", risks: 0, completion: 0, status: "Active", avatar: "https://randomuser.me/api/portraits/lego/1.jpg" })));
                  toast.success("Unit updated successfully");
                } catch (error) {
                  console.error("Update error:", error);
                  toast.error(error.message);
                }
              }}>Update</Button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Champion Modal */}
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
                  const response = await fetch(`http://localhost:3000/api/risk-champions/${selectedChampion._id}`, {
                    method: "DELETE"
                  });
                  
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to delete champion");
                  }
                  
                  setShowDeleteModal(false);
                  // Refresh champions
                  const championsResponse = await fetch("http://localhost:3000/api/risk-champions");
                  const data = await championsResponse.json();
                  setChampions(data.users.map(user => ({ ...user, unit: user.unit_id || user.unit || "", risks: 0, completion: 0, status: "Active", avatar: "https://randomuser.me/api/portraits/lego/1.jpg" })));
                  toast.success("Champion deleted successfully");
                } catch (error) {
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