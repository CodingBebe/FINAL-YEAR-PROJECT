import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { riskApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const RegisterRisk = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [causes, setCauses] = useState("");
  const [consequences, setConsequences] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !description || !causes || !consequences) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setIsLoading(true);
    try {
      await riskApi.registerRisk({
        title,
        description,
        causes,
        consequences,
      });

      toast({
        title: "Success",
        description: "Risk registered successfully",
      });

      // Clear form and navigate back to risks list
      setTitle("");
      setDescription("");
      setCauses("");
      setConsequences("");
      navigate("/champion/risks");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to register risk. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Register New Risk</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Details</CardTitle>
            <CardDescription>Enter the details of the risk you want to register</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Risk Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear and concise title"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Risk Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the risk in detail"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="causes">Risk Causes</Label>
              <Textarea
                id="causes"
                value={causes}
                onChange={(e) => setCauses(e.target.value)}
                placeholder="What are the potential causes of this risk?"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="consequences">Risk Consequences</Label>
              <Textarea
                id="consequences"
                value={consequences}
                onChange={(e) => setConsequences(e.target.value)}
                placeholder="What are the potential consequences if this risk occurs?"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/champion/risks")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Risk"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterRisk; 