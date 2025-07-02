import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import RiskMatrix from "@/components/Riskmatrix";
import { riskApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";

export default function RiskReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLikelihood, setSelectedLikelihood] = useState<number | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<number | null>(null);
  const [timePeriod, setTimePeriod] = useState("");
  const [year, setYear] = useState("2025");
  const [targets, setTargets] = useState([
    { target: "", achievement: "", status: "" },
  ]);
  const { toast } = useToast();
  const { user } = useUser();

  // Dynamically generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear.toString()];

  useEffect(() => {
    console.log('Risk report page mounted. riskId param:', id);
    const fetchRisk = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const res = await riskApi.getRiskById(id);
          console.log('API response for getRiskById:', res);
          setRiskData(res.data || res); // fallback for direct data
          // Prefill targets if available
          if (res.data?.targets || res.targets) {
            setTargets((res.data?.targets || res.targets).map((t: any) => ({ target: t, achievement: "", status: "" })));
          }
        } else {
          setError("No risk ID provided in URL.");
          console.error('No risk ID provided in URL.');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch risk data");
        console.error('Error fetching risk:', err);
      } finally {
        setLoading(false);
        console.log('Loading set to false');
      }
    };
    fetchRisk();
  }, [id]);

  const handleMatrixClick = (likelihood: number, impact: number) => {
    setSelectedLikelihood(likelihood);
    setSelectedImpact(impact);
  };

  const handleTargetChange = (idx: number, field: string, value: string) => {
    setTargets((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleAddRow = () => {
    setTargets((prev) => [...prev, { target: "", achievement: "", status: "" }]);
  };

  const getScore = () => {
    if (selectedLikelihood && selectedImpact) return selectedLikelihood * selectedImpact;
    return 0;
  };
  const getSeverity = (score: number) => {
    if (score >= 17) return "Very High";
    if (score >= 10) return "High";
    if (score >= 4) return "Moderate";
    return "Low Risk";
  };

  // Add handlers for axis clicks
  const handleLikelihoodClick = (likelihood: number) => {
    setSelectedLikelihood(likelihood);
  };
  const handleImpactClick = (impact: number) => {
    setSelectedImpact(impact);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!timePeriod || !year) {
      toast({ title: "Error", description: "Please fill all required fields: Time Period & Year", variant: "destructive" });
      return;
    }
    if (!selectedLikelihood || !selectedImpact) {
      toast({ title: "Error", description: "Please fill all required fields: Likelihood and Impact.", variant: "destructive" });
      return;
    }
    // Validate all targets fields
    for (const [i, row] of targets.entries()) {
      if (!row.target.trim() || !row.achievement.trim() || !row.status) {
        toast({ title: "Error", description: `Please fill all fields for target ${i + 1}.`, variant: "destructive" });
        return;
      }
    }
    try {
      const score = getScore();
      const submissionData = {
        riskId: riskData.riskId || riskData._id,
        riskTitle: riskData.title,
        timePeriod,
        year,
        principalOwner: riskData.principalOwner,
        unit_id: user.unit,
        supportingOwner: Array.isArray(riskData.supportingOwners) ? riskData.supportingOwners.join(', ') : riskData.supportingOwner || "",
        strategicObjective: riskData.strategicObjective,
        targets: targets.map(row => ({ target: row.target, achievement: row.achievement, status: row.status })),
        severity: getSeverity(score),
        likelihood: selectedLikelihood,
        impact: selectedImpact,
        rating: score,
      };
      await riskApi.createSubmission(submissionData);
      toast({ title: "Success", description: "Submission created successfully!", duration: 3000 });
      navigate("/champion/risks");
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to submit report", variant: "destructive" });
    }
  };

  if (loading) return <div>Loading risk report...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!riskData) return <div>No risk data found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Risk Management Information</h2>
      {/* Top info row */}
      <div className="mb-6">
        <div className=" grid grid-cols-[1fr_5fr] gap-6">
          <div className="flex flex-col flex-1 min-w-[120px] max-w-xs">
            <div className="text-xs font-semibold text-gray-600 mb-1">RISK ID</div>
            <div className="text-xl font-bold border rounded px-4 py-2 bg-white min-h-[44px] flex items-center">{riskData.riskId || riskData._id || "-"}</div>
          </div>
          <div className="flex flex-col flex-[2] min-w-[200px] max-w-xl">
            <div className="text-xs font-semibold text-gray-600 mb-1">RISK TITLE</div>
            <div className="text-lg border rounded px-4 py-2 bg-white min-h-[44px] flex items-center">{riskData.title || "-"}</div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_5fr] gap-6 mt-6">
          <div className=" flex flex-col flex-1 min-w-[120px] max-w-xs">
            <div className="text-xs font-semibold text-gray-600 mb-1">Time Period</div>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-full min-h-[44px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JANUARY-MARCH">JANUARY-MARCH</SelectItem>
                <SelectItem value="APRIL-JUNE">APRIL-JUNE</SelectItem>
                <SelectItem value="JULY-SEPTEMBER">JULY-SEPTEMBER</SelectItem>
                <SelectItem value="OCTOBER-DECEMBER">OCTOBER-DECEMBER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col flex-1 min-w-[120px] max-w-xs">
            <div className="text-xs font-semibold text-gray-600 mb-1">Year</div>
            <div className="text-lg border rounded px-4 py-2 bg-white min-h-[44px] flex items-center">{year}</div>
          </div>
        </div>
      </div>

      {/* Overview section as two-column table */}
      <div className="mb-6">
        <div className="bg-[#19335A] text-white text-lg font-semibold px-4 py-2 rounded-t">Overview</div>
        <div className="border border-[#19335A] rounded-b overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-[#19335A]">
            <div className="py-4 px-6 space-y-6 bg-[#19335A] text-white font-bold text-lg">
              <div>Risk Description</div>
              <div>Principal risk owner</div>
              <div>Supporting owner</div>
              <div>Risk category</div>
              <div>Strategic objective</div>
            </div>
            <div className="py-4 px-6 space-y-6 bg-white text-[#19335A] font-medium text-lg">
              <div>{riskData.description || '-'}</div>
              <div>{riskData.principalOwner || '-'}</div>
              <div>{Array.isArray(riskData.supportingOwners) ? riskData.supportingOwners.join(', ') : '-'}</div>
              <div>{riskData.category || '-'}</div>
              <div>{riskData.strategicObjective || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Target/Achievement/Status table */}
      <div className="mb-8">
        <div className="grid grid-cols-3">
          <div className="bg-[#19335A] text-white font-bold text-lg py-2 px-4 border border-[#19335A]">Target</div>
          <div className="bg-[#19335A] text-white font-bold text-lg py-2 px-4 border-t border-b border-[#19335A]">Achievement</div>
          <div className="bg-[#19335A] text-white font-bold text-lg py-2 px-4 border border-[#19335A]">Status</div>
        </div>
        {targets.map((row, idx) => (
          <div className="grid grid-cols-3" key={idx}>
            <div className="border-l border-b border-r border-[#19335A] px-4 py-2 flex items-center min-h-[48px]">
              <Textarea
                className="w-full resize-y min-h-[40px] border-none bg-transparent p-0 text-[#19335A]"
                value={row.target}
                onChange={e => handleTargetChange(idx, "target", e.target.value)}
                placeholder="Provide Health education /Counselling"
                rows={2}
                readOnly
              />
            </div>
            <div className="border-b border-r border-[#19335A] px-4 py-2 flex items-center min-h-[48px]">
              <Textarea
                className="w-full resize-y min-h-[40px] border-none bg-transparent p-0 text-[#19335A]"
                value={row.achievement}
                onChange={e => handleTargetChange(idx, "achievement", e.target.value)}
                placeholder="Enter achievement"
                rows={2}
              />
            </div>
            <div className="border-b border-r border-[#19335A] px-4 py-2 flex items-center min-h-[48px]">
              <Select value={row.status} onValueChange={val => handleTargetChange(idx, "status", val)}>
                <SelectTrigger className="w-full bg-white text-[#19335A] border-none">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Not implemented</SelectItem>
                  <SelectItem value="2">Partially implemented</SelectItem>
                  <SelectItem value="3">Fully Implemented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      <Label>Click on the matrix to select the likelihood and impact of this risk *</Label>
      <div className="mb-8 grid grid-cols-[5fr_2fr] gap-2 ">
      <div className="mb-8 space-y-4">
        
        <RiskMatrix
          selectedLikelihood={selectedLikelihood || undefined}
          selectedImpact={selectedImpact || undefined}
          onCellClick={handleMatrixClick}
          onLikelihoodClick={handleLikelihoodClick}
          onImpactClick={handleImpactClick}
        />
      </div>

      <div className="mt-10 text-2xl" style={{ marginTop: '250px' }}>
        <div className="text-3xl font-bold">Rating Information</div>
        {selectedLikelihood && selectedImpact ? (
          (() => {
            const score = getScore();
            let color = "";
            if (score >= 17) color = "text-red-500";
            else if (score >= 10) color = "text-orange-400";
            else if (score >= 4) color = "text-yellow-500";
            else color = "text-green-500";
            return (
              <>
                <div className={`font-bold text-lg ${color}`}>Rating: {score}</div>
                <div className={`font-bold text-lg ${color}`}>Severity: {getSeverity(score)}</div>
              </>
            );
          })()
        ) : (
          <div className="text-gray-500 italic">Select impact and likelihood.</div>
        )}
      </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button  variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button className="px-8 py-4 text-xl w-48 h-16" onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
} 