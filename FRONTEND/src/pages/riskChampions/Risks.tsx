import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye } from "lucide-react";

// Mock data for demonstration
const mockRisks = [
  {
    id: "A1",
    title: "Possibility of inadequate healthcare to University community members living with HIV/AIDS and Non-Communicable Diseases",
    category: "Health Safety and Welfare",
    supportingOwner: "Planning, Finance and Administration",
    status: "Open",
    rating: 25,
    severity: "High",
    lastUpdated: "2025-01-25",
  },
  {
    id: "B1",
    title: "Risk of non-compliance with National Anti-Corruption Requirements",
    category: "Compliance",
    supportingOwner: "Planning, Finance and Administration",
    status: "Open",
    rating: 20,
    severity: "Medium",
    lastUpdated: "2025-01-20",
  },
  {
    id: "B2",
    title: "Possibility of non-compliance to public service code of ethics and conduct",
    category: "Compliance",
    supportingOwner: "Planning, Finance and Administration",
    status: "Managing",
    rating: 18,
    severity: "Medium",
    lastUpdated: "2025-01-18",
  },
  {
    id: "C1",
    title: "Possibility of failure to sustainably run a standing scholarship programme.",
    category: "Academic",
    supportingOwner: "Deputy Vice Chancellor - Academic",
    status: "Open",
    rating: 22,
    severity: "High",
    lastUpdated: "2025-01-15",
  },
  {
    id: "C2",
    title: "Possibility of inadequate competences of university graduates",
    category: "Compliance",
    supportingOwner: "Planning, Finance and Administration",
    status: "Managing",
    rating: 17,
    severity: "Medium",
    lastUpdated: "2025-01-10",
  },
  {
    id: "C3",
    title: "Possibility of weak innovation and entrepreneurship skills to undergraduate students",
    category: "Innovation",
    supportingOwner: "Deputy Vice Chancellor - Academic",
    status: "Open",
    rating: 19,
    severity: "Medium",
    lastUpdated: "2025-01-08",
  },
  {
    id: "C4",
    title: "Possibility of inadequate examination processes",
    category: "Academic",
    supportingOwner: "Deputy Vice Chancellor – Academic",
    status: "Managing",
    rating: 16,
    severity: "Medium",
    lastUpdated: "2025-01-05",
  },
  {
    id: "D1",
    title: "Possibility of inadequate number and quality of research output",
    category: "Research & Consultancy",
    supportingOwner: "Deputy Vice Chancellor - Research",
    status: "Open",
    rating: 21,
    severity: "High",
    lastUpdated: "2025-01-03",
  },
  {
    id: "D2",
    title: "Possibility of attracting insufficient number of and amount of funds from consultancy projects",
    category: "Research & Consultancy",
    supportingOwner: "Deputy Vice Chancellor – Research",
    status: "Managing",
    rating: 15,
    severity: "Medium",
    lastUpdated: "2025-01-02",
  },
  {
    id: "D3",
    title: "Possibility of failure to harness technological development",
    category: "Research & Consultancy",
    supportingOwner: "Deputy Vice Chancellor – Research",
    status: "Open",
    rating: 18,
    severity: "Medium",
    lastUpdated: "2025-01-01",
  },
  {
    id: "D4",
    title: "Possibility of inadequate quality of UDSM journals",
    category: "Research & Consultancy",
    supportingOwner: "Deputy Vice Chancellor - Research",
    status: "Managing",
    rating: 14,
    severity: "Medium",
    lastUpdated: "2024-12-30",
  },
];

export default function Risks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  // Filter risks based on search query and category
  const filteredRisks = useMemo(() => {
    return mockRisks.filter((risk) => {
      const matchesSearch = 
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.supportingOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        categoryFilter === "all" || 
        risk.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Risks Register</h1>
          <p className="text-sm text-muted-foreground">View and manage all identified risks across the university</p>
        </div>
        <Button asChild>
          <Link to="/champion/register-risk">
            <Plus className="mr-2 h-4 w-4" />
            Register New Risk
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search risks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Strategic">Strategic</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Health & Safety">Health & Safety</SelectItem>
            <SelectItem value="Financial">Financial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Risk Id</TableHead>
            <TableHead>Risk Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Supporting Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRisks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No risks found matching your search criteria
              </TableCell>
            </TableRow>
          ) : (
            filteredRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.id}</TableCell>
                <TableCell>{risk.title}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>{risk.supportingOwner}</TableCell>
                <TableCell>{risk.status}</TableCell>
                <TableCell>{risk.rating}</TableCell>
                <TableCell>{risk.severity}</TableCell>
                <TableCell>{risk.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/champion/risks/${risk.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/champion/risks/${risk.id}/report`)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 