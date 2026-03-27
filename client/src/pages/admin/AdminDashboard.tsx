import React, { useEffect, useState } from "react";
import { adminApiClient } from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { sub, type Duration } from "date-fns";
import {
  Users,
  UserPlus,
  Activity,
  Image as ImageIcon,
  MousePointerClick,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import AdminDashboardSkeleton from "@/components/skeleton/AdminDashboardSkeleton";

interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalInteractions: number;
}

interface DashboardChart {
  date: string;
  newUsers: number;
  interactions: number;
  posts: number;
}

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<DashboardChart[]>([]);
  const [loading, setLoading] = useState(true);

  // Default to last 1 month
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(sub(endDate, { months: 1 }));

  const handlePresetDate = (duration: Duration) => {
    const end = new Date();
    const start = sub(end, duration);

    setEndDate(end);
    setStartDate(start);
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get("/dashboard", {
        params: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
      });

      const { chartData: resChartData, ...stats } = res.data.metrics;
      const chartData: DashboardChart[] = [];
      setStats(stats);

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const date = currentDate.toISOString().split("T")[0];
        const resData = resChartData.find((d: any) => d.date === date);
        chartData.push(
          resData || {
            date,
            newUsers: 0,
            interactions: 0,
            posts: 0,
          },
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setChartData(chartData);
    } catch (error: any) {
      console.log(error);
      toast({
        description:
          error?.response?.data?.message || "Failed to fetch dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate]);
  console.log(chartData);
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in slide-in-from-top duration-500">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-1">
            Platform metrics and engagement data
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-primary/30 p-2 rounded-lg border border-primary/10 shadow-md">
          {/* Preset Buttons */}
          <div className="flex gap-2 mr-2 border-r border-primary/20 pr-4">
            <button
              className="text-xs px-3 py-1.5 rounded bg-primary/40 hover:bg-primary/60 text-white transition-colors border border-primary/20 hover:border-primary/40"
              onClick={() => handlePresetDate({ weeks: 1 })}
            >
              1W
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded bg-primary/40 hover:bg-primary/60 text-white transition-colors border border-primary/20 hover:border-primary/40"
              onClick={() => handlePresetDate({ months: 1 })}
            >
              1M
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded bg-primary/40 hover:bg-primary/60 text-white transition-colors border border-primary/20 hover:border-primary/40"
              onClick={() => handlePresetDate({ months: 6 })}
            >
              6M
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded bg-primary/40 hover:bg-primary/60 text-white transition-colors border border-primary/20 hover:border-primary/40"
              onClick={() => handlePresetDate({ years: 1 })}
            >
              1Y
            </button>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 ml-1 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="bg-primary/50 border border-primary/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan transition-all"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <span className="text-gray-500 mt-5">to</span>
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 ml-1 mb-1">End Date</label>
            <input
              type="date"
              className="bg-primary/50 border border-primary/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan transition-all"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
        </div>
      </div>

      {loading && !stats ? (
        <AdminDashboardSkeleton />
      ) : stats ? (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              iconClassName="bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
            <StatCard
              title="New Users"
              value={stats.newUsers.toLocaleString()}
              icon={UserPlus}
              iconClassName="bg-neon-cyan/80 shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              icon={Activity}
              iconClassName="bg-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
            />
            <StatCard
              title="Total Posts"
              value={stats.totalPosts.toLocaleString()}
              icon={ImageIcon}
              iconClassName="bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
            <StatCard
              title="Interactions"
              value={stats.totalInteractions.toLocaleString()}
              icon={MousePointerClick}
              iconClassName="bg-neon-pink/80 shadow-[0_0_15px_rgba(255,0,255,0.4)]"
            />
          </div>

          {/* Charts Area */}
          <div className="bg-primary/30 border border-primary/10 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div
              className="absolute bottom-0 left-0 w-64 h-64 bg-neon-pink/5 rounded-full blur-[100px] -z-10 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>

            <h3 className="text-xl font-semibold mb-6 text-white border-b border-primary/10 pb-4 flex items-center gap-2">
              <Activity className="text-neon-cyan" size={20} />
              Audience Growth & Engagement
            </h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#888"
                    tick={{ fill: "#888", fontSize: 12 }}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    tickMargin={10}
                    axisLine={{ stroke: "#ffffff20" }}
                  />
                  <YAxis
                    stroke="#888"
                    tick={{ fill: "#888", fontSize: 12 }}
                    axisLine={{ stroke: "#ffffff20" }}
                    tickFormatter={(val) =>
                      val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                      padding: "12px",
                    }}
                    itemStyle={{
                      color: "white",
                      fontWeight: 500,
                      padding: "4px 0",
                    }}
                    labelStyle={{
                      color: "#aaa",
                      marginBottom: "8px",
                      borderBottom: "1px solid #ffffff20",
                      paddingBottom: "4px",
                    }}
                    labelFormatter={(label) =>
                      new Date(label as string).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    name="New Users"
                    dataKey="newUsers"
                    stroke="#00ffff"
                    strokeWidth={3}
                    dot={{ r: 0 }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      fill: "#0f172a",
                      stroke: "#00ffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    name="Interactions"
                    dataKey="interactions"
                    stroke="#ff00ff"
                    strokeWidth={3}
                    dot={{ r: 0 }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      fill: "#0f172a",
                      stroke: "#ff00ff",
                    }}
                  />
                  <Line
                    type="monotone"
                    name="Daily Posts"
                    dataKey="posts"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ r: 0 }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      fill: "#0f172a",
                      stroke: "#a855f7",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No data available for this range
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
