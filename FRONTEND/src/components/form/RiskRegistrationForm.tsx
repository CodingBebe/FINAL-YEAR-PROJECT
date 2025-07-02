import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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

const STRATEGIC_OBJECTIVES = [
  { value: "A:Incidence and impacts of HIV/AIDS and non-communicable diseases reduced.",
    label: "A. Incidence and impacts of HIV/AIDS and non-communicable diseases reduced" },
  { value: "B:The National Anti-Corruption Strategy and Action Plan effectively implemented.", 
    label: "B. The National Anti-Corruption Strategy and Action Plan effectively implemented" },
  { value: "C:Quality, relevance and responsiveness of undergraduate training, leadership in postgraduate training and industry linkages enhanced.", 
    label: "C. Quality, relevance and responsiveness of undergraduate training, leadership in postgraduate training and industry linkages enhanced" },
  { value: "D:Research, innovation, and knowledge exchange enhanced.", 
    label: "D. Research, innovation, and knowledge exchange enhanced" },
  { value: "E:Governance, Leadership and Management Systems and Processes Strengthened.", 
    label: "E. Governance, Leadership and Management Systems and Processes Strengthened." },
  { value: "F:Internationalization, marketing and visibility.", 
    label: "F. Internationalization, marketing and visibility" },
  { value: "G:Institutional capacity and operational efficiency strengthened.", 
    label: "G. Institutional capacity and operational efficiency strengthened" },
];
interface RiskRegistrationFormProps {
  onRiskRegistered?: () => void; // This defines the prop as an optional function that takes no arguments and returns nothing
  onCancel?: () => void;
 }

const RiskRegistrationForm : React.FC<RiskRegistrationFormProps> = ({ onRiskRegistered, onCancel }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

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
    causes: [""],
    consequences: [""],
    existingControls: [""],
    proposedMitigation: [""],
    targets: [""]
  });

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
  
const validateForm = () => {
  // Check all required fields
  const requiredFields = [
    'title', 'riskId', 'strategicObjective', 'description', 'principalOwner', 'category', 'likelihood', 'impact'
  ];
  for (const field of requiredFields) {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      return `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    }
  }
  // Supporting owners: at least one
  if (!formData.supportingOwners || formData.supportingOwners.length === 0) {
    return 'Please select at least one supporting risk owner';
  }
  // Array fields: at least one non-empty value
  const arrayFields = ['causes', 'consequences', 'existingControls', 'proposedMitigation', 'targets'];
  for (const field of arrayFields) {
    if (!formData[field] || formData[field].length === 0 || formData[field].every((v) => !v || v.trim() === '')) {
      return `Please provide at least one ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    }
  }
  return null;
};

const handleSubmit = async () => {
  const validationError = validateForm();
  if (validationError) {
    toast.error(validationError);
    return;
  }
  setIsSubmitting(true);
  const submitData = { ...formData };
  try {
    const response = await fetch("http://localhost:3000/api/risks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit form");
    }
    toast.success("Risk registered successfully");
    if (onRiskRegistered) {
      onRiskRegistered();
    } else {
      navigate("/coordinator/register-risk");
    }
  } catch (error) {
    toast.error(error.message);
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

  // Handlers for dynamic array fields
  const handleArrayChange = (field, idx, value) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };
  const handleAddArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };
  const handleRemoveArrayItem = (field, idx) => {
    setFormData((prev) => {
      const arr = prev[field].filter((_, i) => i !== idx);
      return { ...prev, [field]: arr.length ? arr : [""] };
    });
  };

  // Add debug log for activeTab
  console.log('Current activeTab:', activeTab);

  return (
    <div>
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
                <Textarea
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
      {STRATEGIC_OBJECTIVES.map(obj => (
        <SelectItem key={obj.value} value={obj.value}>{obj.label}</SelectItem>
      ))}
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
                    <SelectItem value="DVC-Planning, Finance and Administration">Deputy Vice Chancellor - Planning, Finance and Administration</SelectItem>
                    <SelectItem value="DVC-Academic">Deputy Vice Chancellor - Academic</SelectItem>
                    <SelectItem value="DVC-Research">Deputy Vice Chancellor - Research</SelectItem>
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
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Fraud and Corruption">Fraud and Corruption</SelectItem>
                    <SelectItem value="Governance">Governance</SelectItem>
                    <SelectItem value="Health, Safety and Welfare">Health, Safety and Welfare</SelectItem>
                    <SelectItem value="Human capital">Human capital</SelectItem>
                    <SelectItem value="ICT">ICT</SelectItem>
                    <SelectItem value="Infrastructure Management">Infrastructure Management</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Research & consultancy">Research & Consultancy</SelectItem>
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
                {formData.causes.map((cause, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      name={`cause-${idx}`}
                      value={cause}
                      onChange={e => handleArrayChange('causes', idx, e.target.value)}
                      placeholder={`Cause ${idx + 1}`}
                    />
                    <Button type="button" variant="outline" onClick={() => handleRemoveArrayItem('causes', idx)}>-</Button>
                    {idx === formData.causes.length - 1 && (
                      <Button type="button" variant="outline" onClick={() => handleAddArrayItem('causes')}>+</Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="consequences">Consequences</Label>
                {formData.consequences.map((consequence, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      name={`consequence-${idx}`}
                      value={consequence}
                      onChange={e => handleArrayChange('consequences', idx, e.target.value)}
                      placeholder={`Consequence ${idx + 1}`}
                    />
                    <Button type="button" variant="outline" onClick={() => handleRemoveArrayItem('consequences', idx)}>-</Button>
                    {idx === formData.consequences.length - 1 && (
                      <Button type="button" variant="outline" onClick={() => handleAddArrayItem('consequences')}>+</Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mitigation" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existingControls">Existing Controls</Label>
                {formData.existingControls.map((control, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      name={`control-${idx}`}
                      value={control}
                      onChange={e => handleArrayChange('existingControls', idx, e.target.value)}
                      placeholder={`Control ${idx + 1}`}
                    />
                    <Button type="button" variant="outline" onClick={() => handleRemoveArrayItem('existingControls', idx)}>-</Button>
                    {idx === formData.existingControls.length - 1 && (
                      <Button type="button" variant="outline" onClick={() => handleAddArrayItem('existingControls')}>+</Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposedMitigation">Proposed Mitigation</Label>
                {formData.proposedMitigation.map((mitigation, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      name={`mitigation-${idx}`}
                      value={mitigation}
                      onChange={e => handleArrayChange('proposedMitigation', idx, e.target.value)}
                      placeholder={`Mitigation ${idx + 1}`}
                    />
                    <Button type="button" variant="outline" onClick={() => handleRemoveArrayItem('proposedMitigation', idx)}>-</Button>
                    {idx === formData.proposedMitigation.length - 1 && (
                      <Button type="button" variant="outline" onClick={() => handleAddArrayItem('proposedMitigation')}>+</Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Targets */}
              <Label>Targets</Label>
              {formData.targets.map((target, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    name={`target-${idx}`}
                    value={target}
                    onChange={e => handleArrayChange('targets', idx, e.target.value)}
                    placeholder={`Target ${idx + 1}`}
                  />
                  <Button type="button" variant="outline" onClick={() => handleRemoveArrayItem('targets', idx)}>-</Button>
                  {idx === formData.targets.length - 1 && (
                    <Button type="button" variant="outline" onClick={() => handleAddArrayItem('targets')}>+</Button>
                  )}
              </div>
              ))}
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
              <Button
                ref={submitBtnRef}
                type="button"
                className="w-full bg-primary text-white"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Registering..." : "Register Risk"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RiskRegistrationForm;
