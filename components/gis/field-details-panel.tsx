import { Field } from "@/types";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatArea,
  formatPercent,
  formatTemperature,
  formatYield
} from "@/utils/formatters";

type FieldDetailsPanelProps = {
  field?: Field;
};

const metricCards = [
  { key: "soilMoisture", label: "Soil Moisture", formatter: formatPercent },
  { key: "airTemperature", label: "Air Temperature", formatter: formatTemperature },
  { key: "airHumidity", label: "Air Humidity", formatter: formatPercent },
  { key: "soilPh", label: "pH", formatter: (value: number) => value.toFixed(1) },
  {
    key: "precipitation",
    label: "Precipitation",
    formatter: (value: number) => `${value.toFixed(1)} mm`
  },
  { key: "yieldForecast", label: "Yield Forecast", formatter: formatYield }
] as const;

export function FieldDetailsPanel({ field }: FieldDetailsPanelProps) {
  if (!field) {
    return (
      <SectionCard
        title="Field Details"
        subtitle="Select a field on the map or from the sidebar to inspect its agronomic profile."
      >
        <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/70 px-5 py-12 text-center text-sm text-slate-500">
          No field selected.
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Field Intelligence"
      subtitle="Detailed agricultural state, risk, and recommendation output."
    >
      <div className="space-y-5">
        <div className="rounded-[24px] bg-gradient-to-br from-[#264c3d] via-[#2d5847] to-[#6d8c4d] p-5 text-white shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-white/70">
                Selected Field
              </div>
              <h2 className="mt-1 font-display text-3xl tracking-[-0.05em]">
                {field.name}
              </h2>
              <p className="mt-2 text-sm text-white/80">
                {field.crop} / {field.growthStage}
              </p>
              <p className="mt-2 max-w-sm text-sm text-white/70">
                {field.locationLabel}
              </p>
            </div>
            <StatusBadge status={field.status} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/12 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.12em] text-white/60">
                Area
              </div>
              <div className="mt-1 text-lg font-semibold">
                {formatArea(field.areaHa)}
              </div>
            </div>
            <div className="rounded-2xl bg-white/12 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.12em] text-white/60">
                Last update
              </div>
              <div className="mt-1 text-lg font-semibold">{field.updatedAt}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {metricCards.map((metric) => (
            <div
              key={metric.key}
              className="rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-4"
            >
              <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                {metric.label}
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-800">
                {metric.formatter(field[metric.key])}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/75 p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Agronomic Parameters
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <DetailMetric label="Nitrogen (N)" value={`${field.nutrients.n} ppm`} />
            <DetailMetric label="Phosphorus (P)" value={`${field.nutrients.p} ppm`} />
            <DetailMetric label="Potassium (K)" value={`${field.nutrients.k} ppm`} />
            <DetailMetric label="NDVI" value={field.ndvi.toFixed(2)} />
            <DetailMetric
              label="Evapotranspiration"
              value={`${field.evapotranspiration.toFixed(1)} mm/day`}
            />
            <DetailMetric
              label="Irrigation mode"
              value={field.irrigationMode.replace(/^\w/, (letter) => letter.toUpperCase())}
            />
            <DetailMetric label="Risk index" value={`${field.riskIndex}/100`} />
            <DetailMetric label="Sensors online" value={`${field.activeSensors}/${field.sensorCount}`} />
            <DetailMetric label="Irrigation window" value={field.irrigationWindow} />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#f9f5e8] to-white p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Decision Support Output
          </div>
          <div className="mt-2 font-display text-2xl tracking-[-0.04em] text-ink">
            {field.recommendation}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {field.modelSummary}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

type DetailMetricProps = {
  label: string;
  value: string;
};

function DetailMetric({ label, value }: DetailMetricProps) {
  return (
    <div className="rounded-[18px] bg-slate-50 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-700">{value}</div>
    </div>
  );
}
