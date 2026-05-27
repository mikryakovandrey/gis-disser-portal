"use client";

import { useEffect, useMemo, useState } from "react";
import { RoleGate } from "@/components/auth/role-gate";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";
import { SectionCard } from "@/components/ui/section-card";
import type { FieldStatus, IrrigationMode } from "@/types";

const statuses: FieldStatus[] = ["healthy", "attention", "risk", "critical"];
const irrigationModes: IrrigationMode[] = ["none", "standard", "smart"];

export default function AdminPage() {
  const {
    currentUser,
    users,
    fields,
    fieldOverrides,
    setUserRole,
    deleteUser,
    upsertFieldOverride,
    clearFieldOverride
  } = useDemoPlatform();
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id ?? "");
  const activeField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) ?? fields[0],
    [fields, selectedFieldId]
  );

  const [status, setStatus] = useState<FieldStatus>(activeField?.status ?? "healthy");
  const [recommendation, setRecommendation] = useState(activeField?.recommendation ?? "");
  const [irrigationMode, setIrrigationMode] = useState<IrrigationMode>(
    activeField?.irrigationMode ?? "standard"
  );
  const [riskIndex, setRiskIndex] = useState(activeField?.riskIndex ?? 30);
  const [yieldForecast, setYieldForecast] = useState(activeField?.yieldForecast ?? 3);

  useEffect(() => {
    if (activeField) {
      setStatus(activeField.status);
      setRecommendation(activeField.recommendation);
      setIrrigationMode(activeField.irrigationMode);
      setRiskIndex(activeField.riskIndex);
      setYieldForecast(activeField.yieldForecast);
    }
  }, [activeField]);

  return (
    <RoleGate allow={["admin"]}>
      <div className="flex flex-col gap-6">
        <SectionCard
          title="Admin console"
          subtitle="Manage users and live field overrides."
        >
          <div className="grid gap-4 lg:grid-cols-4">
            <AdminStat label="Current admin" value={currentUser?.email ?? "-"} />
            <AdminStat label="Registered users" value={String(users.length)} />
            <AdminStat label="Field overrides" value={String(fieldOverrides.length)} />
            <AdminStat label="Access mode" value="Role-based" />
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
          <SectionCard
            title="User management"
            subtitle="Promote roles and remove accounts."
          >
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-800">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      {user.role} · {user.isVerified ? "verified" : "pending verification"} · created {user.createdAt}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setUserRole(user.id, user.role === "admin" ? "user" : "admin")}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
                    >
                      Make {user.role === "admin" ? "user" : "admin"}
                    </button>
                    {user.id !== currentUser?.id ? (
                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Field override editor"
            subtitle="Adjust the live operational state without changing the base dataset."
          >
            {activeField ? (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  upsertFieldOverride({
                    fieldId: activeField.id,
                    status,
                    recommendation,
                    irrigationMode,
                    riskIndex,
                    yieldForecast
                  });
                }}
              >
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Field</span>
                  <select
                    value={selectedFieldId}
                    onChange={(event) => {
                      const nextField =
                        fields.find((field) => field.id === event.target.value) ?? fields[0];
                      setSelectedFieldId(event.target.value);
                      if (nextField) {
                        setStatus(nextField.status);
                        setRecommendation(nextField.recommendation);
                        setIrrigationMode(nextField.irrigationMode);
                        setRiskIndex(nextField.riskIndex);
                        setYieldForecast(nextField.yieldForecast);
                      }
                    }}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                  >
                    {fields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Status</span>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as FieldStatus)}
                      className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                    >
                      {statuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Irrigation mode</span>
                    <select
                      value={irrigationMode}
                      onChange={(event) =>
                        setIrrigationMode(event.target.value as IrrigationMode)
                      }
                      className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                    >
                      {irrigationModes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Risk index</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={riskIndex}
                      onChange={(event) => setRiskIndex(Number(event.target.value))}
                      className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Yield forecast</span>
                    <input
                      type="number"
                      step="0.1"
                      value={yieldForecast}
                      onChange={(event) => setYieldForecast(Number(event.target.value))}
                      className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Recommendation</span>
                  <textarea
                    value={recommendation}
                    onChange={(event) => setRecommendation(event.target.value)}
                    rows={4}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-emerald-400"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21473a]"
                  >
                    Save override
                  </button>
                  <button
                    type="button"
                    onClick={() => clearFieldOverride(activeField.id)}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
                  >
                    Reset field to base
                  </button>
                </div>
              </form>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </RoleGate>
  );
}

function AdminStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-slate-800">{value}</div>
    </div>
  );
}
