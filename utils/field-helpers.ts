import { Field, FieldStatus } from "@/types";

export function getStatusMeta(status: FieldStatus) {
  const map = {
    healthy: {
      label: "Normal",
      fillColor: "#2f9e62",
      strokeColor: "#226c46",
      badgeClassName:
        "inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 font-semibold uppercase tracking-[0.12em]"
    },
    attention: {
      label: "Attention",
      fillColor: "#f1c453",
      strokeColor: "#c38f18",
      badgeClassName:
        "inline-flex items-center rounded-full bg-amber-100 text-amber-700 font-semibold uppercase tracking-[0.12em]"
    },
    risk: {
      label: "Risk",
      fillColor: "#ef8b33",
      strokeColor: "#bf5b16",
      badgeClassName:
        "inline-flex items-center rounded-full bg-orange-100 text-orange-700 font-semibold uppercase tracking-[0.12em]"
    },
    critical: {
      label: "Critical",
      fillColor: "#d6534c",
      strokeColor: "#a8322b",
      badgeClassName:
        "inline-flex items-center rounded-full bg-rose-100 text-rose-700 font-semibold uppercase tracking-[0.12em]"
    }
  } satisfies Record<FieldStatus, {
    label: string;
    fillColor: string;
    strokeColor: string;
    badgeClassName: string;
  }>;

  return map[status];
}

export function getDashboardMetrics(fields: Field[]) {
  const fieldCount = fields.length;
  const activeSensors = fields.reduce((sum, field) => sum + field.activeSensors, 0);
  const averageSoilMoisture =
    fields.reduce((sum, field) => sum + field.soilMoisture, 0) / fieldCount;
  const averageAirTemperature =
    fields.reduce((sum, field) => sum + field.airTemperature, 0) / fieldCount;
  const riskFields = fields.filter(
    (field) => field.status === "risk" || field.status === "critical"
  ).length;
  const averageYield =
    fields.reduce((sum, field) => sum + field.yieldForecast, 0) / fieldCount;

  return {
    fieldCount,
    activeSensors,
    averageSoilMoisture,
    averageAirTemperature,
    riskFields,
    averageYield
  };
}

export function getLatestRecommendations(fields: Field[]) {
  return [...fields].sort((a, b) => b.riskIndex - a.riskIndex).slice(0, 4);
}

export function getMostAtRiskFields(fields: Field[]) {
  return [...fields].sort((a, b) => b.riskIndex - a.riskIndex).slice(0, 3);
}

export function getUniqueCrops(fields: Field[]) {
  return Array.from(new Set(fields.map((field) => field.crop))).sort();
}
