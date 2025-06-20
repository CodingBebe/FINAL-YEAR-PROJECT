import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const totalRisks = 5;
const severityData = [
  { name: "Low (1-4)", value: 1 },
  { name: "Medium (5-9)", value: 2 },
  { name: "High (10-16)", value: 2 },
  { name: "Critical (17-25)", value: 1 },
];
const severityColors = ["#10B981", "#FBBF24", "#F59E0B", "#DC2626"];

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

// Sample data for the new sections
const unitRisks = [
  { unit: "DHRMA", total: 8, high: 2, medium: 3, low: 3 },
  { unit: "DSS", total: 6, high: 1, medium: 2, low: 3 },
  { unit: "UH", total: 5, high: 1, medium: 2, low: 2 },
  { unit: "DPGS", total: 7, high: 2, medium: 2, low: 3 },
  { unit: "DUS", total: 4, high: 1, medium: 1, low: 2 },
  { unit: "DES", total: 6, high: 1, medium: 2, low: 3 },
  { unit: "Principals", total: 9, high: 2, medium: 3, low: 4 },
  { unit: "Deans", total: 8, high: 2, medium: 3, low: 3 },
  { unit: "Directors", total: 7, high: 1, medium: 3, low: 3 },
  { unit: "DRP", total: 5, high: 1, medium: 2, low: 2 },
  { unit: "DPS", total: 6, high: 1, medium: 2, low: 3 },
  { unit: "IPMO", total: 4, high: 1, medium: 1, low: 2 },
  { unit: "DIEN", total: 5, high: 1, medium: 2, low: 2 },
  { unit: "TDTC", total: 3, high: 0, medium: 1, low: 2 },
  { unit: "DSS/Commandant Auxiliary Police", total: 7, high: 2, medium: 2, low: 3 },
  { unit: "DoSS", total: 6, high: 1, medium: 2, low: 3 },
  { unit: "SoAF", total: 5, high: 1, medium: 2, low: 2 },
  { unit: "CoNAS", total: 8, high: 2, medium: 3, low: 3 },
  { unit: "CoET", total: 7, high: 1, medium: 3, low: 3 },
  { unit: "Auxiliary Police", total: 4, high: 1, medium: 1, low: 2 },
  { unit: "DICT", total: 6, high: 1, medium: 2, low: 3 },
  { unit: "DLS", total: 5, high: 1, medium: 2, low: 2 },
  { unit: "PMU", total: 4, high: 1, medium: 1, low: 2 },
  { unit: "QAU", total: 7, high: 2, medium: 2, low: 3 },
  { unit: "DoF", total: 6, high: 1, medium: 2, low: 3 },
  { unit: "CCC & STC", total: 5, high: 1, medium: 2, low: 2 },
  { unit: "DPDI", total: 4, high: 1, medium: 1, low: 2 },
  { unit: "DICA", total: 5, high: 1, medium: 2, low: 2 },
  { unit: "CMU", total: 6, high: 1, medium: 2, low: 3 },
];

const quarterlyRisks = {
  "2024": {
    "Q1": { total: 15, high: 4, medium: 6, low: 5 },
    "Q2": { total: 12, high: 3, medium: 5, low: 4 },
    "Q3": { total: 8, high: 2, medium: 3, low: 3 },
    "Q4": { total: 10, high: 2, medium: 4, low: 4 },
  },
  "2023": {
    "Q1": { total: 14, high: 3, medium: 6, low: 5 },
    "Q2": { total: 11, high: 2, medium: 5, low: 4 },
    "Q3": { total: 9, high: 2, medium: 4, low: 3 },
    "Q4": { total: 13, high: 3, medium: 5, low: 5 },
  },
};

const severityRisks = [
  { severity: "Critical", count: 5, description: "Immediate action required" },
  { severity: "High", count: 8, description: "Action required within a week" },
  { severity: "Medium", count: 12, description: "Action required within a month" },
  { severity: "Low", count: 15, description: "Action required within a quarter" },
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-1">Welcome back, Prof.</h1>
          <p className="text-muted-foreground">Here's an overview of the University's risk management status</p>
        </div>
        <Card className="shadow-none border border-muted-foreground/10 max-w-xs w-full md:w-60 flex flex-col items-center justify-center self-start md:self-auto">
          <CardHeader className="items-center text-center p-4">
            <CardTitle className="text-lg">Total Risks in this Quarter</CardTitle>
            <CardDescription>Across all units</CardDescription>
            <CardDescription className="text-3xl font-bold text-black dark:text-white">{totalRisks}</CardDescription>
          </CardHeader>
        </Card>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-none border border-muted-foreground/10 flex-1">
          <CardHeader>
            <CardTitle>Risk Severity Distribution</CardTitle>
            <CardDescription>Overview of risks by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent, value }) =>
                      value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : null
                    }
                    labelLine={false}
                  >
                    {severityData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={severityColors[idx]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value, name) => [`${value}`, name]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-4 flex-wrap justify-center">
                <span className="text-green-600 font-medium">Low (1-4)</span>
                <span className="text-yellow-500 font-medium">Medium (5-9)</span>
                <span className="text-orange-500 font-medium">High (10-16)</span>
                <span className="text-red-600 font-medium">Critical (17-25)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-muted-foreground/10">
          <CardHeader>
            <CardTitle>Risk Trends Over Time</CardTitle>
            <CardDescription>Number of risks by severity level over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution Analysis</CardTitle>
          <CardDescription>Detailed analysis of risk distributions across different dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="units" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="units">By Units</TabsTrigger>
              <TabsTrigger value="quarterly">By Quarter</TabsTrigger>
              <TabsTrigger value="severity">By Severity</TabsTrigger>
            </TabsList>

            <TabsContent value="units" className="mt-4">
              <div className="space-y-4">
                {unitRisks.map((unit, index) => (
                  <Card key={index} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{unit.unit}</h3>
                        <p className="text-sm text-muted-foreground">Total Risks: {unit.total}</p>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-red-500">High: {unit.high}</span>
                        <span className="text-yellow-500">Medium: {unit.medium}</span>
                        <span className="text-green-500">Low: {unit.low}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quarterly" className="mt-4">
              <div className="flex gap-4 mb-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Quarter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1">Q1</SelectItem>
                    <SelectItem value="Q2">Q2</SelectItem>
                    <SelectItem value="Q3">Q3</SelectItem>
                    <SelectItem value="Q4">Q4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Quarter {selectedQuarter} {selectedYear}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 font-medium">High Risk</p>
                      <p className="text-2xl font-bold">{quarterlyRisks[selectedYear][selectedQuarter].high}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-yellow-600 dark:text-yellow-400 font-medium">Medium Risk</p>
                      <p className="text-2xl font-bold">{quarterlyRisks[selectedYear][selectedQuarter].medium}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 font-medium">Low Risk</p>
                      <p className="text-2xl font-bold">{quarterlyRisks[selectedYear][selectedQuarter].low}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="severity" className="mt-4">
              <div className="space-y-4">
                {severityRisks.map((risk, index) => (
                  <Card key={index} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{risk.severity} Risk</h3>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                      <div className="text-2xl font-bold">{risk.count}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 