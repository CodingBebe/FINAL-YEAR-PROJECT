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
  description: string;
  submissionDate: Date;
  quarter: string;
  status: "draft" | "submitted" | "approved" | "rejected";
}

export default function MySubmissions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterQuarter, setFilterQuarter] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Function to determine if a submission is within the current quarter
  const isCurrentQuarter = (date: Date) => {
    const now = new Date();
    const quarterStart = startOfQuarter(now);
    const quarterEnd = endOfQuarter(now);
    return isWithinInterval(date, { start: quarterStart, end: quarterEnd });
  };

  // Function to get current quarter string
  const getCurrentQuarter = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
  };

  useEffect(() => {
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
        submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        quarter: getCurrentQuarter(),
        status: "submitted"
      },
      {
        id: "3",
        title: "Staff Training Gap Analysis",
        description: "Assessment of training-related risks and recommendations",
        submissionDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        quarter: "Q4 2023",
        status: "approved"
      }
    ];

    setSubmissions(mockSubmissions);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    if (!isCurrentQuarter(submission.submissionDate)) {
      toast({
        title: "Cannot Edit",
        description: "You can only edit submissions from the current quarter.",
        variant: "destructive"
      });
      return;
    }

    if (!["draft", "submitted"].includes(submission.status)) {
      toast({
        title: "Cannot Edit",
        description: "You can only edit draft or submitted submissions.",
        variant: "destructive"
      });
      return;
    }

    navigate(`/risk-champion/submissions/edit/${submissionId}`);
  };

  const handleView = (submissionId: string) => {
    navigate(`/risk-champion/submissions/view/${submissionId}`);
  };

  // Filter submissions based on selected quarter and status
  const filteredSubmissions = submissions.filter(submission => {
    const quarterMatch = filterQuarter === "all" || submission.quarter === filterQuarter;
    const statusMatch = filterStatus === "all" || submission.status === filterStatus;
    return quarterMatch && statusMatch;
  });

  // Get available quarters for filtering
  const availableQuarters = Array.from(new Set(submissions.map(s => s.quarter))).sort().reverse();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Submissions</h1>
          <p className="text-gray-600">Current Quarter: {getCurrentQuarter()}</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-4">
              <Select
                value={filterQuarter}
                onValueChange={setFilterQuarter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quarters</SelectItem>
                  {availableQuarters.map(quarter => (
                    <SelectItem key={quarter} value={quarter}>
                      {quarter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{submission.title}</h3>
                  <p className="text-sm text-gray-600">{submission.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{submission.quarter}</Badge>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(submission.id)}
                  >
                    View
                  </Button>
                  {(isCurrentQuarter(submission.submissionDate) && 
                    ["draft", "submitted"].includes(submission.status)) && (
                    <Button
                      size="sm"
                      onClick={() => handleEdit(submission.id)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No submissions found matching your filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setFilterQuarter("all");
                setFilterStatus("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 