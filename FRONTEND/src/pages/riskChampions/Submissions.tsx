import { useState, useEffect } from "react";
import { SubmissionCard } from "@/components/submissions/SubmissionCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { isWithinInterval, startOfQuarter, endOfQuarter, parseISO } from "date-fns";

interface Submission {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  quarter: string;
  status: "draft" | "submitted" | "approved" | "rejected";
}

export default function Submissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentQuarter, setCurrentQuarter] = useState<string>("");

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
    // Set current quarter
    setCurrentQuarter(getCurrentQuarter());

    // Fetch submissions (mock data for now)
    const mockSubmissions: Submission[] = [
      {
        id: "1",
        title: "IT Infrastructure Risk Assessment",
        description: "Quarterly assessment of IT infrastructure risks and mitigation measures",
        submissionDate: new Date(),
        quarter: getCurrentQuarter(),
        status: "draft"
      },
      {
        id: "2",
        title: "Budget Allocation Risk Report",
        description: "Analysis of budget-related risks for the current quarter",
        submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        quarter: getCurrentQuarter(),
        status: "submitted"
      },
      {
        id: "3",
        title: "Staff Training Gap Analysis",
        description: "Assessment of training-related risks and recommendations",
        submissionDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Previous quarter
        quarter: "Q4 2023",
        status: "approved"
      }
    ];

    setSubmissions(mockSubmissions);
  }, []);

  const handleNewSubmission = () => {
    router.push("/risk-champion/submissions/new");
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            {...submission}
            isEditable={
              isCurrentQuarter(submission.submissionDate) &&
              ["draft", "submitted"].includes(submission.status)
            }
          />
        ))}
      </div>

      {submissions.length === 0 && (
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