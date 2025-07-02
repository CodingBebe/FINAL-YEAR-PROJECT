import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Demo risk data: [ { riskId, likelihood, impact } ]
const demoRisks = [
  { riskId: '1', likelihood: 4, impact: 5 },
  { riskId: '2', likelihood: 3, impact: 5 },
  { riskId: '3', likelihood: 2, impact: 4 },
  { riskId: '4', likelihood: 3, impact: 3 },
  { riskId: '5', likelihood: 4, impact: 4 },
];

// Heatmap color logic
const getCellColor = (likelihood, impact) => {
  const score = likelihood * impact;
  if (score >= 17) return "bg-red-600 text-white"; // Critical
  if (score >= 10) return "bg-red-400 text-white"; // High
  if (score >= 5) return "bg-yellow-400 text-black"; // Medium
  return "bg-green-400 text-black"; // Low
};

// Build a 5x5 grid, each cell can have multiple risk IDs
const buildHeatmap = () => {
  const grid = Array.from({ length: 5 }, () => Array(5).fill([]));
  demoRisks.forEach(risk => {
    const l = 5 - risk.likelihood; // invert for display (y axis: 5 at top)
    const i = risk.impact - 1;
    grid[l][i] = [...(grid[l][i] || []), risk.riskId];
  });
  return grid;
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
  const grid = buildHeatmap();
  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-1">Risk Heatmap</h1>
      <p className="text-muted-foreground mb-8">Visual representation of risks by likelihood and impact</p>
      <Card>
        <CardHeader>
          <CardTitle>Risk Heatmap</CardTitle>
          <CardDescription>Likelihood vs Impact visualization showing risk IDs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center">
              {/* Y Axis label */}
              <div className="flex flex-col justify-center mr-2" style={{ height: 320 }}>
                <span className="font-semibold rotate-[-90deg] text-lg" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Likelihood</span>
              </div>
              {/* Heatmap grid */}
              <div>
                <div className="flex flex-row justify-center mb-1 ml-8">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="w-16 text-center font-semibold">{i}</span>
                  ))}
                </div>
                <div className="grid grid-rows-5 grid-cols-5 gap-1">
                  {grid.map((row, rowIdx) =>
                    row.map((cell, colIdx) => (
                      <div
                        key={rowIdx + '-' + colIdx}
                        className={`w-16 h-16 flex items-center justify-center rounded ${getCellColor(5-rowIdx, colIdx+1)} text-lg font-bold`}
                      >
                        {cell.length > 0 ? cell.join(", ") : ""}
                      </div>
                    ))
                  )}
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
                <div className="flex items-center gap-1"><span className="w-5 h-5 bg-yellow-400 inline-block rounded"></span> Medium (5-9)</div>
                <div className="flex items-center gap-1"><span className="w-5 h-5 bg-red-400 inline-block rounded"></span> High (10-16)</div>
                <div className="flex items-center gap-1"><span className="w-5 h-5 bg-red-600 inline-block rounded"></span> Critical (17-25)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 