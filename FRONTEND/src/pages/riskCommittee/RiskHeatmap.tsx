import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { riskApi } from "@/services/api";

const getCellColor = (likelihood, impact) => {
  const score = likelihood * impact;
  if (score >= 17) return "bg-red-600 text-white"; // Very High
  if (score >= 10) return "bg-orange-400 text-white"; // High
  if (score >= 5) return "bg-yellow-400 text-black"; // Moderate
  return "bg-green-400 text-black"; // Low
};

const impactLabels = [
  "1 - Minimal",
  "2 - Minor",
  "3 - Moderate",
  "4 - Major",
  "5 - Severe",
];
const likelihoodLabels = [
  "1 - Rare",
  "2 - Unlikely",
  "3 - Possible",
  "4 - Likely",
  "5 - Almost Certain",
];

export default function RiskHeatmap() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [years, setYears] = useState([]);
  const [quarters, setQuarters] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await riskApi.getAllSubmissions();
      setSubmissions(res.data);
      // Extract years and quarters for dropdowns
      const yearSet = new Set();
      const quarterSet = new Set();
      res.data.forEach((s) => {
        if (s.year) yearSet.add(s.year);
        if (s.timePeriod) quarterSet.add(s.timePeriod);
      });
      const yearsArr = Array.from(yearSet).sort().reverse();
      const quartersArr = Array.from(quarterSet).sort();
      setYears(yearsArr);
      setQuarters(quartersArr);
      if (!selectedYear && yearsArr.length > 0) setSelectedYear(yearsArr[0] as string);
      if (!selectedQuarter && quartersArr.length > 0) setSelectedQuarter(quartersArr[0] as string);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Filter submissions for selected year and quarter
  const filtered = submissions.filter(
    (s) => s.year === selectedYear && s.timePeriod === selectedQuarter
  );

  // Build heatmap grid
  const buildHeatmap = () => {
    const grid = Array.from({ length: 5 }, () => Array(5).fill([]));
    filtered.forEach((risk) => {
      const l = 5 - (risk.likelihood || 1); // invert for display (y axis: 5 at top)
      const i = (risk.impact || 1) - 1;
      if (l >= 0 && l < 5 && i >= 0 && i < 5) {
        grid[l][i] = [...(grid[l][i] || []), risk.riskId];
      }
    });
    return grid;
  };
  const grid = buildHeatmap();

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-1">Risk Heatmap</h1>
      <p className="text-muted-foreground mb-8">Visual representation of risks by likelihood and impact</p>
      <div className="flex gap-4 mb-4">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Quarter" />
          </SelectTrigger>
          <SelectContent>
            {quarters.map((q) => (
              <SelectItem key={q} value={q}>{q}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Risk Heatmap</CardTitle>
          <CardDescription>Likelihood vs Impact visualization showing risk IDs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center">
              {/* Y Axis label and numbers */}
              <span className="font-semibold rotate-[-90deg] text-lg mb-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Likelihood</span>
              <div className="flex flex-col justify-center mr-2" style={{ height: 320 }}>
             
                {/* Add numbers 5 to 1 for the Y axis */}
               
              </div>
              {/* Heatmap grid */}
              <div>
                <div className="grid grid-rows-5 grid-cols-6 gap-1">
                  {grid.map((row, rowIdx) => (
                    <React.Fragment key={rowIdx}>
                      {/* Y axis number at the start of each row */}
                      <span className="h-16 flex items-center justify-end pr-1 font-semibold">{5 - rowIdx}</span>
                      {row.map((cell, colIdx) => (
                        <div
                          key={rowIdx + '-' + colIdx}
                          className={`w-16 h-16 flex items-center justify-center rounded ${getCellColor(5-rowIdx, colIdx+1)} text-lg font-bold`}
                        >
                          {cell.length > 0 ? cell.join(", ") : ""}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
                {/* X Axis label */}
                <div className="flex flex-row justify-center mt-2 ml-8">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="w-16 text-center font-semibold">{i}</span>
                  ))}
                </div>
                <div className="flex flex-row justify-center mt-1 ml-8">
                  <span className="w-[320px] text-center font-semibold">Impact</span>
                </div>
              </div>
            </div>
            {/* Legends */}
            <div className="flex flex-row justify-between w-full mt-8">
              <div>
                <div className="font-semibold mb-1">Impact</div>
                {impactLabels.map(l => <div key={l} className="text-sm text-muted-foreground">{l}</div>)}
              </div>
              <div>
                <div className="font-semibold mb-1">Likelihood</div>
                {likelihoodLabels.map(l => <div key={l} className="text-sm text-muted-foreground">{l}</div>)}
              </div>
              <div className="flex items-end gap-4">
                <div className="flex items-center gap-1"><span className="w-5 h-5 bg-green-400 inline-block rounded"></span> Low (1-4)</div>
                <div className="flex items-center gap-1"><span className="w-5 h-5 bg-yellow-400 inline-block rounded"></span> Moderate (5-9)</div>
                <div className="flex items-center gap-1"><span className="w-5 h-5 bg-orange-400 inline-block rounded"></span> High (10-16)</div>
                <div className="flex items-center gap-1"><span className="w-5 h-5 bg-red-600 inline-block rounded"></span> Very High (17-25)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 