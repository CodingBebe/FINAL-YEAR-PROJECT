import React from "react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const submissions = [
  {
    riskId: "RISK-001",
    championName: "Alice Johnson",
    unit: "Finance",
  },
  {
    riskId: "RISK-002",
    championName: "Bob Smith",
    unit: "Operations",
  },
  {
    riskId: "RISK-003",
    championName: "Carol Lee",
    unit: "IT",
  },
];

const CoordinatorSubmissions: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Champion Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Champion Name</th>
              <th className="px-4 py-2 border-b">Unit</th>
              <th className="px-4 py-2 border-b">Risk ID</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.riskId}>
                <td className="px-4 py-2 border-b">{submission.championName}</td>
                <td className="px-4 py-2 border-b">{submission.unit}</td>
                <td className="px-4 py-2 border-b">{submission.riskId}</td>
                <td className="px-4 py-2 border-b">
                  <Link
                    to={`/coordinator/submissions/${submission.riskId}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinatorSubmissions;
