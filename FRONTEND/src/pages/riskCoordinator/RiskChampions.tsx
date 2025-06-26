import { useState } from "react";
import RiskChampionRegistrationForm from "@/components/form/RiskChampionRegistrationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RiskChampionsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("champions");

  const handleRegister = (champion) => {
    setChampions([
      ...champions,
      {
        ...champion,
        risks: 0,
        completion: 0,
        status: "Active",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // Placeholder
      },
    ]);
    setShowForm(false);
  };

  const filteredChampions = champions.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Risk Champions</h1>
          <p className="text-gray-500">Manage Units' risk champions</p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => setShowForm(true)}>
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
        <div className="bg-white rounded-lg shadow p-6">
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
          <div className="overflow-x-auto">
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
                    <td className="py-2 px-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600">
                        <span className="text-xl">&#8942;</span>
                      </button>
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
    </div>
  );
};

export default RiskChampionsPage;