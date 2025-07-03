import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { riskApi } from "@/services/api";

const severityColors = ["#10B981", "#FBBF24", "#F59E0B", "#DC2626"];
const severityLabels = [
  { key: "Low", label: "Low", color: "text-green-500" },
  { key: "Moderate", label: "Moderate", color: "text-yellow-500" },
  { key: "High", label: "High", color: "text-orange-500" },
  { key: "Very High", label: "Very High", color: "text-red-500" },
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [severityData, setSeverityData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [unitRisks, setUnitRisks] = useState([]);
  const [quarterlyRisks, setQuarterlyRisks] = useState({});
  const [riskSummary, setRiskSummary] = useState([
    { label: "Very High", value: 0, color: "text-red-500" },
    { label: "High", value: 0, color: "text-orange-500" },
    { label: "Moderate", value: 0, color: "text-yellow-500" },
    { label: "Low", value: 0, color: "text-green-500" },
  ]);
  const [totalRisks, setTotalRisks] = useState(0);
  const [years, setYears] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // 1. Severity Distribution
      const severityRes = await riskApi.getSeverityDistribution();
      // Map backend severities to frontend labels
      const severityMap = { "Very High": 0, High: 0, Moderate: 0, Low: 0 };
      let total = 0;
      severityRes.data.forEach((item) => {
        if (item._id === "Critical" || item._id === "Very High") severityMap["Very High"] += item.count;
        else if (item._id === "High") severityMap["High"] += item.count;
        else if (item._id === "Medium" || item._id === "Moderate") severityMap["Moderate"] += item.count;
        else if (item._id === "Low") severityMap["Low"] += item.count;
        total += item.count;
      });
      setSeverityData([
        { name: "Low (1-4)", value: severityMap.Low },
        { name: "Moderate (5-9)", value: severityMap.Moderate },
        { name: "High (10-16)", value: severityMap.High },
        { name: "Very High (17-25)", value: severityMap["Very High"] },
      ]);
      setRiskSummary([
        { label: "Very High", value: severityMap["Very High"], color: "text-red-500" },
        { label: "High", value: severityMap.High, color: "text-orange-500" },
        { label: "Moderate", value: severityMap.Moderate, color: "text-yellow-500" },
        { label: "Low", value: severityMap.Low, color: "text-green-500" },
      ]);
      setTotalRisks(total);

      // 2. Risk Trends
      const trendsRes = await riskApi.getRiskTrends();
      // Group by month/year and severity
      const trendsMap = {};
      trendsRes.data.forEach((item) => {
        const { year, month, severity } = item._id;
        const key = `${year}-${month}`;
        if (!trendsMap[key]) trendsMap[key] = { month: `${year}-${month}`, High: 0, Medium: 0, Low: 0 };
        trendsMap[key][severity] = item.count;
      });
      setTrendData(Object.values(trendsMap));

      // 3. Unit Risk Breakdown
      const unitRes = await riskApi.getUnitRiskBreakdown();
      // Group by unit and severity
      const unitMap = {};
      unitRes.data.forEach((item) => {
        const { unit, severity } = item._id;
        if (!unitMap[unit]) unitMap[unit] = { unit, total: 0, veryHigh: 0, high: 0, moderate: 0, low: 0 };
        if (severity === "Critical" || severity === "Very High") unitMap[unit].veryHigh = item.count;
        else if (severity === "High") unitMap[unit].high = item.count;
        else if (severity === "Medium" || severity === "Moderate") unitMap[unit].moderate = item.count;
        else if (severity === "Low") unitMap[unit].low = item.count;
        unitMap[unit].total += item.count;
      });
      setUnitRisks(Object.values(unitMap));

      // 4. Quarterly Risk Breakdown
      const quarterRes = await riskApi.getQuarterlyRiskBreakdown();
      // Group by year, quarter, severity
      const qMap = {};
      const yearSet = new Set();
      quarterRes.data.forEach((item) => {
        const { year, quarter, severity } = item._id;
        yearSet.add(year);
        if (!qMap[year]) qMap[year] = {};
        if (!qMap[year][quarter]) qMap[year][quarter] = { total: 0, high: 0, medium: 0, low: 0 };
        if (severity === "High") qMap[year][quarter].high = item.count;
        if (severity === "Medium") qMap[year][quarter].medium = item.count;
        if (severity === "Low") qMap[year][quarter].low = item.count;
        qMap[year][quarter].total += item.count;
      });
      setQuarterlyRisks(qMap);
      setYears(Array.from(yearSet).sort().reverse());
      if (!selectedYear && yearSet.size > 0) setSelectedYear(Array.from(yearSet).sort().reverse()[0] as string);
      if (!selectedQuarter) setSelectedQuarter("Q1");
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-1">Welcome back,</h1>
          <p className="text-muted-foreground">Here's an overview of the University's risk management status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {riskSummary.map((risk, idx) => (
          <Card key={idx} className="shadow-none border border-muted-foreground/10">
            <CardHeader>
              <CardTitle className="text-lg">{risk.label} Risk</CardTitle>
              <CardDescription className={`text-3xl font-bold ${risk.color}`}>{risk.value}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        <Card className="shadow-none border border-muted-foreground/10 max-w-xs w-full md:w-60 flex flex-col items-center justify-center self-start md:self-auto">
          <CardHeader className="items-center text-center p-4">
            <CardTitle className="text-lg">Total Risks in this Quarter</CardTitle>
            <CardDescription>Across all units</CardDescription>
            <CardDescription className="text-3xl font-bold text-black dark:text-white">{totalRisks}</CardDescription>
          </CardHeader>
        </Card>
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
                <span className="text-yellow-500 font-medium">Moderate (5-9)</span>
                <span className="text-orange-500 font-medium">High (10-16)</span>
                <span className="text-red-600 font-medium">Very High (17-25)</span>
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
                <Line type="monotone" dataKey="Very High" stroke="#DC2626" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="High" stroke="#FFA500" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Moderate" stroke="#FBBF24" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Low" stroke="#10B981" strokeWidth={2} dot={false} />
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
                        <span className="text-red-500">Very High: {unit.veryHigh || 0}</span>
                        <span className="text-orange-500">High: {unit.high || 0}</span>
                        <span className="text-yellow-500">Moderate: {unit.moderate || 0}</span>
                        <span className="text-green-500">Low: {unit.low || 0}</span>
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
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 font-medium">Very High</p>
                      <p className="text-2xl font-bold">{quarterlyRisks[selectedYear]?.[selectedQuarter]?.veryHigh || 0}</p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-orange-600 dark:text-orange-400 font-medium">High</p>
                      <p className="text-2xl font-bold">{quarterlyRisks[selectedYear]?.[selectedQuarter]?.high || 0}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-yellow-600 dark:text-yellow-400 font-medium">Moderate</p>
                      <p className="text-2xl font-bold">{quarterlyRisks[selectedYear]?.[selectedQuarter]?.moderate || 0}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 font-medium">Low</p>
                      <p className="text-2xl font-bold">{quarterlyRisks[selectedYear]?.[selectedQuarter]?.low || 0}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* You can add more analytics tabs here if needed */}

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 