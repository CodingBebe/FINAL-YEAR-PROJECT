import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [quarter, setQuarter] = useState("Q1");
  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalRisks: 0,
    mitigatedRisks: 0,
    highRisks: 0,
    totalChange: 0,
    mitigatedChange: 0,
    highChange: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Coordinator Dashboard | UDSM RMIS";
    fetchData();
    // eslint-disable-next-line
  }, [quarter, year]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/coordinator-dashboard?quarter=${quarter}&year=${year}`
      );
      const data = await res.json();
      setStats(data.stats);
      setChartData(data.chartData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuarter(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };

  const metrics = [
    {
      title: "Total Risks",
      value: stats.totalRisks ?? 120,
      change: stats.totalChange ?? 5,
      icon: BarChart2,
    },
    {
      title: "Mitigated Risks",
      value: stats.mitigatedRisks ?? 80,
      change: stats.mitigatedChange ?? 2,
      icon: BarChart2,
    },
    {
      title: "High Priority Risks",
      value: stats.highRisks ?? 15,
      change: stats.highChange ?? -3,
      icon: BarChart2,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, Risk Coordinator</h1>

      <div className="flex gap-4 mb-6">
        <select
          className="border rounded px-2 py-1"
          value={quarter}
          onChange={handleQuarterChange}
        >
          <option value="Q1">Q1 (Jan-Mar)</option>
          <option value="Q2">Q2 (Apr-Jun)</option>
          <option value="Q3">Q3 (Jul-Sep)</option>
          <option value="Q4">Q4 (Oct-Dec)</option>
        </select>
       <select
          className="border rounded px-2 py-1"
          value={year}
          onChange={handleYearChange}
        >
          {Array.from({ length: 6 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {metrics.map(({ title, value, change, icon: Icon }, idx) => (
          <Card key={idx} className="p-4 flex justify-between items-center">
            <div>
              <h2 className="text-sm text-muted-foreground">{title}</h2>
              <div className="text-2xl font-bold">{value}</div>
              <div className="flex items-center mt-1 text-sm">
                {change >= 0 ? (
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +{change}%
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                    {change}%
                  </span>
                )}
              </div>
            </div>
            <Icon className="w-10 h-10 text-muted-foreground" />
          </Card>
        ))}
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Risk Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="risks" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
           </div>
    </div>
  );
}