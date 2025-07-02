import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { isWithinInterval, startOfQuarter, endOfQuarter } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Submission {
  id: string;
  title: string;
  principalOwner: string;
  quarter: string;
  year: string;
  submissionDate: Date;
}

export default function MySubmissions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterQuarter, setFilterQuarter] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  useEffect(() => {
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
        console.error("MySubmissions fetch error:", err);
      }
    };
    fetchSubmissions();
  }, []);

  // Get unique quarters and years for filters
  const availableQuarters = Array.from(new Set(submissions.map(s => s.quarter))).filter(q => q && q !== "-");
  const availableYears = Array.from(new Set(submissions.map(s => s.year))).filter(y => y && y !== "-");

  // Filter submissions based on selected quarter and year
  const filteredSubmissions = submissions.filter(submission => {
    const quarterMatch = filterQuarter === "all" || submission.quarter === filterQuarter;
    const yearMatch = filterYear === "all" || submission.year === filterYear;
    return quarterMatch && yearMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Submissions</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select value={filterQuarter} onValueChange={setFilterQuarter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Quarter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quarters</SelectItem>
            {availableQuarters.map(quarter => (
              <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterYear} onValueChange={setFilterYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableYears.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="bg-white rounded shadow p-4 flex flex-col gap-2 border">
            <div className="font-bold text-lg">{submission.title}</div>
            <div className="text-gray-700">Principal Owner: <span className="font-medium">{submission.principalOwner}</span></div>
            <div className="text-gray-500">Quarter: {submission.quarter} | Year: {submission.year}</div>
            <div className="text-xs text-gray-400 mt-2">Submitted: {submission.submissionDate.toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">No submissions found.</p>
        </div>
      )}
    </div>
  );
} 