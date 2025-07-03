import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CoordinatorSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3000/api/submissions");
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.data);
        } else {
          setError("Failed to fetch submissions");
        }
      } catch (err) {
        setError("Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Champion Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Principal Owner</th>
              <th className="px-4 py-2 border-b">Unit</th>
              <th className="px-4 py-2 border-b">Risk ID</th>
              
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="text-center py-4 text-red-500">{error}</td></tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No submissions found.
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <tr key={submission._id}>
                  <td className="px-4 py-2 border-b">{submission.principalOwner}</td>
                  <td className="px-4 py-2 border-b">{submission.unit_id}</td>
                  <td className="px-4 py-2 border-b">{submission.riskId}</td>
                  <td className="px-4 py-2 border-b">
                    
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinatorSubmissions;
