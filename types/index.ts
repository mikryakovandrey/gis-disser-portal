export type FieldStatus = "healthy" | "attention" | "risk" | "critical";
export type IrrigationMode = "none" | "standard" | "smart";
export type TelemetryQuality = "verified" | "estimated" | "warning";
export type TrackPointState = "work" | "turn" | "idle";
export type EventSeverity = "info" | "warning" | "critical";
export type UserRole = "user" | "admin";

export type TelemetryPacket = {
  id: string;
  source: string;
  metric: string;
  value: number | string;
  unit: string;
  timestamp: string;
  quality: TelemetryQuality;
  note: string;
};

export type OperationTrackPoint = {
  id: string;
  time: string;
  lat: number;
  lng: number;
  speed: number;
  workState: TrackPointState;
  areaDoneHa: number;
  fuelLevelLiters: number;
};

export type OperationEvent = {
  id: string;
  time: string;
  type: string;
  severity: EventSeverity;
  description: string;
};

export type OperationReplay = {
  operationName: string;
  machineName: string;
  operator: string;
  plannedAreaHa: number;
  actualAreaHa: number;
  plannedDurationHours: number;
  actualDurationHours: number;
  overlapPercent: number;
  skipPercent: number;
  fuelNormLiters: number;
  fuelUsedLiters: number;
  materialRatePlan: number;
  materialRateFact: number;
  track: OperationTrackPoint[];
  events: OperationEvent[];
};

export type Field = {
  id: string;
  name: string;
  locationLabel: string;
  areaHa: number;
  crop: string;
  growthStage: string;
  status: FieldStatus;
  centroid: {
    lat: number;
    lng: number;
  };
  boundary: [number, number][];
  soilMoisture: number;
  airTemperature: number;
  airHumidity: number;
  soilPh: number;
  nutrients: {
    n: number;
    p: number;
    k: number;
  };
  precipitation: number;
  yieldForecast: number;
  riskIndex: number;
  sensorCount: number;
  activeSensors: number;
  ndvi: number;
  evapotranspiration: number;
  irrigationMode: IrrigationMode;
  irrigationWindow: string;
  updatedAt: string;
  recommendation: string;
  modelSummary: string;
  telemetryPackets: TelemetryPacket[];
  operationReplay: OperationReplay;
  timeline: Array<{
    label: string;
    soilMoisture: number;
    airTemperature: number;
    airHumidity: number;
    precipitation: number;
    yieldPotential: number;
  }>;
};

export type ScenarioInput = {
  fieldId: string;
  soilMoisture: number;
  airTemperature: number;
  airHumidity: number;
  precipitation: number;
  soilPh: number;
  nutrients: {
    n: number;
    p: number;
    k: number;
  };
  irrigationMode: IrrigationMode;
};

export type ScenarioPresetCategory = "observed" | "action";

export type ScenarioFactorImpact = "positive" | "negative" | "neutral";

export type ScenarioFactor = {
  key: string;
  label: string;
  impact: ScenarioFactorImpact;
  message: string;
};

export type ScenarioPreset = {
  id: string;
  label: string;
  description: string;
  category: ScenarioPresetCategory;
};

export type EconomicEffect = {
  expectedYieldDeltaTons: number;
  expectedRevenueDeltaKzt: number;
  irrigationVolumeDeltaM3: number;
  irrigationCostDeltaKzt: number;
  fuelDeltaLiters: number;
  nutrientAdjustmentCostKzt: number;
  avoidedLossKzt: number;
  netEffectKzt: number;
};

export type ScenarioResult = {
  field: Field;
  baselineRisk: number;
  baselineYield: number;
  baselineWaterNeedMm: number;
  waterNeedMm: number;
  factors: ScenarioFactor[];
  economicEffect: EconomicEffect;
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
};

export type PublicDemoUser = Omit<DemoUser, "password">;

export type FieldOverride = {
  fieldId: string;
  status?: FieldStatus;
  recommendation?: string;
  irrigationMode?: IrrigationMode;
  irrigationWindow?: string;
  riskIndex?: number;
  yieldForecast?: number;
  soilMoisture?: number;
  airTemperature?: number;
  airHumidity?: number;
  soilPh?: number;
  precipitation?: number;
  nutrients?: {
    n: number;
    p: number;
    k: number;
  };
  updatedAt?: string;
  lastEditedBy?: string;
};

export type DemoDatabase = {
  users: DemoUser[];
  fieldOverrides: FieldOverride[];
};
