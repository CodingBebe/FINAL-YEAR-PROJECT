import { useState } from "react";
import { useParams } from "react-router-dom";
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

export default function ViewRisk() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "report">("overview");
  const [timePeriod, setTimePeriod] = useState("JANUARY-MARCH");
  const [year, setYear] = useState("2025");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Mock risk data - replace with actual data fetching
  const riskData = {
    id: "A1",
    title: "Possibility of inadequate healthcare to University",
    description: "Possibility of inadequate healthcare services",
    principalOwner: "Planning, Finance and Administration",
    supportingOwner: "DSS, DHRMA, UH",
    category: "Health Safety and Welfare",
    strategicObjective: "Incidence and impacts of HIV/AIDS"
  };

  const handleMatrixClick = (rating: number) => {
    setSelectedRating(rating);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Risk Management Information</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">RISK ID</label>
          <Select value={riskData.id} onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder={riskData.id} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={riskData.id}>{riskData.id}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">RISK TITLE</label>
          <Select value={riskData.title} onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder={riskData.title} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={riskData.title}>{riskData.title}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium">Time Period</label>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger>
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
        <div>
          <label className="text-sm font-medium">Year</label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: "overview" | "report") => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-navy-700">Risk Description</h3>
                  <p className="text-gray-600">{riskData.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Principal risk owner</h3>
                  <p className="text-gray-600">{riskData.principalOwner}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Supporting owner</h3>
                  <p className="text-gray-600">{riskData.supportingOwner}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Risk category</h3>
                  <p className="text-gray-600">{riskData.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-700">Strategic objective</h3>
                  <p className="text-gray-600">{riskData.strategicObjective}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <h3 className="font-semibold mb-2">Target</h3>
                    <div className="p-4 bg-navy-700 text-white rounded">
                      <p>Provide Health education /Counselling</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <h3 className="font-semibold mb-2">Achievement</h3>
                    <textarea 
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter achievement details"
                    />
                  </div>
                  <div className="col-span-1">
                    <h3 className="font-semibold mb-2">Status</h3>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="not-started">Not Started</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Risk Assessment Matrix</h3>
                  <div className="grid grid-cols-6 gap-1 text-center text-sm">
                    <div className="col-start-2 col-span-5 grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="bg-gray-100 p-2">{n}</div>
                      ))}
                    </div>
                    {[5, 4, 3, 2, 1].map((impact) => (
                      <React.Fragment key={impact}>
                        <div className="bg-gray-100 p-2">{impact}</div>
                        {[1, 2, 3, 4, 5].map((likelihood) => {
                          const rating = impact * likelihood;
                          return (
                            <button
                              key={`${impact}-${likelihood}`}
                              onClick={() => handleMatrixClick(rating)}
                              className={`p-2 border ${
                                selectedRating === rating
                                  ? "bg-blue-500 text-white"
                                  : rating <= 5
                                  ? "bg-green-100"
                                  : rating <= 10
                                  ? "bg-yellow-100"
                                  : rating <= 15
                                  ? "bg-orange-100"
                                  : "bg-red-100"
                              }`}
                            >
                              {rating}
                            </button>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">Rating: {selectedRating || 0}</p>
                    <p className="font-semibold">
                      Severity:{" "}
                      {selectedRating
                        ? selectedRating <= 5
                          ? "Low"
                          : selectedRating <= 10
                          ? "Medium"
                          : selectedRating <= 15
                          ? "High"
                          : "Critical"
                        : "Low"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 