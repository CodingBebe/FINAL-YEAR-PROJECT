import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterRisk() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement risk submission
    setTimeout(() => {
      setLoading(false);
      navigate("/champion/risks");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Register New Risk</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to register a new risk
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Risk Title</Label>
              <Input
                id="title"
                placeholder="Enter risk title"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="health">Health & Safety</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Supporting Owner</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supporting owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="science">Faculty of Science</SelectItem>
                    <SelectItem value="ict">College of ICT</SelectItem>
                    <SelectItem value="education">Faculty of Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the risk in detail"
                required
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Risk"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/champion/risks")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 