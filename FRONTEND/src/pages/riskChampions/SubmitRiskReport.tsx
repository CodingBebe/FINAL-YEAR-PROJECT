import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock risk data - replace with actual API call
const mockRisks = [
  {
    id: "A1",
    title: "Possibility of inadequate healthcare to University",
    description: "Possibility of inadequate healthcare services",
    principalOwner: "Planning, Finance and Administration",
    supportingOwner: "DSS, DHRMA, UH",
    category: "Health Safety and Welfare",
    strategicObjective: "Incidence and impacts of HIV/AIDS",
    targets: ["Provide Health education /Counselling"]
  },
  {
    id: "B1",
    title: "Risk of non-compliance with National Anti-Corruption Requirements",
    description: "Compliance with anti-corruption regulations and requirements",
    principalOwner: "Planning, Finance and Administration",
    supportingOwner: "Planning, Finance and Administration",
    category: "Compliance",
    strategicObjective: "Ensure compliance with national requirements",
    targets: ["Regular compliance audits", "Staff training"]
  },
  {
    id: "B2",
    title: "Possibility of non-compliance to public service code of ethics and conduct",
    description: "Adherence to public service ethics and conduct standards",
    principalOwner: "Planning, Finance and Administration",
    supportingOwner: "Planning, Finance and Administration",
    category: "Compliance",
    strategicObjective: "Maintain ethical standards",
    targets: ["Ethics training", "Regular assessments"]
  },
  {
    id: "C1",
    title: "Possibility of failure to sustainably run a standing scholarship programme",
    description: "Sustainability of scholarship programs",
    principalOwner: "Deputy Vice Chancellor - Academic",
    supportingOwner: "Deputy Vice Chancellor - Academic",
    category: "Academic",
    strategicObjective: "Maintain sustainable scholarship programs",
    targets: ["Fund management", "Program assessment"]
  },
  {
    id: "C2",
    title: "Possibility of inadequate competences of university graduates",
    description: "Graduate competency and skills development",
    principalOwner: "Planning, Finance and Administration",
    supportingOwner: "Planning, Finance and Administration",
    category: "Compliance",
    strategicObjective: "Ensure graduate competency",
    targets: ["Curriculum review", "Skills assessment"]
  },
  {
    id: "C3",
    title: "Possibility of weak innovation and entrepreneurship skills to undergraduate students",
    description: "Innovation and entrepreneurship skills development",
    principalOwner: "Deputy Vice Chancellor - Academic",
    supportingOwner: "Deputy Vice Chancellor - Academic",
    category: "Innovation",
    strategicObjective: "Enhance student innovation and entrepreneurship",
    targets: ["Innovation programs", "Entrepreneurship training"]
  },
  {
    id: "C4",
    title: "Possibility of inadequate examination processes",
    description: "Examination process quality and security",
    principalOwner: "Deputy Vice Chancellor - Academic",
    supportingOwner: "Deputy Vice Chancellor - Academic",
    category: "Academic",
    strategicObjective: "Improve examination processes",
    targets: ["Process review", "Security enhancement"]
  },
  {
    id: "D1",
    title: "Possibility of inadequate number and quality of research output",
    description: "Research output quantity and quality",
    principalOwner: "Deputy Vice Chancellor - Research",
    supportingOwner: "Deputy Vice Chancellor - Research",
    category: "Research & Consultancy",
    strategicObjective: "Enhance research output",
    targets: ["Research support", "Quality monitoring"]
  },
  {
    id: "D2",
    title: "Possibility of attracting insufficient number of and amount of funds from consultancy projects",
    description: "Consultancy project funding",
    principalOwner: "Deputy Vice Chancellor - Research",
    supportingOwner: "Deputy Vice Chancellor - Research",
    category: "Research & Consultancy",
    strategicObjective: "Increase consultancy funding",
    targets: ["Project outreach", "Funding strategies"]
  },
  {
    id: "D3",
    title: "Possibility of failure to harness technological development",
    description: "Technological advancement and adoption",
    principalOwner: "Deputy Vice Chancellor - Research",
    supportingOwner: "Deputy Vice Chancellor - Research",
    category: "Research & Consultancy",
    strategicObjective: "Improve technological adoption",
    targets: ["Tech assessment", "Implementation planning"]
  },
  {
    id: "D4",
    title: "Possibility of inadequate quality of UDSM journals",
    description: "Journal quality management",
    principalOwner: "Deputy Vice Chancellor - Research",
    supportingOwner: "Deputy Vice Chancellor - Research",
    category: "Research & Consultancy",
    strategicObjective: "Enhance journal quality",
    targets: ["Quality standards", "Editorial processes"]
  }
];

interface TargetRow {
  id: number;
  target: string;
  achievement: string;
  status: string;
}

export default function SubmitRiskReport() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedLikelihood, setSelectedLikelihood] = useState<number | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<number | null>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [targetRows, setTargetRows] = useState<TargetRow[]>([]);
  const [timePeriod, setTimePeriod] = useState("JANUARY-MARCH");
  const [year, setYear] = useState("2025");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  useEffect(() => {
    const risk = mockRisks.find(r => r.id === id);
    if (risk) {
      setRiskData(risk);
      setTargetRows([
        {
          id: 1,
          target: risk.targets[0],
          achievement: "",
          status: ""
        }
      ]);
    }
  }, [id]);

  const handleAddRow = () => {
    if (targetRows.length < 5) {
      const newRow: TargetRow = {
        id: targetRows.length + 1,
        target: "",
        achievement: "",
        status: ""
      };
      setTargetRows([...targetRows, newRow]);
    }
  };

  const getScore = () => {
    if (selectedLikelihood && selectedImpact) {
      return selectedLikelihood * selectedImpact;
    }
    return 0;
  };

  const getSeverity = (score: number): string => {
    if (score >= 17) return "Critical";
    if (score >= 10) return "High";
    if (score >= 4) return "Medium";
    return "Low";
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Check if risk rating is selected
    if (!selectedLikelihood || !selectedImpact) {
      errors.push("Risk Rating: Please select likelihood and impact from the matrix");
    }

    // Check if time period is selected
    if (!timePeriod) {
      errors.push("Time Period: Please select a time period");
    }

    // Check if year is selected
    if (!year) {
      errors.push("Year: Please select a year");
    }

    // Check target rows
    targetRows.forEach((row, index) => {
      if (!row.achievement.trim()) {
        errors.push(`Target ${index + 1}: Please fill in the achievement`);
      }
      if (!row.status) {
        errors.push(`Target ${index + 1}: Please select a status`);
      }
    });

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationDialog(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare the report data
      const reportData = {
        riskId: riskData.id,
        timePeriod,
        year,
        likelihood: selectedLikelihood,
        impact: selectedImpact,
        score: getScore(),
        severity: getSeverity(getScore()),
        targets: targetRows.map(row => ({
          target: row.target,
          achievement: row.achievement.trim(),
          status: row.status
        }))
      };

      // Here you would normally make an API call to submit the report
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Risk report submitted successfully",
        duration: 3000,
      });

      navigate("/champion/risks");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the time period state when selection changes
  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
  };

  // Update the year state when selection changes
  const handleYearChange = (value: string) => {
    setYear(value);
  };

  if (!riskData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Risk Management Information</h2>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-sm font-medium">RISK ID</Label>
            <div className="p-2 border rounded-md bg-gray-50">{riskData.id}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">RISK TITLE</Label>
            <div className="p-2 border rounded-md bg-gray-50">{riskData.title}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Time Period <span className="text-red-500">*</span></Label>
            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JANUARY-MARCH">JANUARY-MARCH</SelectItem>
                <SelectItem value="APRIL-JUNE">APRIL-JUNE</SelectItem>
                <SelectItem value="JULY-SEPTEMBER">JULY-SEPTEMBER</SelectItem>
                <SelectItem value="OCTOBER-DECEMBER">OCTOBER-DECEMBER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">Year <span className="text-red-500">*</span></Label>
            <Select value={year} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-[#1A365D] text-white rounded-sm">
          <h3 className="text-lg font-semibold p-3">Overview</h3>
          <div className="grid grid-cols-2">
            <div className="space-y-4 p-4">
              <div>
                <h4 className="font-medium">Risk Description</h4>
              </div>
              <div>
                <h4 className="font-medium">Principal risk owner</h4>
              </div>
              <div>
                <h4 className="font-medium">Supporting owner</h4>
              </div>
              <div>
                <h4 className="font-medium">Risk category</h4>
              </div>
              <div>
                <h4 className="font-medium">Strategic objective</h4>
              </div>
            </div>
            <div className="space-y-4 p-4 bg-white text-black">
              <div>
                <p>{riskData.description}</p>
              </div>
              <div>
                <p>{riskData.principalOwner}</p>
              </div>
              <div>
                <p>{riskData.supportingOwner}</p>
              </div>
              <div>
                <p>{riskData.category}</p>
              </div>
              <div>
                <p>{riskData.strategicObjective}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Achievement Table */}
        <div className="overflow-hidden rounded-sm border">
          <table className="w-full">
            <thead className="bg-[#1A365D] text-white">
              <tr>
                <th className="p-3 text-left">Target</th>
                <th className="p-3 text-left">Achievement <span className="text-red-300">*</span></th>
                <th className="p-3 text-left">Status <span className="text-red-300">*</span></th>
              </tr>
            </thead>
            <tbody>
              {targetRows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-3">{row.target}</td>
                  <td className="p-3">
                    <Input 
                      value={row.achievement}
                      onChange={(e) => {
                        const newRows = targetRows.map(r => 
                          r.id === row.id ? { ...r, achievement: e.target.value } : r
                        );
                        setTargetRows(newRows);
                      }}
                      placeholder="Enter achievement"
                      className={!row.achievement.trim() ? "border-red-200" : ""}
                    />
                  </td>
                  <td className="p-3">
                    <Select
                      value={row.status}
                      onValueChange={(value) => {
                        const newRows = targetRows.map(r =>
                          r.id === row.id ? { ...r, status: value } : r
                        );
                        setTargetRows(newRows);
                      }}
                    >
                      <SelectTrigger className={!row.status ? "border-red-200" : ""}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={handleAddRow} variant="outline">
          Add Row
        </Button>

        {/* Risk Matrix */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Click on the matrix to select the likelihood and impact of this risk 
            <span className="text-red-500 ml-1">*</span>
          </p>
          
          <div className="relative w-[500px]">
            {/* Impact label at top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6">
              <span className="text-lg font-semibold text-gray-700">Impact</span>
            </div>

            {/* Likelihood label on left */}
            <div className="absolute left-0 top-1/2 transform -translate-x-8 -translate-y-1/2">
              <span className="text-lg font-semibold text-gray-700" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                Likelihood
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1 mt-6">
              {/* Impact numbers */}
              <div></div>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="text-center font-medium text-gray-600">
                  {n}
                </div>
              ))}

              {/* Matrix with likelihood numbers and cells */}
              {[5, 4, 3, 2, 1].map(likelihood => (
                <>
                  <div key={`row-${likelihood}`} className="text-right pr-2 font-medium text-gray-600">
                    {likelihood}
                  </div>
                  {[1, 2, 3, 4, 5].map(impact => {
                    const score = likelihood * impact;
                    const isSelected = selectedLikelihood === likelihood && selectedImpact === impact;
                    
                    const getCellColor = () => {
                      if (score >= 17) return 'bg-red-500/50 hover:bg-red-500/70';
                      if (score >= 10) return 'bg-yellow-500/50 hover:bg-yellow-500/70';
                      if (score >= 4) return 'bg-yellow-300/50 hover:bg-yellow-300/70';
                      return 'bg-green-500/50 hover:bg-green-500/70';
                    };

                    return (
                      <button
                        key={`${likelihood}-${impact}`}
                        onClick={() => {
                          setSelectedLikelihood(likelihood);
                          setSelectedImpact(impact);
                        }}
                        className={`
                          aspect-square text-sm rounded-sm font-medium
                          transition-all duration-200 hover:scale-105
                          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                          ${getCellColor()}
                        `}
                      >
                        {score}
                      </button>
                    );
                  })}
                </>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/50"></div>
              <span className="text-sm">Low (1-3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300/50"></div>
              <span className="text-sm">Medium (4-9)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/50"></div>
              <span className="text-sm">High (10-16)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/50"></div>
              <span className="text-sm">Critical (17-25)</span>
            </div>
          </div>
        </div>

        {/* Rating Information */}
        <div className="space-y-2">
          <h3 className="font-medium">Rating Information</h3>
          <div className="space-y-1">
            <p>Rating: {getScore()}</p>
            <p>Severity: {getSeverity(getScore())}</p>
          </div>
        </div>

        {/* Validation Dialog */}
        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-red-500">Required Fields Missing</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setShowValidationDialog(false)}
                className="w-full sm:w-auto"
              >
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/champion/risks")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
} 