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
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [targetRows, setTargetRows] = useState<TargetRow[]>([]);

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

  const getSeverity = (rating: number | null): string => {
    if (!rating) return "Low";
    if (rating >= 17) return "Critical";
    if (rating >= 10) return "High";
    if (rating >= 4) return "Medium";
    return "Low";
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
            <Label className="text-sm font-medium">Time Period</Label>
            <Select defaultValue="JANUARY-MARCH">
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
            <Label className="text-sm font-medium">Year</Label>
            <Select defaultValue="2025">
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
                <th className="p-3 text-left">Achievement</th>
                <th className="p-3 text-left">Status</th>
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
                      <SelectTrigger>
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
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Click on the matrix to select the likelihood and impact of this risk.</p>
          <div className="grid grid-cols-6 gap-1 w-[500px]">
            <div></div>
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="text-center text-sm">
                {n}
              </div>
            ))}
            {[5, 4, 3, 2, 1].map(impact => (
              <>
                <div key={impact} className="text-right pr-2 text-sm">
                  {impact}
                </div>
                {[1, 2, 3, 4, 5].map(likelihood => {
                  const rating = impact * likelihood;
                  return (
                    <button
                      key={`${impact}-${likelihood}`}
                      onClick={() => setSelectedCell(rating)}
                      className={`
                        aspect-square text-sm rounded
                        ${selectedCell === rating ? 'ring-2 ring-blue-500' : ''}
                        ${rating >= 17 ? 'bg-red-100' :
                          rating >= 10 ? 'bg-orange-100' :
                          rating >= 4 ? 'bg-yellow-100' :
                          'bg-green-100'
                        }
                      `}
                    >
                      {rating}
                    </button>
                  );
                })}
              </>
            ))}
          </div>
          <div className="flex gap-4 text-sm mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100"></div>
              <span>Low (1-3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100"></div>
              <span>Medium (4-9)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100"></div>
              <span>High (10-16)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100"></div>
              <span>Critical (17-25)</span>
            </div>
          </div>
        </div>

        {/* Rating Information */}
        <div className="space-y-2">
          <h3 className="font-medium">Rating Information</h3>
          <div className="space-y-1">
            <p>Rating: {selectedCell || 0}</p>
            <p>Severity: {getSeverity(selectedCell)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/champion/risks")}>
            Cancel
          </Button>
          <Button onClick={() => {
            if (!selectedCell) {
              toast({
                title: "Error",
                description: "Please select a risk rating",
                variant: "destructive"
              });
              return;
            }
            toast({
              title: "Success",
              description: "Risk report submitted successfully"
            });
            navigate("/champion/risks");
          }}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
} 