import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReactSelect from "react-select"; 
import {Select,  SelectContent,  SelectItem,  SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { stat } from "fs";

const RiskRegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    riskId: "",
    strategicObjective: "", 
    description: "",
    principalOwner: "",
    supportingOwners: [],
    category: "",
    likelihood: "",
    impact: "",
    causes: "",
    consequences: "",
    existingControls: "",
    proposedMitigation: "",
  });

const [strategicObjectives, setStrategicObjectives] = useState([]);
  const [loadingObjectives, setLoadingObjectives] = useState(true);

  useEffect(() => {
    const fetchStrategicObjectives = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/strategic-objectives");
        const data = await res.json();
        setStrategicObjectives(data);
      } catch (error) {
        console.error("Failed to load strategic objectives", error);
      } finally {
        setLoadingObjectives(false);
      }
    };

    fetchStrategicObjectives();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSupportingOwnerChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newOwners = checked
        ? [...prev.supportingOwners, value]
        : prev.supportingOwners.filter((owner) => owner !== value);
      return { ...prev, supportingOwners: newOwners };
    });
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:3000/api/risks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit form");
    }

    toast({
      title: "Risk Registered",
      description: "The risk has been successfully registered.",
    });

    setTimeout(() => {
      navigate("/coordinator/dashboard");
    }, 1500);
  } catch (error) {
    toast({
      title: "Submission Failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const nextTab = () => {
    if (activeTab === "details") setActiveTab("assessment");
    else if (activeTab === "assessment") setActiveTab("mitigation");
  };

  const prevTab = () => {
    if (activeTab === "mitigation") setActiveTab("assessment");
    else if (activeTab === "assessment") setActiveTab("details");
  };

  const supportingOwnerOptions = [
    { value: "DHRMA", label: "DHRMA" },
    { value: "DSS", label: "DSS" },
    { value: "UH", label: "UH" },
    { value: "DPGS", label: "DPGS" },
    { value: "DUS", label: "DUS" },
    { value: "DES", label: "DES" },
    { value: "Principals", label: "Principals" },
    { value: "Deans", label: "Deans" },
    { value: "Directors", label: "Directors" },
    { value: "DRP", label: "DRP" },
    { value: "DPS", label: "DPS" },
    { value: "IPMO", label: "IPMO" },
    { value: "DIEN", label: "DIEN" },
    { value: "TDTC", label: "TDTC" },
    { value: "DSS/Commandant Auxiliary Police", label: "DSS/Commandant Auxiliary Police" },
    { value: "DoSS", label: "DoSS" },
    { value: "SoAF", label: "SoAF" },
    { value: "CoNAS", label: "CoNAS" },
    { value: "CoET", label: "CoET" },
    { value: "Auxiliary Police", label: "Auxiliary Police" },
    { value: "DICT", label: "DICT" },
    { value: "DLS", label: "DLS" },
    { value: "PMU", label: "PMU" },
    { value: "QAU", label: "QAU" },
    { value: "DoF", label: "DoF" },
    { value: "CCC & STC", label: "CCC & STC" },
    { value: "DPDI", label: "DPDI" },
    { value: "DICA", label: "DICA" },
    { value: "CMU", label: "CMU" },
  ];



  // Calculate rating automatically
  const calculateRating = () => {
    const impact = parseInt(formData.impact || "0");
    const likelihood = parseInt(formData.likelihood || "0");
    return impact * likelihood;
  };

  const getRatingLevel = (likelihood: number, impact: number) => {
    const pair = [likelihood, impact];

    const low = [
      [4, 1], [3, 1], [2, 1], [2, 2],
      [1, 1], [1, 2], [1, 3], [1, 4],
    ];

    const moderate = [
      [5, 1], [4, 2], [3, 2], [3, 3],
      [2, 3], [2, 4], [1, 5],
    ];

    const high = [
      [5, 2], [4, 3], [3, 4], [2, 5],
    ];

    const veryHigh = [
      [5, 3], [5, 4], [5, 5],
      [4, 4], [4, 5], [3, 5],
    ];

    const isMatch = (list: number[][]) =>
      list.some(([l, i]) => l === likelihood && i === impact);

    if (isMatch(veryHigh)) return { level: "Very High", color: "text-red-600 bg-red-50" };
    if (isMatch(high)) return { level: "High", color: "text-orange-600 bg-orange-50" };
    if (isMatch(moderate)) return { level: "Moderate", color: "text-yellow-600 bg-yellow-50" };
    if (isMatch(low)) return { level: "Low", color: "text-green-600 bg-green-50" };

    return { level: "Not Calculated", color: "text-gray-500 bg-gray-50" };
  };



  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Register New Risk</CardTitle>
          <CardDescription>
            Fill in the details to register a new risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Risk Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter risk title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskId">Risk ID</Label>
                <Input
                  id="riskId"
                  name="riskId"
                  value={formData.riskId}
                  onChange={handleChange}
                  placeholder="Enter unique risk identifier"
                  required
                />
              </div>

          <div className="space-y-2">
  <Label htmlFor="strategicObjective">Strategic Objective</Label>
  <Select
    value={formData.strategicObjective}
    onValueChange={(value) => handleSelectChange("strategicObjective", value)}
  >
    <SelectTrigger id="strategicObjective">
      <SelectValue placeholder="Select strategic objective" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="A">A-Enhance Academic Excellence</SelectItem>
      <SelectItem value="B">B-Promote Research and Innovation</SelectItem>
      <SelectItem value="C">C-Improve Institutional Sustainability</SelectItem>
      <SelectItem value="D">D-Strengthen Community Engagement</SelectItem>
         </SelectContent>
  </Select>
</div>


              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the risk in detail"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principalOwner">Principal Risk Owner</Label>
                <Select
                  value={formData.principalOwner}
                  onValueChange={(value) => handleSelectChange("principalOwner", value)}
                >
                  <SelectTrigger id="principalOwner">
                    <SelectValue placeholder="Select principal owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VC-OFFICE">Vice Chancellor Office</SelectItem>
                    <SelectItem value="DVC-PFA">Deputy Vice Chancellor - Planning, Finance and Administration</SelectItem>
                    <SelectItem value="DVC-AC">Deputy Vice Chancellor - Academic</SelectItem>
                    <SelectItem value="DVC-RS">Deputy Vice Chancellor - Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>



              <div className="space-y-2">
                <Label>Supporting Risk Owner(s)</Label>
                <ReactSelect
                  isMulti
                  name="supportingOwners"
                  options={supportingOwnerOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select the supporting risk owner(s)"
                  value={supportingOwnerOptions.filter(option => formData.supportingOwners.includes(option.value))}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      supportingOwners: selected ? selected.map((opt) => opt.value) : [],
                    }))
                  }
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select risk category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="fraud-corruption">Fraud and Corruption</SelectItem>
                    <SelectItem value="governance">Governance</SelectItem>
                    <SelectItem value="health-safety-welfare">Health, Safety and Welfare</SelectItem>
                    <SelectItem value="human-capital">Human capital</SelectItem>
                    <SelectItem value="ict">ICT</SelectItem>
                    <SelectItem value="infrastructure-management">Infrastructure Management</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="research-consultancy">Research & Consultancy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="likelihood">Inherent Likelihood</Label>
                  <Select
                    value={formData.likelihood}
                    onValueChange={(value) => handleSelectChange("likelihood", value)}
                  >
                    <SelectTrigger id="likelihood">
                      <SelectValue placeholder="Inherent likelihood" className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Very Low</SelectItem>
                      <SelectItem value="2">2 - Low</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - High</SelectItem>
                      <SelectItem value="5">5 - Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impact">Inherent Impact</Label>
                  <Select
                    value={formData.impact}
                    onValueChange={(value) => handleSelectChange("impact", value)}
                  >
                    <SelectTrigger id="impact">
                      <SelectValue placeholder="Inherent impact" className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Very Low</SelectItem>
                      <SelectItem value="2">2 - Low</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - High</SelectItem>
                      <SelectItem value="5">5 - Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
<div className="space-y-2">
  <Label htmlFor="rating">Risk Rating</Label>
  <div className="flex items-center space-x-3">
    <div className="flex-1">
      <div className="px-3 py-2 border border-input rounded-md bg-muted">
        <span className="text-sm text-muted-foreground">
          {formData.impact && formData.likelihood
            ? `${formData.likelihood} × ${formData.impact} = ${parseInt(formData.likelihood) * parseInt(formData.impact)}`
            : "Select impact and likelihood to calculate"}
        </span>
      </div>
    </div>


                  {formData.impact && formData.likelihood && (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingLevel(parseInt(formData.likelihood), parseInt(formData.impact)).color
                      }`}>
                      {getRatingLevel(parseInt(formData.likelihood), parseInt(formData.impact)).level}
                    </div>
                  )}
                </div>

                {formData.impact && formData.likelihood && (
                  <div className="text-xs text-muted-foreground">
Rating Scale: Low (1-4) • Moderate (5-9) • High (10-12) • Very High (15-25) — based on (likelihood * impact) combinations
                  </div>
                )}
              </div>


              <Separator />

              <div className="space-y-2">
                <Label htmlFor="causes">Causes</Label>
                <Textarea
                  id="causes"
                  name="causes"
                  value={formData.causes}
                  onChange={handleChange}
                  placeholder="List possible causes of the risk"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consequences">Consequences</Label>
                <Textarea
                  id="consequences"
                  name="consequences"
                  value={formData.consequences}
                  onChange={handleChange}
                  placeholder="Describe the possible consequences"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="mitigation" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existingControls">Existing Controls</Label>
                <Textarea
                  id="existingControls"
                  name="existingControls"
                  value={formData.existingControls}
                  onChange={handleChange}
                  placeholder="Describe current controls in place"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposedMitigation">Proposed Mitigation</Label>
                <Textarea
                  id="proposedMitigation"
                  name="proposedMitigation"
                  value={formData.proposedMitigation}
                  onChange={handleChange}
                  placeholder="Describe your mitigation strategies"
                  rows={4}
                  required
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {activeTab !== "details" && (
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous
              </Button>
            )}
          </div>
          <div className="space-x-2">
            {activeTab !== "mitigation" ? (
              <Button type="button" onClick={nextTab}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Register Risk"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default RiskRegistrationForm;
