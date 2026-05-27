"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Field } from "@/types";
import { SectionCard } from "@/components/ui/section-card";
import {
  formatPercent,
  formatTemperature,
  formatYield
} from "@/utils/formatters";

type AnalyticsChartsProps = {
  field: Field;
};

export function AnalyticsCharts({ field }: AnalyticsChartsProps) {
  return (
    <SectionCard
      title="Sensor Data History"
      subtitle={`Temporal analytics and scenario-adjusted model signals for ${field.name}.`}
    >
      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-4">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Soil Moisture Trend
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Moisture behavior over the latest observation window.
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={field.timeline}>
                <CartesianGrid vertical={false} stroke="#d8dfd2" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#607080", fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#607080", fontSize: 12 }}
                  domain={["dataMin - 3", "dataMax + 3"]}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="soilMoisture"
                  stroke="#2f6b54"
                  strokeWidth={3}
                  dot={{ fill: "#2f6b54", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-4">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Microclimate
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Temperature and air humidity captured by the telemetry network.
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={field.timeline}>
                <CartesianGrid vertical={false} stroke="#d8dfd2" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#607080", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#607080", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="airTemperature"
                  stroke="#c66a37"
                  strokeWidth={2.6}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="airHumidity"
                  stroke="#4b78a8"
                  strokeWidth={2.6}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-4">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Weather and Yield Signal
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Precipitation impact paired with the model yield trajectory.
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={field.timeline}>
                <CartesianGrid vertical={false} stroke="#d8dfd2" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#607080", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#607080", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="precipitation" fill="#8baecf" radius={[6, 6, 0, 0]} barSize={18} />
                <Area
                  type="monotone"
                  dataKey="yieldPotential"
                  fill="rgba(211, 154, 60, 0.18)"
                  stroke="#d39a3c"
                  strokeWidth={2.4}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-white/70 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Model Output
            </div>
            <div className="mt-1 font-display text-2xl tracking-[-0.04em] text-ink">
              {field.recommendation}
            </div>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Yield forecast: {formatYield(field.yieldForecast)}
          </div>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
          {field.modelSummary}
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full table-fixed border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Soil Moisture</th>
                <th className="px-3 py-2">Air Temp</th>
                <th className="px-3 py-2">Air Humidity</th>
                <th className="px-3 py-2">Rainfall</th>
                <th className="px-3 py-2">Yield Trend</th>
              </tr>
            </thead>
            <tbody>
              {field.timeline.slice(-4).map((point) => (
                <tr key={point.label} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                  <td className="rounded-l-2xl px-3 py-3 font-medium">{point.label}</td>
                  <td className="px-3 py-3">{formatPercent(point.soilMoisture)}</td>
                  <td className="px-3 py-3">{formatTemperature(point.airTemperature)}</td>
                  <td className="px-3 py-3">{formatPercent(point.airHumidity)}</td>
                  <td className="px-3 py-3">{point.precipitation.toFixed(1)} mm</td>
                  <td className="rounded-r-2xl px-3 py-3">
                    {formatYield(point.yieldPotential)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}

function ChartTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <div className="font-semibold text-slate-700">{label}</div>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-semibold text-slate-700">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
