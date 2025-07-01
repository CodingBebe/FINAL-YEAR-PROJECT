import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { riskApi } from "@/services/api";

export default function ViewRisk() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "report">("overview");
  const [timePeriod, setTimePeriod] = useState("JANUARY-MARCH");
  const [year, setYear] = useState("2025");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRisk = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const res = await riskApi.getRiskById(id);
          setRiskData(res.data);
        } else {
          setError("No risk ID provided in URL.");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch risk data");
      } finally {
        setLoading(false);
      }
    };
    fetchRisk();
  }, [id]);

  if (loading) return <div>Loading risk details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!riskData) return <div>No risk data found.</div>;

  const handleMatrixClick = (rating: number) => {
    setSelectedRating(rating);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/champion/risks')}>
            Back
          </Button>
          <h1 className="text-2xl font-bold">Risk Information</h1>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">RISK ID</label>
          <div className="p-2 border rounded bg-gray-50 w-20">{riskData.id}</div>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">RISK TITLE</label>
          <div className="p-2 border rounded bg-gray-50">{riskData.title}</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: "overview" | "report") => setActiveTab(value)}>
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-navy-700">Risk Description</h3>
                  <p className="text-gray-600">{riskData.description || '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Principal risk owner</h3>
                  <p className="text-gray-600">{riskData.principalOwner || '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Supporting owner</h3>
                  <p className="text-gray-600">{Array.isArray(riskData.supportingOwners) ? riskData.supportingOwners.join(', ') : '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Risk category</h3>
                  <p className="text-gray-600">{riskData.category || '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Strategic objective</h3>
                  <p className="text-gray-600">{riskData.strategicObjective || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Causes and Consequences Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Causes Card */}
            {Array.isArray(riskData.causes) && riskData.causes.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Causes</h3>
                  <table className="min-w-full text-sm border">
                    <tbody>
                      {riskData.causes.map((cause: string, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 px-4">{idx + 1}</td>
                          <td className="py-2 px-4">{cause}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
            {/* Consequences Card */}
            {Array.isArray(riskData.consequences) && riskData.consequences.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Consequences</h3>
                  <table className="min-w-full text-sm border">
                    <tbody>
                      {riskData.consequences.map((consequence: string, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 px-4">{idx + 1}</td>
                          <td className="py-2 px-4">{consequence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>
           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"> 
          {/* Existing Controls Table */}
          {Array.isArray(riskData.existingControls) && riskData.existingControls.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Existing Controls</h3>
                <table className="min-w-full text-sm border">
                  <tbody>
                    {riskData.existingControls.map((control: string, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{idx + 1}</td>
                        <td className="py-2 px-4">{control}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Mitigation Plan Table */}
          {Array.isArray(riskData.proposedMitigation) && riskData.proposedMitigation.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Mitigation Plan</h3>
                <table className="min-w-full text-sm border">
                  <tbody>
                    {riskData.proposedMitigation.map((mitigation: string, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{idx + 1}</td>
                        <td className="py-2 px-4">{mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 