import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const REPORT_TYPES = [
  { key: "riskRegister", label: "Risk Register", description: "Complete risk register with all details" },
  { key: "riskSummary", label: "Risk Summary", description: "Summary statistics of all risks" },
  { key: "mitigationStatus", label: "Mitigation Status", description: "Progress on risk treatments" },
  { key: "riskTrend", label: "Risk Trend Analysis", description: "Risk trends over time" },
  { key: "complianceStatus", label: "Compliance Status", description: "Compliance with regulatory requirements" },
  { key: "quarterlyPerformance", label: "Quarterly Performance", description: "Quarterly risk management report" },
];

const DEPARTMENTS = ["All Departments", "Finance", "HR", "IT", "Operations"];
const DATE_RANGES = ["Current Quarter", "Last Quarter", "Year to Date"];
const STATUSES = ["All Statuses", "Open", "Closed", "In Progress"];
const FORMATS = ["PDF Document", "Excel Spreadsheet", "CSV File"];

const RECENT_REPORTS = [
  { title: "Q2 2024 Risk Register", date: "May 15, 2024", format: "PDF" },
  { title: "Department Compliance Report", date: "Apr 28, 2024", format: "Excel" },
  { title: "Risk Trend Analysis", date: "Mar 12, 2024", format: "PDF" },
];

export default function GenerateReportsPage() {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const riskCount = 5;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Report Configuration */}
        <Card className="flex-1 min-w-[350px]">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Select the type of report and customize parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tabs for steps */}
            <Tabs defaultValue="type" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="type">Report Type</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="format">Format</TabsTrigger>
              </TabsList>
              <TabsContent value="type">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REPORT_TYPES.map((type) => (
                    <Card
                      key={type.key}
                      className={`cursor-pointer border-2 transition-colors ${reportType.key === type.key ? 'border-primary' : 'border-muted'}`}
                      onClick={() => setReportType(type)}
                    >
                      <CardContent className="p-4">
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="filters">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium">Department</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(dep => (
                          <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger><SelectValue placeholder="Select date range" /></SelectTrigger>
                      <SelectContent>
                        {DATE_RANGES.map(dr => (
                          <SelectItem key={dr} value={dr}>{dr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(st => (
                          <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="format">
                <div className="flex gap-4">
                  {FORMATS.map(fmt => (
                    <Button
                      key={fmt}
                      variant={format === fmt ? "default" : "outline"}
                      onClick={() => setFormat(fmt)}
                    >
                      {fmt}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Report Summary */}
        <Card className="w-full md:w-80 h-fit">
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="font-semibold">Report Type:</span> {reportType.label}</div>
            <div><span className="font-semibold">Department:</span> {department}</div>
            <div><span className="font-semibold">Format:</span> {format.split(" ")[0]}</div>
            <div><span className="font-semibold">Risk Count:</span> {riskCount}</div>
            <Button className="w-full mt-4"><span role="img" aria-label="download">⬇️</span> Generate Report</Button>
          </CardContent>
        </Card>
      </div>
      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-muted-foreground/10">
            {RECENT_REPORTS.map((r, idx) => (
              <li key={idx} className="flex justify-between items-center py-3">
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{r.format}</span>
                  <span role="img" aria-label="download">⬇️</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 