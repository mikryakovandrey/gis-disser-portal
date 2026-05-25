import {
  EconomicEffect,
  Field,
  FieldStatus,
  IrrigationMode,
  ScenarioFactor,
  ScenarioInput,
  ScenarioPreset,
  ScenarioResult
} from "@/types";

type Range = [number, number];
type StressKey =
  | "soilMoisture"
  | "airTemperature"
  | "airHumidity"
  | "precipitation"
  | "soilPh"
  | "nitrogen"
  | "phosphorus"
  | "potassium";

type CropProfile = {
  moisture: Range;
  temperature: Range;
  humidity: Range;
  ph: Range;
  precipitation: Range;
  nutrients: {
    n: number;
    p: number;
    k: number;
  };
  yieldBounds: Range;
  irrigationBoost: number;
  cropPriceKztPerTon: number;
};

type StressBreakdown = Record<StressKey, number> & {
  total: number;
  irrigationRelief: number;
};

export type OptimalCareRecommendation = {
  input: ScenarioInput;
  title: string;
  rationale: string;
  score: number;
  result: ScenarioResult;
};

const cropProfiles: Record<string, CropProfile> = {
  Wheat: {
    moisture: [26, 34],
    temperature: [16, 24],
    humidity: [48, 65],
    ph: [6.2, 7.2],
    precipitation: [3, 6],
    nutrients: { n: 42, p: 21, k: 28 },
    yieldBounds: [2.9, 5.6],
    irrigationBoost: 1,
    cropPriceKztPerTon: 95000
  },
  Barley: {
    moisture: [24, 32],
    temperature: [15, 23],
    humidity: [46, 63],
    ph: [6.1, 7.1],
    precipitation: [3, 5],
    nutrients: { n: 38, p: 18, k: 24 },
    yieldBounds: [2.6, 4.8],
    irrigationBoost: 0.95,
    cropPriceKztPerTon: 82000
  },
  Sunflower: {
    moisture: [22, 30],
    temperature: [18, 26],
    humidity: [42, 58],
    ph: [6.0, 7.1],
    precipitation: [2.5, 5],
    nutrients: { n: 34, p: 20, k: 26 },
    yieldBounds: [2.3, 4.3],
    irrigationBoost: 1.05,
    cropPriceKztPerTon: 180000
  },
  Potato: {
    moisture: [28, 38],
    temperature: [14, 22],
    humidity: [55, 75],
    ph: [5.4, 6.5],
    precipitation: [4.5, 8],
    nutrients: { n: 48, p: 26, k: 36 },
    yieldBounds: [16, 31],
    irrigationBoost: 1.35,
    cropPriceKztPerTon: 65000
  }
};

const irrigationReliefByMode: Record<IrrigationMode, number> = {
  none: 0,
  standard: 4,
  smart: 9
};

const factorLabels: Record<StressKey, string> = {
  soilMoisture: "Soil moisture",
  airTemperature: "Air temperature",
  airHumidity: "Air humidity",
  precipitation: "Rainfall reserve",
  soilPh: "Soil pH",
  nitrogen: "Nitrogen balance",
  phosphorus: "Phosphorus balance",
  potassium: "Potassium balance"
};

const presetMutators: Record<
  string,
  (field: Field, baseInput: ScenarioInput) => Partial<ScenarioInput>
> = {
  drought: (field) => ({
    soilMoisture: clamp(field.soilMoisture - 8, 10, 45),
    airTemperature: clamp(field.airTemperature + 4.5, 8, 40),
    airHumidity: clamp(field.airHumidity - 10, 20, 90),
    precipitation: clamp(field.precipitation - 2.2, 0, 15),
    irrigationMode: "none"
  }),
  heatStress: (field) => ({
    soilMoisture: clamp(field.soilMoisture - 4, 10, 45),
    airTemperature: clamp(field.airTemperature + 7, 8, 40),
    airHumidity: clamp(field.airHumidity - 8, 20, 90)
  }),
  afterRainfall: (field) => ({
    soilMoisture: clamp(field.soilMoisture + 5.5, 10, 45),
    airHumidity: clamp(field.airHumidity + 6, 20, 90),
    precipitation: clamp(field.precipitation + 4.5, 0, 15)
  }),
  lowNitrogen: (field) => ({
    nutrients: {
      ...field.nutrients,
      n: clamp(field.nutrients.n - 12, 10, 65)
    }
  }),
  smartIrrigation: (_field, baseInput) => ({
    irrigationMode: "smart"
  }),
  fertigationBoost: (_field, baseInput) => ({
    nutrients: {
      ...baseInput.nutrients,
      n: clamp(baseInput.nutrients.n + 8, 10, 65),
      p: clamp(baseInput.nutrients.p + 5, 8, 40),
      k: clamp(baseInput.nutrients.k + 4, 10, 45)
    }
  }),
  fullResponsePlan: (_field, baseInput) => ({
    irrigationMode: "smart",
    nutrients: {
      ...baseInput.nutrients,
      n: clamp(baseInput.nutrients.n + 8, 10, 65),
      p: clamp(baseInput.nutrients.p + 5, 8, 40),
      k: clamp(baseInput.nutrients.k + 4, 10, 45)
    }
  })
};

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: "drought",
    label: "Drought",
    description: "Reduces moisture and rainfall while raising temperature stress.",
    category: "observed"
  },
  {
    id: "heatStress",
    label: "Heat stress",
    description: "Pushes the microclimate into a hotter and drier regime.",
    category: "observed"
  },
  {
    id: "afterRainfall",
    label: "After rainfall",
    description: "Adds rain reserve and lifts soil moisture across the contour.",
    category: "observed"
  },
  {
    id: "lowNitrogen",
    label: "Low nitrogen",
    description: "Simulates nutrient depletion while keeping weather unchanged.",
    category: "observed"
  },
  {
    id: "smartIrrigation",
    label: "Smart irrigation",
    description: "Switches the field to adaptive irrigation mode. Only a controllable lever is changed.",
    category: "action"
  },
  {
    id: "fertigationBoost",
    label: "Fertigation boost",
    description: "Applies a targeted N/P/K correction through the irrigation program.",
    category: "action"
  },
  {
    id: "fullResponsePlan",
    label: "Full response plan",
    description: "Combines smart irrigation with a corrective nutrient package.",
    category: "action"
  }
];

export function createScenarioInput(field: Field): ScenarioInput {
  return {
    fieldId: field.id,
    soilMoisture: field.soilMoisture,
    airTemperature: field.airTemperature,
    airHumidity: field.airHumidity,
    precipitation: field.precipitation,
    soilPh: field.soilPh,
    nutrients: { ...field.nutrients },
    irrigationMode: field.irrigationMode
  };
}

export function applyScenarioPreset(
  field: Field,
  currentInput: ScenarioInput | undefined,
  presetId: string
): ScenarioInput {
  const preset = scenarioPresets.find((item) => item.id === presetId);
  const baseInput =
    preset?.category === "action" && currentInput
      ? currentInput
      : createScenarioInput(field);
  const mutator = presetMutators[presetId];

  if (!mutator) {
    return baseInput;
  }

  const patch = mutator(field, baseInput);

  return {
    ...baseInput,
    ...patch,
    nutrients: {
      ...baseInput.nutrients,
      ...(patch.nutrients ?? {})
    }
  };
}

export function getOptimalCareRecommendation(
  field: Field,
  baseInput: ScenarioInput
): OptimalCareRecommendation {
  const profile = getCropProfile(field.crop);
  const baselineResult = computeScenarioResult(field, baseInput);
  const irrigationOptions = getIrrigationCandidates(baseInput.irrigationMode);
  const nutrientLevels = [0, 0.45, 0.75, 1];
  const candidates = nutrientLevels.flatMap((ratio) =>
    irrigationOptions.map((irrigationMode) => {
      const candidateInput = applyTargetedCare(field, baseInput, profile, {
        irrigationMode,
        nutrientRatio: ratio
      });
      const result = computeScenarioResult(field, candidateInput);

      return {
        input: candidateInput,
        result,
        nutrientRatio: ratio,
        irrigationMode
      };
    })
  );

  const bestCandidate = [...candidates].sort((left, right) =>
    compareCandidatePlans(
      baselineResult,
      left.result,
      right.result,
      left.nutrientRatio,
      right.nutrientRatio
    )
  )[0];

  return {
    input: bestCandidate.input,
    title: buildOptimalPlanTitle(baseInput, bestCandidate.input),
    rationale: buildOptimalPlanRationale(
      baselineResult,
      bestCandidate.result,
      baseInput,
      bestCandidate.input
    ),
    score: scoreCandidatePlan(
      baselineResult,
      bestCandidate.result,
      bestCandidate.nutrientRatio
    ),
    result: bestCandidate.result
  };
}

export function computeScenarioResult(
  field: Field,
  input: ScenarioInput
): ScenarioResult {
  const profile = getCropProfile(field.crop);
  const baselineInput = createScenarioInput(field);
  const baseline = evaluateStress(baselineInput, profile);
  const current = evaluateStress(input, profile);
  const stressDelta = current.total - baseline.total;
  const baselineWaterNeedMm = getWaterNeed(field, baselineInput, profile);
  const waterNeedMm = getWaterNeed(field, input, profile);
  const riskIndex = clamp(Math.round(field.riskIndex + stressDelta), 5, 99);
  const yieldSensitivity = Math.max(field.yieldForecast * 0.012, 0.05);
  const yieldForecast = clamp(
    roundToTenth(field.yieldForecast - stressDelta * yieldSensitivity),
    profile.yieldBounds[0],
    profile.yieldBounds[1]
  );
  const status = getStatusFromRisk(riskIndex);
  const dominantKey = getDominantStressKey(current);
  const recommendation = buildRecommendation(
    dominantKey,
    riskIndex,
    waterNeedMm,
    input
  );
  const modelSummary = buildModelSummary(
    field,
    input,
    dominantKey,
    riskIndex,
    yieldForecast,
    waterNeedMm
  );
  const factors = buildScenarioFactors(field, input, baseline, current);
  const timeline = buildAdjustedTimeline(field, input, yieldForecast, profile);
  const economicEffect = buildEconomicEffect(
    field,
    profile,
    baselineInput,
    input,
    field.yieldForecast,
    yieldForecast,
    baselineWaterNeedMm,
    waterNeedMm,
    field.riskIndex,
    riskIndex
  );

  return {
    field: {
      ...field,
      status,
      soilMoisture: input.soilMoisture,
      airTemperature: input.airTemperature,
      airHumidity: input.airHumidity,
      precipitation: input.precipitation,
      soilPh: input.soilPh,
      nutrients: { ...input.nutrients },
      irrigationMode: input.irrigationMode,
      irrigationWindow: getIrrigationWindow(waterNeedMm),
      riskIndex,
      yieldForecast,
      recommendation,
      modelSummary,
      timeline
    },
    baselineRisk: field.riskIndex,
    baselineYield: field.yieldForecast,
    baselineWaterNeedMm,
    waterNeedMm,
    factors,
    economicEffect
  };
}

function getCropProfile(crop: string) {
  return cropProfiles[crop] ?? cropProfiles.Wheat;
}

function applyTargetedCare(
  field: Field,
  baseInput: ScenarioInput,
  profile: CropProfile,
  plan: {
    irrigationMode: IrrigationMode;
    nutrientRatio: number;
  }
) {
  const nitrogenGap = Math.max(0, profile.nutrients.n - baseInput.nutrients.n);
  const phosphorusGap = Math.max(0, profile.nutrients.p - baseInput.nutrients.p);
  const potassiumGap = Math.max(0, profile.nutrients.k - baseInput.nutrients.k);

  return {
    ...baseInput,
    irrigationMode: plan.irrigationMode,
    nutrients: {
      n: clamp(
        baseInput.nutrients.n + roundToInt(Math.min(nitrogenGap * plan.nutrientRatio, 14)),
        10,
        65
      ),
      p: clamp(
        baseInput.nutrients.p + roundToInt(Math.min(phosphorusGap * plan.nutrientRatio, 8)),
        8,
        40
      ),
      k: clamp(
        baseInput.nutrients.k + roundToInt(Math.min(potassiumGap * plan.nutrientRatio, 10)),
        10,
        45
      )
    }
  };
}

function evaluateStress(
  input: ScenarioInput,
  profile: CropProfile
): StressBreakdown {
  const moistureDeficit = rangeDeviation(input.soilMoisture, profile.moisture) * 22;
  const temperatureStress =
    rangeDeviation(input.airTemperature, profile.temperature) * 14;
  const humidityStress = rangeDeviation(input.airHumidity, profile.humidity) * 8;
  const precipitationStress =
    rangeDeviation(input.precipitation, profile.precipitation) * 7;
  const phStress = rangeDeviation(input.soilPh, profile.ph) * 10;
  const nitrogenStress =
    nutrientDeviation(input.nutrients.n, profile.nutrients.n) * 10;
  const phosphorusStress =
    nutrientDeviation(input.nutrients.p, profile.nutrients.p) * 8;
  const potassiumStress =
    nutrientDeviation(input.nutrients.k, profile.nutrients.k) * 8;
  const moistureGap = Math.max(0, getRangeMidpoint(profile.moisture) - input.soilMoisture);
  const irrigationRelief =
    irrigationReliefByMode[input.irrigationMode] *
    (1 + moistureGap / 20) *
    profile.irrigationBoost;
  const total = clamp(
    moistureDeficit +
      temperatureStress +
      humidityStress +
      precipitationStress +
      phStress +
      nitrogenStress +
      phosphorusStress +
      potassiumStress -
      irrigationRelief,
    0,
    95
  );

  return {
    soilMoisture: moistureDeficit,
    airTemperature: temperatureStress,
    airHumidity: humidityStress,
    precipitation: precipitationStress,
    soilPh: phStress,
    nitrogen: nitrogenStress,
    phosphorus: phosphorusStress,
    potassium: potassiumStress,
    total,
    irrigationRelief
  };
}

function getIrrigationCandidates(currentMode: IrrigationMode) {
  if (currentMode === "smart") {
    return ["smart"] as IrrigationMode[];
  }

  if (currentMode === "standard") {
    return ["standard", "smart"] as IrrigationMode[];
  }

  return ["none", "standard", "smart"] as IrrigationMode[];
}

function compareCandidatePlans(
  baselineResult: ScenarioResult,
  left: ScenarioResult,
  right: ScenarioResult,
  leftNutrientRatio: number,
  rightNutrientRatio: number
) {
  const baselineRisk = baselineResult.field.riskIndex;

  if (baselineRisk >= 75) {
    if (left.field.riskIndex !== right.field.riskIndex) {
      return left.field.riskIndex - right.field.riskIndex;
    }

    if (left.economicEffect.netEffectKzt !== right.economicEffect.netEffectKzt) {
      return right.economicEffect.netEffectKzt - left.economicEffect.netEffectKzt;
    }
  }

  const leftScore = scoreCandidatePlan(baselineResult, left, leftNutrientRatio);
  const rightScore = scoreCandidatePlan(baselineResult, right, rightNutrientRatio);

  return rightScore - leftScore;
}

function scoreCandidatePlan(
  baselineResult: ScenarioResult,
  candidate: ScenarioResult,
  nutrientRatio: number
) {
  const riskReduction =
    baselineResult.field.riskIndex - candidate.field.riskIndex;
  const waterImprovement =
    baselineResult.waterNeedMm - candidate.waterNeedMm;
  const yieldGain =
    candidate.field.yieldForecast - baselineResult.field.yieldForecast;

  return (
    candidate.economicEffect.netEffectKzt +
    riskReduction * 32000 +
    waterImprovement * 12000 +
    yieldGain * 180000 -
    nutrientRatio * 20000
  );
}

function buildOptimalPlanTitle(
  before: ScenarioInput,
  after: ScenarioInput
) {
  const irrigationChanged = before.irrigationMode !== after.irrigationMode;
  const nutritionChanged =
    before.nutrients.n !== after.nutrients.n ||
    before.nutrients.p !== after.nutrients.p ||
    before.nutrients.k !== after.nutrients.k;

  if (irrigationChanged && nutritionChanged) {
    return "Optimal care: adaptive irrigation + targeted fertigation";
  }

  if (irrigationChanged) {
    return "Optimal care: adaptive irrigation upgrade";
  }

  if (nutritionChanged) {
    return "Optimal care: targeted nutrient correction";
  }

  return "Optimal care: keep the current operating mode";
}

function buildOptimalPlanRationale(
  baseline: ScenarioResult,
  candidate: ScenarioResult,
  before: ScenarioInput,
  after: ScenarioInput
) {
  const irrigationChanged = before.irrigationMode !== after.irrigationMode;
  const nutritionChanged =
    before.nutrients.n !== after.nutrients.n ||
    before.nutrients.p !== after.nutrients.p ||
    before.nutrients.k !== after.nutrients.k;
  const riskReduction = baseline.field.riskIndex - candidate.field.riskIndex;
  const waterReduction = baseline.waterNeedMm - candidate.waterNeedMm;
  const netEffect = candidate.economicEffect.netEffectKzt;

  if (!irrigationChanged && !nutritionChanged) {
    return "The current field setup is already the most reasonable economic option. Additional intervention would not improve the balance enough to justify the cost.";
  }

  const actionBits = [
    irrigationChanged ? `irrigation is upgraded to ${after.irrigationMode}` : null,
    nutritionChanged ? "nutrition is corrected only where the crop profile shows a deficit" : null
  ]
    .filter(Boolean)
    .join(", ");

  return `The decision engine recommends this plan because ${actionBits}. It is the strongest realistic response for the current field state, reducing risk by ${riskReduction.toFixed(0)} points and water need by ${waterReduction.toFixed(1)} mm while keeping the estimated net effect at ${formatSignedKzt(netEffect)}.`;
}

function buildEconomicEffect(
  field: Field,
  profile: CropProfile,
  baselineInput: ScenarioInput,
  input: ScenarioInput,
  baselineYield: number,
  currentYield: number,
  baselineWaterNeedMm: number,
  currentWaterNeedMm: number,
  baselineRisk: number,
  currentRisk: number
): EconomicEffect {
  const yieldDeltaTons = roundTo1((currentYield - baselineYield) * field.areaHa);
  const revenueDeltaKzt = Math.round(yieldDeltaTons * profile.cropPriceKztPerTon);
  const irrigationVolumeDeltaM3 = Math.round(
    (currentWaterNeedMm - baselineWaterNeedMm) * field.areaHa * 10
  );
  const irrigationCostDeltaKzt = Math.round(irrigationVolumeDeltaM3 * 4.5);
  const fuelDeltaLiters = roundTo1(irrigationVolumeDeltaM3 * 0.0018);
  const nutrientAdjustmentCostKzt = Math.round(
    Math.max(0, input.nutrients.n - baselineInput.nutrients.n) * field.areaHa * 42 +
      Math.max(0, input.nutrients.p - baselineInput.nutrients.p) * field.areaHa * 51 +
      Math.max(0, input.nutrients.k - baselineInput.nutrients.k) * field.areaHa * 36
  );
  const avoidedLossKzt = Math.round(
    Math.max(0, baselineRisk - currentRisk) *
      field.areaHa *
      (profile.cropPriceKztPerTon / 100) *
      0.4
  );
  const netEffectKzt =
    revenueDeltaKzt +
    avoidedLossKzt -
    irrigationCostDeltaKzt -
    nutrientAdjustmentCostKzt;

  return {
    expectedYieldDeltaTons: yieldDeltaTons,
    expectedRevenueDeltaKzt: revenueDeltaKzt,
    irrigationVolumeDeltaM3,
    irrigationCostDeltaKzt,
    fuelDeltaLiters,
    nutrientAdjustmentCostKzt,
    avoidedLossKzt,
    netEffectKzt
  };
}

function rangeDeviation(value: number, range: Range) {
  const [min, max] = range;
  const width = Math.max(max - min, 1);

  if (value < min) {
    return (min - value) / width;
  }

  if (value > max) {
    return (value - max) / width;
  }

  return 0;
}

function nutrientDeviation(value: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  if (value < target) {
    return (target - value) / target;
  }

  return ((value - target) / target) * 0.45;
}

function getWaterNeed(field: Field, input: ScenarioInput, profile: CropProfile) {
  const targetMoisture = getRangeMidpoint(profile.moisture);
  const targetRain = getRangeMidpoint(profile.precipitation);
  const moistureGap = Math.max(0, targetMoisture - input.soilMoisture);
  const rainfallGap = Math.max(0, targetRain - input.precipitation);
  const heatPenalty = Math.max(0, input.airTemperature - profile.temperature[1]) * 0.65;
  const relief = irrigationReliefByMode[input.irrigationMode] * 0.55;
  const waterNeed =
    moistureGap * 1.2 + rainfallGap * 1.1 + field.evapotranspiration + heatPenalty - relief;

  return roundToTenth(clamp(waterNeed, 0, 32));
}

function getIrrigationWindow(waterNeedMm: number) {
  if (waterNeedMm < 2) {
    return "No irrigation required";
  }

  if (waterNeedMm < 7) {
    return "Observe next 24 hours";
  }

  if (waterNeedMm < 12) {
    return "Next 12 hours";
  }

  if (waterNeedMm < 18) {
    return "Within 6 hours";
  }

  return "Immediate action required";
}

function getStatusFromRisk(riskIndex: number): FieldStatus {
  if (riskIndex >= 75) {
    return "critical";
  }

  if (riskIndex >= 55) {
    return "risk";
  }

  if (riskIndex >= 35) {
    return "attention";
  }

  return "healthy";
}

function getDominantStressKey(stress: StressBreakdown): StressKey {
  const keys: StressKey[] = [
    "soilMoisture",
    "airTemperature",
    "airHumidity",
    "precipitation",
    "soilPh",
    "nitrogen",
    "phosphorus",
    "potassium"
  ];

  return [...keys].sort((left, right) => stress[right] - stress[left])[0];
}

function buildRecommendation(
  dominantKey: StressKey,
  riskIndex: number,
  waterNeedMm: number,
  input: ScenarioInput
) {
  if (riskIndex < 35) {
    return "Soil moisture is sufficient, no action required";
  }

  if (dominantKey === "soilMoisture" || waterNeedMm >= 10) {
    if (waterNeedMm >= 18) {
      return "Immediate irrigation required";
    }

    if (input.irrigationMode === "smart") {
      return "Smart irrigation should be intensified in the next 12 hours";
    }

    return "Increase irrigation in the next 12 hours";
  }

  if (dominantKey === "airTemperature") {
    return "Check field section for overheating stress";
  }

  if (dominantKey === "soilPh") {
    return "Correct soil pH before the next field operation";
  }

  if (
    dominantKey === "nitrogen" ||
    dominantKey === "phosphorus" ||
    dominantKey === "potassium"
  ) {
    return "Recommended fertilizer adjustment";
  }

  if (dominantKey === "precipitation") {
    return "Rainfall deficit is increasing irrigation urgency";
  }

  return "Review field conditions before the next operation window";
}

function buildModelSummary(
  field: Field,
  input: ScenarioInput,
  dominantKey: StressKey,
  riskIndex: number,
  yieldForecast: number,
  waterNeedMm: number
) {
  const statusText =
    riskIndex >= 75
      ? "critical"
      : riskIndex >= 55
        ? "elevated"
        : riskIndex >= 35
          ? "moderate"
          : "low";
  const factorText = factorLabels[dominantKey].toLowerCase();
  const irrigationText =
    input.irrigationMode === "smart"
      ? "Smart irrigation is partially compensating the stress load."
      : input.irrigationMode === "standard"
        ? "Standard irrigation support is active, but its effect is limited."
        : "No irrigation compensation is currently applied.";

  return `${field.name} now shows ${statusText} scenario risk, driven primarily by ${factorText}. ${irrigationText} Expected yield is ${yieldForecast.toFixed(1)} t/ha with an estimated water need of ${waterNeedMm.toFixed(1)} mm.`;
}

function buildScenarioFactors(
  field: Field,
  input: ScenarioInput,
  baseline: StressBreakdown,
  current: StressBreakdown
) {
  const deltas: Array<{ key: StressKey; delta: number }> = (
    [
      "soilMoisture",
      "airTemperature",
      "airHumidity",
      "precipitation",
      "soilPh",
      "nitrogen",
      "phosphorus",
      "potassium"
    ] as StressKey[]
  ).map((key) => ({
    key,
    delta: current[key] - baseline[key]
  }));

  const factors: ScenarioFactor[] = [];

  if (input.irrigationMode !== field.irrigationMode) {
    const smarter =
      irrigationReliefByMode[input.irrigationMode] >
      irrigationReliefByMode[field.irrigationMode];

    factors.push({
      key: "irrigationMode",
      label: "Irrigation mode",
      impact: smarter ? "positive" : "negative",
      message: smarter
        ? "A more adaptive irrigation mode reduces expected stress on the parcel."
        : "A less intensive irrigation mode removes part of the moisture protection."
    });
  }

  deltas
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 4)
    .forEach(({ key, delta }) => {
      factors.push({
        key,
        label: factorLabels[key],
        impact: delta > 1.2 ? "negative" : delta < -1.2 ? "positive" : "neutral",
        message: getFactorMessage(key, delta)
      });
    });

  if (!factors.length) {
    factors.push({
      key: "baseline",
      label: "Telemetry baseline",
      impact: "neutral",
      message: "Scenario inputs match the live telemetry baseline for this field."
    });
  }

  return factors.slice(0, 5);
}

function getFactorMessage(key: StressKey, delta: number) {
  if (delta > 1.2) {
    switch (key) {
      case "soilMoisture":
        return "Soil moisture moved below the optimal crop band and increased stress.";
      case "airTemperature":
        return "Heat load increased and pushed the field closer to a stress response.";
      case "airHumidity":
        return "Air humidity drifted away from the target band and weakened the microclimate.";
      case "precipitation":
        return "Lower rainfall reserve reduced the moisture buffer for the next cycle.";
      case "soilPh":
        return "Soil pH moved away from the agronomic optimum.";
      case "nitrogen":
        return "Nitrogen balance deteriorated and may reduce vegetative growth.";
      case "phosphorus":
        return "Phosphorus availability declined and may slow crop development.";
      case "potassium":
        return "Potassium deficit deepened and may reduce stress tolerance.";
    }
  }

  if (delta < -1.2) {
    switch (key) {
      case "soilMoisture":
        return "Soil moisture moved closer to the optimal crop band.";
      case "airTemperature":
        return "Temperature returned closer to the target range for this crop.";
      case "airHumidity":
        return "Air humidity is now better aligned with the target range.";
      case "precipitation":
        return "Improved rainfall reserve supports the field water balance.";
      case "soilPh":
        return "Soil pH is closer to the agronomic optimum.";
      case "nitrogen":
        return "Nitrogen balance improved and supports stronger crop growth.";
      case "phosphorus":
        return "Phosphorus balance improved and supports reproductive development.";
      case "potassium":
        return "Potassium balance improved and supports better stress resistance.";
    }
  }

  return "This factor remains close to the live telemetry baseline.";
}

function buildAdjustedTimeline(
  field: Field,
  input: ScenarioInput,
  yieldForecast: number,
  profile: CropProfile
) {
  const moistureDelta = input.soilMoisture - field.soilMoisture;
  const temperatureDelta = input.airTemperature - field.airTemperature;
  const humidityDelta = input.airHumidity - field.airHumidity;
  const precipitationDelta = input.precipitation - field.precipitation;
  const yieldDelta = yieldForecast - field.yieldForecast;

  return field.timeline.map((point, index, timeline) => {
    const ratio = (index + 1) / timeline.length;

    return {
      ...point,
      soilMoisture: roundToTenth(
        clamp(point.soilMoisture + moistureDelta * ratio, 0, 100)
      ),
      airTemperature: roundToTenth(
        clamp(point.airTemperature + temperatureDelta * ratio, -20, 60)
      ),
      airHumidity: roundToTenth(
        clamp(point.airHumidity + humidityDelta * ratio, 0, 100)
      ),
      precipitation: roundToTenth(
        clamp(point.precipitation + precipitationDelta * ratio, 0, 40)
      ),
      yieldPotential: roundToTenth(
        clamp(
          point.yieldPotential + yieldDelta * ratio,
          profile.yieldBounds[0],
          profile.yieldBounds[1]
        )
      )
    };
  });
}

function getRangeMidpoint(range: Range) {
  return (range[0] + range[1]) / 2;
}

function roundTo1(value: number) {
  return Math.round(value * 10) / 10;
}

function roundToInt(value: number) {
  return Math.round(value);
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}

function formatSignedKzt(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")} KZT`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
