"use client";

import Link from "next/link";
import { RoleGate } from "@/components/auth/role-gate";
import { KPIStatCard } from "@/components/dashboard/kpi-stat-card";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";
import {
  getDashboardMetrics,
  getLatestRecommendations,
  getMostAtRiskFields
} from "@/utils/field-helpers";
import {
  formatPercent,
  formatTemperature,
  formatYield
} from "@/utils/formatters";

export default function DashboardPage() {
  const { fields } = useDemoPlatform();
  const metrics = getDashboardMetrics(fields);
  const latestRecommendations = getLatestRecommendations(fields);
  const topRiskFields = getMostAtRiskFields(fields);

  return (
    <RoleGate allow={["user", "admin"]}>
      <div className="relative z-10 flex flex-col gap-6">
      <section className="app-panel overflow-hidden">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.45fr_0.95fr] lg:px-8 lg:py-8">
          <div className="space-y-5">
            <span className="app-chip">Thesis Demo Prototype</span>
            <div className="space-y-3">
              <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                AgroSphere GIS portal for intelligent precision farming decisions
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                A thesis demonstration platform centered on the Pavlodar pilot
                zone that combines field geography, IoT telemetry, agronomic
                indicators, live scenario simulation, forecasted yield, and
                decision-support recommendations in one analytical workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/gis"
                className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21473a]"
              >
                Open GIS Portal
              </Link>
              <a
                href="#recommendations"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Review Recommendations
              </a>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/70 bg-gradient-to-br from-[#264c3d] via-[#2f5f4c] to-[#4b6f47] p-6 text-white shadow-panel">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                System Snapshot
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/80">
                Simulation Mode
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-sm text-white/70">Mean Yield Forecast</div>
                <div className="mt-2 font-display text-3xl tracking-[-0.04em]">
                  {formatYield(metrics.averageYield)}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-sm text-white/70">Risk Exposure</div>
                <div className="mt-2 font-display text-3xl tracking-[-0.04em]">
                  {metrics.riskFields} fields
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                "IoT telemetry is synchronized with field-level agronomic state in the Pavlodar pilot contours.",
                "The scenario model translates changing inputs into updated risk, yield, and irrigation advice.",
                "GIS view exposes the spatial context of stress, operational priority, and expected yield."
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-3"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <p className="text-sm leading-6 text-white/85">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KPIStatCard
          label="Monitored Fields"
          value={metrics.fieldCount.toString()}
          helper="Distinct agricultural parcels on the map"
        />
        <KPIStatCard
          label="Active Sensors"
          value={metrics.activeSensors.toString()}
          helper="Live IoT devices currently streaming telemetry"
        />
        <KPIStatCard
          label="Average Soil Moisture"
          value={formatPercent(metrics.averageSoilMoisture)}
          helper="Aggregate field moisture level"
        />
        <KPIStatCard
          label="Average Air Temperature"
          value={formatTemperature(metrics.averageAirTemperature)}
          helper="Mean atmospheric condition across all zones"
        />
        <KPIStatCard
          label="Fields In Risk Zone"
          value={metrics.riskFields.toString()}
          helper="Fields marked as risk or critical"
        />
        <KPIStatCard
          label="Average Yield Forecast"
          value={formatYield(metrics.averageYield)}
          helper="Expected productivity from the predictive model"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <SectionCard
          id="recommendations"
          title="Latest Recommendations"
          subtitle="System-generated agronomic actions and monitoring notes."
        >
          <div className="grid gap-4">
            {latestRecommendations.map((field) => (
              <RecommendationCard key={field.id} field={field} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Monitoring Highlights"
          subtitle="Priority parcels ranked by model risk index."
        >
          <div className="space-y-4">
            {topRiskFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Priority {index + 1}
                    </div>
                    <div className="mt-1 font-display text-xl tracking-[-0.04em] text-ink">
                      {field.name}
                    </div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">
                    {field.riskIndex}/100 risk
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-600">
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Crop
                    </div>
                    <div className="mt-1 font-medium text-slate-700">
                      {field.crop}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Moisture
                    </div>
                    <div className="mt-1 font-medium text-slate-700">
                      {formatPercent(field.soilMoisture)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Forecast
                    </div>
                    <div className="mt-1 font-medium text-slate-700">
                      {formatYield(field.yieldForecast)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
      </div>
    </RoleGate>
  );
}
