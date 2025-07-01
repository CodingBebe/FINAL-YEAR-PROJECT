import { useEffect, useState, useMemo } from "react";
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
import { riskApi } from "@/services/api";

export default function Risks() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRisks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await riskApi.getChampionRisks();
        setRisks(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch risks");
      } finally {
        setLoading(false);
      }
    };
    fetchRisks();
  }, []);

  // Filter risks based on search query and category
  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      const matchesSearch = 
        risk.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.supportingOwners?.join(", ").toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        categoryFilter === "all" || 
        risk.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [risks, searchQuery, categoryFilter]);

  if (loading) return <div>Loading risks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
            <TableHead>Principal Owner</TableHead>
            <TableHead>Supporting Owners</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRisks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No risks found matching your search criteria
              </TableCell>
            </TableRow>
          ) : (
            filteredRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.id}</TableCell>
                <TableCell>{risk.title}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>{risk.principalOwner || '-'}</TableCell>
                <TableCell>{Array.isArray(risk.supportingOwners) ? risk.supportingOwners.join(', ') : '-'}</TableCell>
                <TableCell>{risk.rating ?? '-'}</TableCell>
                <TableCell>{risk.createdAt ? new Date(risk.createdAt).toLocaleDateString() : '-'}</TableCell>
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