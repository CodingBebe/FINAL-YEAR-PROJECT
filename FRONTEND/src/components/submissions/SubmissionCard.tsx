import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface SubmissionCardProps {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  quarter: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  isEditable: boolean;
}

export function SubmissionCard({
  id,
  title,
  description,
  submissionDate,
  quarter,
  status,
  isEditable,
}: SubmissionCardProps) {
  const navigate = useNavigate();

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

  const handleEdit = () => {
    navigate(`/risk-champion/submissions/edit/${id}`);
  };

  const handleView = () => {
    navigate(`/risk-champion/submissions/view/${id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Submitted {formatDistanceToNow(submissionDate)} ago</span>
          </div>
          <Badge variant="outline" className="mt-2">
            {quarter}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleView}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
        {isEditable && (
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleEdit}
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 