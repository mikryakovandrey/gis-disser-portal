"use client";

import { useEffect, useState } from "react";
import { RoleGate } from "@/components/auth/role-gate";
import { AnalyticsCharts } from "@/components/gis/analytics-charts";
import { FieldDetailsPanel } from "@/components/gis/field-details-panel";
import { FieldSidebar } from "@/components/gis/field-sidebar";
import { MapView } from "@/components/gis/map-view";
import { OperationsReplay } from "@/components/gis/operations-replay";
import { ScenarioLab } from "@/components/gis/scenario-lab";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";
import { SectionCard } from "@/components/ui/section-card";
import { getUniqueCrops } from "@/utils/field-helpers";
import {
  applyScenarioPreset,
  computeScenarioResult,
  createScenarioInput
} from "@/utils/scenario-model";

type WorkspaceView = "overview" | "scenario" | "analytics" | "replay";

const workspaceViews: Array<{
  id: WorkspaceView;
  label: string;
  description: string;
}> = [
  {
    id: "overview",
    label: "Field overview",
    description: "Map and live field state"
  },
  {
    id: "scenario",
    label: "Scenario lab",
    description: "What-if inputs and response actions"
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Trends and yield charts"
  },
  {
    id: "replay",
    label: "Plan / Fact",
    description: "Operation replay and quality"
  }
];

export default function GISPage() {
  const { fields } = useDemoPlatform();
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id ?? "");
  const [selectedCrop, setSelectedCrop] = useState<string>("All crops");
  const [selectedStatus, setSelectedStatus] = useState<string>("All statuses");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("overview");
  const [scenarioInput, setScenarioInput] = useState(() =>
    fields[0] ? createScenarioInput(fields[0]) : undefined
  );

  const filteredBaseFields = fields.filter((field) => {
    const cropMatches =
      selectedCrop === "All crops" || field.crop === selectedCrop;
    const statusMatches =
      selectedStatus === "All statuses" || field.status === selectedStatus;

    return cropMatches && statusMatches;
  });

  useEffect(() => {
    if (!filteredBaseFields.some((field) => field.id === selectedFieldId)) {
      setSelectedFieldId(filteredBaseFields[0]?.id ?? "");
    }
  }, [filteredBaseFields, selectedFieldId]);

  const baseSelectedField =
    filteredBaseFields.find((field) => field.id === selectedFieldId) ??
    filteredBaseFields[0];

  const liveScenarioInput =
    baseSelectedField && scenarioInput?.fieldId === baseSelectedField.id
      ? scenarioInput
      : baseSelectedField
        ? createScenarioInput(baseSelectedField)
        : undefined;

  useEffect(() => {
    if (baseSelectedField && scenarioInput?.fieldId !== baseSelectedField.id) {
      setScenarioInput(createScenarioInput(baseSelectedField));
    }
  }, [baseSelectedField, scenarioInput?.fieldId]);

  const scenarioResult =
    baseSelectedField && liveScenarioInput
      ? computeScenarioResult(baseSelectedField, liveScenarioInput)
      : undefined;

  const visibleFields = filteredBaseFields;
  const selectedField = baseSelectedField;
  const analyticsField = scenarioResult?.field ?? baseSelectedField;

  return (
    <RoleGate allow={["user", "admin"]}>
      <div className="relative z-10 flex flex-col gap-6">
      <section className="app-panel overflow-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="app-chip">Pavlodar Pilot GIS Workspace</span>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl">
                Spatial monitoring, scenario simulation, and plan/fact replay for the Pavlodar pilot zone
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Review field conditions for the Irtysh district pilot contours, inspect
                agronomic telemetry, evaluate how changing soil and weather
                inputs shifts risk and yield, and replay field operations to connect
                execution quality with the final result.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Visible Fields
              </div>
              <div className="mt-2 font-display text-3xl tracking-[-0.04em]">
                {visibleFields.length}
              </div>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Crop Filter
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-700">
                {selectedCrop}
              </div>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Scenario Mode
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-700">
                What-if simulation enabled
              </div>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Workspace
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-700">
                {workspaceViews.find((view) => view.id === workspaceView)?.label}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)_minmax(540px,620px)]">
        <div className="order-2 xl:order-1">
        <FieldSidebar
          fields={visibleFields}
          allCrops={getUniqueCrops(fields)}
          selectedCrop={selectedCrop}
          selectedStatus={selectedStatus}
          selectedFieldId={selectedField?.id ?? ""}
          onCropChange={setSelectedCrop}
          onStatusChange={setSelectedStatus}
          onSelectField={setSelectedFieldId}
          statuses={["All statuses", "healthy", "attention", "risk", "critical"]}
        />
        </div>

        <div className="order-1 space-y-6 xl:order-2 xl:col-span-2 2xl:col-span-2">
          <SectionCard
            title="Workspace Modes"
            subtitle="Switch between overview, scenario controls, analytics, and plan/fact replay instead of managing every subsystem on one crowded screen."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {workspaceViews.map((view) => {
                const isActive = workspaceView === view.id;

                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setWorkspaceView(view.id)}
                    className={`rounded-[24px] border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-emerald-300 bg-emerald-50 shadow-soft"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-800">
                      {view.label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {view.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {workspaceView === "overview" ? (
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(540px,620px)]">
              <SectionCard
                title="Interactive Field Map"
                subtitle="Polygon-based overview of the Pavlodar pilot parcels with live status coloring."
                className="overflow-hidden"
              >
                <div className="flex h-full min-h-[420px] flex-col gap-4 sm:min-h-[640px]">
                  <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 md:grid-cols-4">
                    {[
                      {
                        label: "Healthy",
                        color: "bg-emerald-500",
                        text: "Stable response"
                      },
                      {
                        label: "Attention",
                        color: "bg-amber-400",
                        text: "Watch closely"
                      },
                      {
                        label: "Risk",
                        color: "bg-orange-500",
                        text: "Correct soon"
                      },
                      {
                        label: "Critical",
                        color: "bg-rose-600",
                        text: "Immediate action"
                      }
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm"
                      >
                        <span className={`h-3 w-3 rounded-full ${item.color}`} />
                        <div>
                          <div className="text-sm font-semibold text-slate-700">
                            {item.label}
                          </div>
                          <div className="text-xs text-slate-500">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="min-h-[340px] flex-1 overflow-hidden rounded-[28px] border border-slate-200 sm:min-h-[540px]">
                    <MapView
                      fields={visibleFields}
                      selectedFieldId={selectedField?.id ?? ""}
                      onSelectField={setSelectedFieldId}
                    />
                  </div>
                </div>
              </SectionCard>

              <FieldDetailsPanel field={selectedField} />
            </div>
          ) : null}

          {workspaceView === "scenario" ? (
            <ScenarioLab
              field={baseSelectedField}
              input={liveScenarioInput}
              result={scenarioResult}
              onChange={setScenarioInput}
              onReset={() => {
                if (baseSelectedField) {
                  setScenarioInput(createScenarioInput(baseSelectedField));
                }
              }}
              onApplyPreset={(presetId) => {
                if (baseSelectedField) {
                  setScenarioInput(
                    applyScenarioPreset(
                      baseSelectedField,
                      liveScenarioInput,
                      presetId
                    )
                  );
                }
              }}
            />
          ) : null}

          {workspaceView === "analytics" ? (
            analyticsField ? (
              <AnalyticsCharts field={analyticsField} />
            ) : (
              <SectionCard
                title="Analytics"
                subtitle="Select a field to inspect agronomic trends."
              >
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/60 px-5 py-10 text-center text-sm text-slate-500">
                  No field matches the active filters.
                </div>
              </SectionCard>
            )
          ) : null}

          {workspaceView === "replay" ? (
            selectedField ? (
              <OperationsReplay field={selectedField} />
            ) : (
              <SectionCard
                title="Plan / Fact Replay"
                subtitle="Select a field to inspect the operation replay."
              >
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/60 px-5 py-10 text-center text-sm text-slate-500">
                  No field matches the active filters.
                </div>
              </SectionCard>
            )
          ) : null}
        </div>
      </div>
      </div>
    </RoleGate>
  );
}
