import { useState, useEffect } from "react";
import { SubmissionCard } from "@/components/submissions/SubmissionCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isWithinInterval, startOfQuarter, endOfQuarter, parseISO } from "date-fns";

interface Submission {
  id: string;
  title: string;
  principalOwner: string;
  quarter: string;
  year: string;
  submissionDate: Date;
}

export default function Submissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentQuarter, setCurrentQuarter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Function to determine if a submission is within the current quarter
  const isCurrentQuarter = (date: Date) => {
    const now = new Date();
    const quarterStart = startOfQuarter(now);
    const quarterEnd = endOfQuarter(now);
    return isWithinInterval(date, { start: quarterStart, end: quarterEnd });
  };

  // Function to get current quarter string (e.g., "Q1 2024")
  const getCurrentQuarter = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
  };

  useEffect(() => {
    setCurrentQuarter(getCurrentQuarter());
    // Fetch real submissions from backend
    const fetchSubmissions = async () => {
      try {
        setError(null);
        const res = await fetch("http://localhost:3000/api/submissions", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSubmissions(
            data.data.map((s: any) => ({
              id: s._id,
              title: s.riskTitle ?? s.title ?? "Untitled Submission",
              principalOwner: s.principalOwner ?? "-",
              quarter: s.timePeriod ?? "-",
              year: s.year ?? "-",
              submissionDate: s.createdAt ? new Date(s.createdAt) : new Date(),
              riskId: s.riskId || s._id,
            }))
          );
        } else {
          setSubmissions([]);
          setError("No submissions found in the database.");
        }
      } catch (err: any) {
        setSubmissions([]);
        setError("Failed to fetch submissions: " + (err.message || err));
        // Also log to console for debugging
        console.error("Submissions fetch error:", err);
      }
    };
    fetchSubmissions();
  }, []);

  const handleNewSubmission = () => {
    navigate("/risk-champion/submissions/new");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Risk Submissions</h1>
          <p className="text-gray-600">Current Quarter: {currentQuarter}</p>
        </div>
        <Button
          onClick={handleNewSubmission}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Submission
        </Button>
      </div>

      {error && (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="bg-white rounded shadow p-4 flex flex-col gap-2 border">
            <div className="font-bold text-lg">{submission.title}</div>
            <div className="text-gray-700">Principal Owner: <span className="font-medium">{submission.principalOwner}</span></div>
            <div className="text-gray-500">Quarter: {submission.quarter} | Year: {submission.year}</div>
            <div className="text-xs text-gray-400 mt-2">Submitted: {submission.submissionDate.toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {submissions.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">No submissions found for this quarter.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleNewSubmission}
          >
            Create your first submission
          </Button>
        </div>
      )}
    </div>
  );
} 