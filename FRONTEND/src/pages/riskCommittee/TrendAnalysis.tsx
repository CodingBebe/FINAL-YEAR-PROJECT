import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const riskSummary = [
  { label: "High Risk", value: 3, color: "text-red-500" },
  { label: "Medium Risk", value: 2, color: "text-yellow-500" },
  { label: "Low Risk", value: 0, color: "text-green-500" },
];

const trendData = [
  { month: "Jan", High: 7, Medium: 12, Low: 21 },
  { month: "Feb", High: 8, Medium: 11, Low: 22 },
  { month: "Mar", High: 9, Medium: 10, Low: 23 },
  { month: "Apr", High: 10, Medium: 13, Low: 24 },
  { month: "May", High: 8, Medium: 12, Low: 23 },
  { month: "Jun", High: 7, Medium: 14, Low: 22 },
];

export default function TrendAnalysis() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Trend Analysis</h1>
      <p className="text-muted-foreground mb-6">Analyze risk trends over time</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {riskSummary.map((risk, idx) => (
          <Card key={idx} className="shadow-none border border-muted-foreground/10">
            <CardHeader>
              <CardTitle className="text-lg">{risk.label}</CardTitle>
              <CardDescription className={`text-3xl font-bold ${risk.color}`}>{risk.value}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Risk Trends Over Time</CardTitle>
          <CardDescription>Number of risks by severity level over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="High" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Medium" stroke="#fbbf24" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Low" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution Analysis</CardTitle>
          <CardDescription>Comparing current risk levels with previous quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            This section will show detailed analysis of risk distributions and trends over time.
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 