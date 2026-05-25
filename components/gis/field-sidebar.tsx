import { Field, FieldStatus } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/section-card";
import { formatPercent } from "@/utils/formatters";

type FieldSidebarProps = {
  fields: Field[];
  allCrops: string[];
  selectedCrop: string;
  selectedStatus: string;
  selectedFieldId: string;
  statuses: Array<"All statuses" | FieldStatus>;
  onCropChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSelectField: (value: string) => void;
};

export function FieldSidebar({
  fields,
  allCrops,
  selectedCrop,
  selectedStatus,
  selectedFieldId,
  statuses,
  onCropChange,
  onStatusChange,
  onSelectField
}: FieldSidebarProps) {
  return (
    <SectionCard
      title="Field Navigator"
      subtitle="Filter the Pavlodar pilot contours and switch quickly between monitored zones."
      className="self-start xl:sticky xl:top-24"
    >
      <div className="space-y-5">
        <div className="grid gap-3">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Crop filter</span>
            <select
              value={selectedCrop}
              onChange={(event) => onCropChange(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            >
              <option>All crops</option>
              {allCrops.map((crop) => (
                <option key={crop}>{crop}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Status filter</span>
            <select
              value={selectedStatus}
              onChange={(event) => onStatusChange(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm capitalize text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            >
              {statuses.map((status) => (
                <option key={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-[22px] border border-slate-200 bg-slate-50/75 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Current Scope
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <div className="font-display text-3xl tracking-[-0.04em] text-ink">
                {fields.length}
              </div>
              <div className="text-sm text-slate-500">visible fields</div>
            </div>
            <div className="text-right text-sm text-slate-500">
              <div>{selectedCrop}</div>
              <div className="capitalize">{selectedStatus}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {fields.length ? (
            fields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => onSelectField(field.id)}
                className={`w-full rounded-[24px] border p-4 text-left transition ${
                  selectedFieldId === field.id
                    ? "border-ink bg-white shadow-soft"
                    : "border-slate-200 bg-slate-50/65 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-xl tracking-[-0.04em] text-ink">
                      {field.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {field.crop} / {field.growthStage}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                      {field.locationLabel}
                    </div>
                  </div>
                  <StatusBadge status={field.status} compact />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Moisture
                    </div>
                    <div className="mt-1 font-semibold text-slate-700">
                      {formatPercent(field.soilMoisture)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Risk
                    </div>
                    <div className="mt-1 font-semibold text-slate-700">
                      {field.riskIndex}/100
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm text-slate-500">
              No fields match the current filter combination.
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
