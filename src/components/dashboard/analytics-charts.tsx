"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { ClickStats, DeviceStats } from "@/types";

const DEVICE_COLORS = {
  ios: "#3b82f6",
  android: "#22c55e",
  web: "#7c3aed",
  unknown: "#94a3b8",
};

interface ClicksChartProps {
  data: ClickStats[];
}

export function ClicksChart({ data }: ClicksChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "MMM d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          labelStyle={{ color: "#374151", fontWeight: 600 }}
          itemStyle={{ color: "#7c3aed" }}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#clicksGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#7c3aed" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DeviceChartProps {
  data: DeviceStats[];
}

export function DeviceChart({ data }: DeviceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400">
        No data yet
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="device"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={40}
          paddingAngle={3}
        >
          {data.map((entry) => (
            <Cell
              key={entry.device}
              fill={DEVICE_COLORS[entry.device as keyof typeof DEVICE_COLORS] ?? "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "13px",
          }}
          formatter={(value) => [`${value} (${Math.round(((value as number) / total) * 100)}%)`, "Clicks"]}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: "12px", color: "#6b7280", textTransform: "capitalize" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
