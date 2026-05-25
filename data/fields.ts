import {
  Field,
  OperationReplay,
  TelemetryPacket
} from "@/types";

type TimelinePoint = Field["timeline"][number];

type OperationSeed = {
  operationName: string;
  machineName: string;
  operator: string;
  startTime: string;
  plannedDurationHours: number;
  actualDurationHours: number;
  plannedAreaHa: number;
  actualAreaHa: number;
  overlapPercent: number;
  skipPercent: number;
  fuelNormLiters: number;
  fuelUsedLiters: number;
  materialRatePlan: number;
  materialRateFact: number;
  events: Array<{
    index: number;
    type: string;
    severity: OperationReplay["events"][number]["severity"];
    description: string;
  }>;
};

type FieldSeed = Omit<Field, "telemetryPackets" | "operationReplay"> & {
  operationSeed: OperationSeed;
};

export const fields: Field[] = [
  createField({
    id: "field-yerasyl-north",
    name: "Yerasyl North 01",
    locationLabel: "Pavlodar Region, Irtysh district, KH Yerasyl pilot zone",
    areaHa: 52.4,
    crop: "Wheat",
    growthStage: "Tillering",
    status: "healthy",
    centroid: { lat: 53.4333, lng: 75.2824 },
    boundary: [
      [53.4368, 75.2731],
      [53.4389, 75.2874],
      [53.4297, 75.2918],
      [53.4278, 75.2772]
    ],
    soilMoisture: 31.6,
    airTemperature: 20.7,
    airHumidity: 57,
    soilPh: 6.7,
    nutrients: { n: 43, p: 22, k: 29 },
    precipitation: 4.6,
    yieldForecast: 3.9,
    riskIndex: 29,
    sensorCount: 9,
    activeSensors: 9,
    ndvi: 0.74,
    evapotranspiration: 3.3,
    irrigationMode: "standard",
    irrigationWindow: "No irrigation required",
    updatedAt: "09:20",
    recommendation: "Soil moisture is sufficient, no action required",
    modelSummary:
      "The pilot field in Pavlodar remains within the target wheat band. Current telemetry suggests stable moisture reserve, moderate temperature load, and low short-term stress probability.",
    timeline: [
      point("06:00", 30.9, 16.8, 61, 0.4, 3.8),
      point("09:00", 31.2, 18.1, 60, 0.6, 3.8),
      point("12:00", 31.1, 19.6, 58, 0.5, 3.9),
      point("15:00", 31.0, 21.0, 56, 0.9, 3.9),
      point("18:00", 31.4, 21.4, 56, 1.0, 3.9),
      point("21:00", 31.6, 20.7, 57, 1.2, 3.9)
    ],
    operationSeed: {
      operationName: "Variable-rate seeding",
      machineName: "Belarus MTZ 82.1",
      operator: "A. Sarsembayev",
      startTime: "08:10",
      plannedDurationHours: 4.9,
      actualDurationHours: 5.1,
      plannedAreaHa: 52.4,
      actualAreaHa: 51.8,
      overlapPercent: 1.7,
      skipPercent: 0.6,
      fuelNormLiters: 63,
      fuelUsedLiters: 65,
      materialRatePlan: 182,
      materialRateFact: 179,
      events: [
        {
          index: 4,
          type: "Pass alignment",
          severity: "info",
          description: "Autosteer correction applied after minor drift on the eastern edge."
        },
        {
          index: 10,
          type: "Short stop",
          severity: "warning",
          description: "Short idle period while checking seed flow stability."
        }
      ]
    }
  }),
  createField({
    id: "field-irtysh-south",
    name: "Irtysh South 03",
    locationLabel: "Pavlodar Region, Irtysh district, southern pilot contour",
    areaHa: 64.8,
    crop: "Sunflower",
    growthStage: "Bud formation",
    status: "attention",
    centroid: { lat: 53.4264, lng: 75.3001 },
    boundary: [
      [53.4306, 75.2898],
      [53.4321, 75.3051],
      [53.4225, 75.3099],
      [53.4203, 75.2952]
    ],
    soilMoisture: 24.6,
    airTemperature: 24.1,
    airHumidity: 47,
    soilPh: 6.2,
    nutrients: { n: 31, p: 18, k: 22 },
    precipitation: 2.3,
    yieldForecast: 3.0,
    riskIndex: 46,
    sensorCount: 10,
    activeSensors: 9,
    ndvi: 0.67,
    evapotranspiration: 4.6,
    irrigationMode: "none",
    irrigationWindow: "Next 12 hours",
    updatedAt: "09:24",
    recommendation: "Increase irrigation in the next 12 hours",
    modelSummary:
      "The sunflower parcel is moving toward the lower moisture threshold. If rainfall remains limited, the model expects reduced biomass accumulation and a weaker seed filling trajectory.",
    timeline: [
      point("06:00", 26.8, 18.9, 55, 0.1, 3.2),
      point("09:00", 25.9, 20.7, 52, 0.1, 3.1),
      point("12:00", 25.3, 22.5, 50, 0.2, 3.1),
      point("15:00", 24.9, 24.0, 48, 0.4, 3.0),
      point("18:00", 24.5, 24.6, 47, 0.7, 3.0),
      point("21:00", 24.6, 24.1, 47, 0.8, 3.0)
    ],
    operationSeed: {
      operationName: "Targeted fertilization",
      machineName: "Case IH Puma 210",
      operator: "S. Tulegenov",
      startTime: "08:20",
      plannedDurationHours: 5.6,
      actualDurationHours: 6.0,
      plannedAreaHa: 64.8,
      actualAreaHa: 63.4,
      overlapPercent: 2.3,
      skipPercent: 1.0,
      fuelNormLiters: 79,
      fuelUsedLiters: 84,
      materialRatePlan: 128,
      materialRateFact: 121,
      events: [
        {
          index: 3,
          type: "Low rain reserve",
          severity: "warning",
          description: "Operator lowered material rate on the drier southern edge."
        },
        {
          index: 11,
          type: "Turn overlap",
          severity: "warning",
          description: "Minor overlap detected near the south-east turn zone."
        }
      ]
    }
  }),
  createField({
    id: "field-steppe-barley",
    name: "Steppe Barley 07",
    locationLabel: "Pavlodar Region, Irtysh district, dry steppe contour",
    areaHa: 58.2,
    crop: "Barley",
    growthStage: "Stem elongation",
    status: "risk",
    centroid: { lat: 53.4168, lng: 75.281 },
    boundary: [
      [53.4204, 75.2714],
      [53.4226, 75.2861],
      [53.4132, 75.2903],
      [53.4108, 75.2762]
    ],
    soilMoisture: 20.1,
    airTemperature: 26.8,
    airHumidity: 41,
    soilPh: 5.9,
    nutrients: { n: 28, p: 16, k: 20 },
    precipitation: 0.8,
    yieldForecast: 3.3,
    riskIndex: 69,
    sensorCount: 8,
    activeSensors: 7,
    ndvi: 0.57,
    evapotranspiration: 5.4,
    irrigationMode: "none",
    irrigationWindow: "Within 6 hours",
    updatedAt: "09:28",
    recommendation: "Check field section for overheating stress",
    modelSummary:
      "The barley contour shows a combined moisture deficit and elevated heat load. Without correction, the next hot period may accelerate stress accumulation and reduce expected yield stability.",
    timeline: [
      point("06:00", 22.5, 20.9, 49, 0.0, 3.6),
      point("09:00", 21.7, 22.9, 46, 0.0, 3.5),
      point("12:00", 21.0, 24.8, 44, 0.0, 3.4),
      point("15:00", 20.5, 26.3, 42, 0.2, 3.4),
      point("18:00", 20.0, 27.1, 41, 0.2, 3.3),
      point("21:00", 20.1, 26.8, 41, 0.4, 3.3)
    ],
    operationSeed: {
      operationName: "Protective spraying",
      machineName: "John Deere 4730",
      operator: "E. Iskakov",
      startTime: "08:05",
      plannedDurationHours: 4.7,
      actualDurationHours: 5.5,
      plannedAreaHa: 58.2,
      actualAreaHa: 56.1,
      overlapPercent: 3.5,
      skipPercent: 1.4,
      fuelNormLiters: 68,
      fuelUsedLiters: 77,
      materialRatePlan: 94,
      materialRateFact: 89,
      events: [
        {
          index: 5,
          type: "Heat slowdown",
          severity: "critical",
          description: "Sprayer speed dropped after the canopy temperature crossed the risk threshold."
        },
        {
          index: 12,
          type: "Coverage gap",
          severity: "warning",
          description: "Skip detected along the western lane due to short GNSS interruption."
        }
      ]
    }
  }),
  createField({
    id: "field-pilot-wheat",
    name: "Pilot Wheat 11",
    locationLabel: "Pavlodar Region, Irtysh district, central pilot contour",
    areaHa: 47.9,
    crop: "Wheat",
    growthStage: "Booting",
    status: "attention",
    centroid: { lat: 53.4141, lng: 75.3117 },
    boundary: [
      [53.4178, 75.3027],
      [53.4197, 75.3164],
      [53.4105, 75.3203],
      [53.4083, 75.3072]
    ],
    soilMoisture: 27.2,
    airTemperature: 22.4,
    airHumidity: 52,
    soilPh: 6.4,
    nutrients: { n: 37, p: 19, k: 25 },
    precipitation: 2.8,
    yieldForecast: 4.1,
    riskIndex: 41,
    sensorCount: 9,
    activeSensors: 8,
    ndvi: 0.7,
    evapotranspiration: 4.0,
    irrigationMode: "standard",
    irrigationWindow: "Observe next 24 hours",
    updatedAt: "09:18",
    recommendation: "Recommended fertilizer adjustment",
    modelSummary:
      "The field remains operationally stable, but nitrogen and potassium are slightly below the target wheat profile. Short-term yield can be preserved if nutrition and moisture are corrected together.",
    timeline: [
      point("06:00", 28.2, 17.4, 59, 0.3, 4.2),
      point("09:00", 27.9, 19.1, 56, 0.4, 4.2),
      point("12:00", 27.7, 20.8, 54, 0.5, 4.1),
      point("15:00", 27.4, 22.2, 52, 0.6, 4.1),
      point("18:00", 27.1, 22.7, 51, 0.7, 4.1),
      point("21:00", 27.2, 22.4, 52, 0.8, 4.1)
    ],
    operationSeed: {
      operationName: "Nitrogen top-dressing",
      machineName: "New Holland T7.230",
      operator: "N. Omarov",
      startTime: "08:15",
      plannedDurationHours: 4.4,
      actualDurationHours: 4.6,
      plannedAreaHa: 47.9,
      actualAreaHa: 47.2,
      overlapPercent: 1.8,
      skipPercent: 0.8,
      fuelNormLiters: 52,
      fuelUsedLiters: 54,
      materialRatePlan: 116,
      materialRateFact: 111,
      events: [
        {
          index: 6,
          type: "Rate correction",
          severity: "info",
          description: "Variable-rate spreader reduced output after entering a stronger zone."
        },
        {
          index: 13,
          type: "Boundary warning",
          severity: "warning",
          description: "Machine approached the contour edge during the last turn."
        }
      ]
    }
  }),
  createField({
    id: "field-potato-demo",
    name: "Potato Demo 14",
    locationLabel: "Pavlodar Region, Irtysh district, irrigated demonstration parcel",
    areaHa: 73.6,
    crop: "Potato",
    growthStage: "Tuber initiation",
    status: "critical",
    centroid: { lat: 53.4408, lng: 75.3092 },
    boundary: [
      [53.4445, 75.2996],
      [53.4467, 75.3138],
      [53.4375, 75.3189],
      [53.4348, 75.3045]
    ],
    soilMoisture: 17.6,
    airTemperature: 28.7,
    airHumidity: 37,
    soilPh: 5.7,
    nutrients: { n: 26, p: 15, k: 19 },
    precipitation: 0.3,
    yieldForecast: 23.6,
    riskIndex: 81,
    sensorCount: 12,
    activeSensors: 11,
    ndvi: 0.51,
    evapotranspiration: 6.0,
    irrigationMode: "standard",
    irrigationWindow: "Immediate action required",
    updatedAt: "09:31",
    recommendation: "Possible nutrient deficiency detected",
    modelSummary:
      "This demonstration potato field is under simultaneous moisture, heat, and nutrient stress. It is the highest-priority intervention zone inside the current Pavlodar pilot group.",
    timeline: [
      point("06:00", 20.4, 22.7, 46, 0.0, 25.8),
      point("09:00", 19.4, 24.9, 43, 0.0, 25.1),
      point("12:00", 18.8, 26.9, 40, 0.0, 24.5),
      point("15:00", 18.1, 28.4, 38, 0.1, 24.0),
      point("18:00", 17.5, 29.2, 36, 0.1, 23.7),
      point("21:00", 17.6, 28.7, 37, 0.1, 23.6)
    ],
    operationSeed: {
      operationName: "Smart irrigation cycle",
      machineName: "UCT-W-4 irrigation node",
      operator: "M. Yermekova",
      startTime: "07:55",
      plannedDurationHours: 6.1,
      actualDurationHours: 6.8,
      plannedAreaHa: 73.6,
      actualAreaHa: 71.9,
      overlapPercent: 2.8,
      skipPercent: 1.6,
      fuelNormLiters: 43,
      fuelUsedLiters: 49,
      materialRatePlan: 22,
      materialRateFact: 19,
      events: [
        {
          index: 4,
          type: "Pressure drop",
          severity: "critical",
          description: "Irrigation pressure dropped and the northern pass received less water than planned."
        },
        {
          index: 12,
          type: "Recovery cycle",
          severity: "warning",
          description: "A recovery watering cycle was launched after the heat peak."
        }
      ]
    }
  }),
  createField({
    id: "field-riverside-sunflower",
    name: "Riverside Sunflower 18",
    locationLabel: "Pavlodar Region, Irtysh district, riverside contour",
    areaHa: 44.5,
    crop: "Sunflower",
    growthStage: "Flowering",
    status: "healthy",
    centroid: { lat: 53.4253, lng: 75.2652 },
    boundary: [
      [53.4288, 75.2563],
      [53.4307, 75.2702],
      [53.4219, 75.2739],
      [53.4198, 75.2602]
    ],
    soilMoisture: 29.4,
    airTemperature: 21.2,
    airHumidity: 54,
    soilPh: 6.6,
    nutrients: { n: 35, p: 21, k: 27 },
    precipitation: 4.8,
    yieldForecast: 3.5,
    riskIndex: 24,
    sensorCount: 8,
    activeSensors: 8,
    ndvi: 0.76,
    evapotranspiration: 3.1,
    irrigationMode: "smart",
    irrigationWindow: "No irrigation required",
    updatedAt: "09:16",
    recommendation: "Maintain current irrigation schedule",
    modelSummary:
      "The riverside contour combines favorable moisture with balanced nutrition. Smart irrigation is currently holding the field inside the optimal sunflower response zone.",
    timeline: [
      point("06:00", 28.5, 17.2, 60, 0.7, 3.4),
      point("09:00", 28.9, 18.8, 58, 0.8, 3.4),
      point("12:00", 29.1, 20.1, 56, 0.9, 3.5),
      point("15:00", 29.0, 21.4, 54, 0.8, 3.5),
      point("18:00", 29.2, 21.7, 53, 0.8, 3.5),
      point("21:00", 29.4, 21.2, 54, 0.8, 3.5)
    ],
    operationSeed: {
      operationName: "Plan/fact quality audit",
      machineName: "Trimble guidance rover",
      operator: "D. Aitbayev",
      startTime: "08:35",
      plannedDurationHours: 3.7,
      actualDurationHours: 3.6,
      plannedAreaHa: 44.5,
      actualAreaHa: 44.1,
      overlapPercent: 1.2,
      skipPercent: 0.4,
      fuelNormLiters: 34,
      fuelUsedLiters: 33,
      materialRatePlan: 108,
      materialRateFact: 109,
      events: [
        {
          index: 5,
          type: "Autopilot hold",
          severity: "info",
          description: "Guidance stayed within the optimal line corridor during the central passes."
        },
        {
          index: 14,
          type: "Minor overlap",
          severity: "info",
          description: "A small overlap was registered near the river-facing edge."
        }
      ]
    }
  })
];

function createField(seed: FieldSeed): Field {
  const { operationSeed, ...fieldProps } = seed;
  const operationReplay = buildOperationReplay(seed.boundary, operationSeed);

  return {
    ...fieldProps,
    telemetryPackets: buildTelemetryPackets(seed, operationReplay),
    operationReplay
  };
}

function point(
  label: string,
  soilMoisture: number,
  airTemperature: number,
  airHumidity: number,
  precipitation: number,
  yieldPotential: number
): TimelinePoint {
  return {
    label,
    soilMoisture,
    airTemperature,
    airHumidity,
    precipitation,
    yieldPotential
  };
}

function buildTelemetryPackets(
  field: FieldSeed,
  operationReplay: OperationReplay
): TelemetryPacket[] {
  const lastTrackPoint = operationReplay.track.at(-1);
  const probeTimestamp = `2026-05-25 ${field.updatedAt}`;

  return [
    {
      id: `${field.id}-air-temp`,
      source: "Meteo station PV-01",
      metric: "Air temperature",
      value: field.airTemperature,
      unit: "C",
      timestamp: probeTimestamp,
      quality: "verified",
      note: "Top mast sensor used by the scenario model."
    },
    {
      id: `${field.id}-air-humidity`,
      source: "Meteo station PV-01",
      metric: "Air humidity",
      value: field.airHumidity,
      unit: "%",
      timestamp: probeTimestamp,
      quality: "verified",
      note: "Humidity trend synchronized with the weather node."
    },
    {
      id: `${field.id}-soil-moisture`,
      source: "DVG-3 probe B2",
      metric: "Soil moisture",
      value: field.soilMoisture,
      unit: "%",
      timestamp: probeTimestamp,
      quality: field.status === "critical" ? "warning" : "verified",
      note: "Primary soil moisture probe in the active root zone."
    },
    {
      id: `${field.id}-soil-ph`,
      source: "Soil node C1",
      metric: "Soil pH",
      value: field.soilPh,
      unit: "pH",
      timestamp: probeTimestamp,
      quality: "verified",
      note: "Latest calibrated pH reading from the field contour."
    },
    {
      id: `${field.id}-rainfall`,
      source: "Rain gauge R-03",
      metric: "Rainfall reserve",
      value: field.precipitation,
      unit: "mm",
      timestamp: probeTimestamp,
      quality: "estimated",
      note: "Accumulated rainfall over the last 24 hours."
    },
    {
      id: `${field.id}-npk`,
      source: "NPK node KHY-3",
      metric: "N/P/K balance",
      value: `${field.nutrients.n}/${field.nutrients.p}/${field.nutrients.k}`,
      unit: "ppm",
      timestamp: probeTimestamp,
      quality: "verified",
      note: "Nutrient package used by the recommendation engine."
    },
    {
      id: `${field.id}-gps`,
      source: operationReplay.machineName,
      metric: "Machine telemetry",
      value: lastTrackPoint ? lastTrackPoint.speed : 0,
      unit: "km/h",
      timestamp: `2026-05-25 ${lastTrackPoint?.time ?? field.updatedAt}`,
      quality: "verified",
      note: "Latest GPS packet linked to plan/fact replay."
    }
  ];
}

function buildOperationReplay(
  boundary: [number, number][],
  seed: OperationSeed
): OperationReplay {
  const [minLat, maxLat, minLng, maxLng] = getBounds(boundary);
  const innerNorth = maxLat - (maxLat - minLat) * 0.18;
  const innerSouth = minLat + (maxLat - minLat) * 0.18;
  const innerWest = minLng + (maxLng - minLng) * 0.14;
  const innerEast = maxLng - (maxLng - minLng) * 0.14;
  const lanes = 5;
  const workPointCount = lanes * 3;
  const areaIncrement = seed.actualAreaHa / workPointCount;
  const fuelDecrement = seed.fuelUsedLiters / (lanes * 4.2);
  const startingFuelLevel = seed.fuelUsedLiters + 74;
  const track: OperationReplay["track"] = [];
  let areaDoneHa = 0;
  let fuelLevelLiters = startingFuelLevel;
  let minuteOffset = 0;
  let pointIndex = 0;

  for (let lane = 0; lane < lanes; lane += 1) {
    const laneRatio = lane / Math.max(lanes - 1, 1);
    const lat = roundTo4(interpolate(innerNorth, innerSouth, laneRatio));
    const nextLat = roundTo4(
      interpolate(innerNorth, innerSouth, Math.min(laneRatio + 1 / Math.max(lanes - 1, 1), 1))
    );
    const forward = lane % 2 === 0;
    const startLng = forward ? innerWest : innerEast;
    const endLng = forward ? innerEast : innerWest;
    const midLng = interpolate(startLng, endLng, 0.5);

    pushTrackPoint(track, {
      id: `track-${pointIndex}`,
      time: addMinutes(seed.startTime, minuteOffset),
      lat,
      lng: roundTo4(startLng),
      speed: 7.2,
      workState: "work",
      areaDoneHa: roundTo1((areaDoneHa += areaIncrement)),
      fuelLevelLiters: roundTo1((fuelLevelLiters -= fuelDecrement))
    });
    pointIndex += 1;
    minuteOffset += 8;

    pushTrackPoint(track, {
      id: `track-${pointIndex}`,
      time: addMinutes(seed.startTime, minuteOffset),
      lat,
      lng: roundTo4(midLng),
      speed: 10.8,
      workState: "work",
      areaDoneHa: roundTo1((areaDoneHa += areaIncrement)),
      fuelLevelLiters: roundTo1((fuelLevelLiters -= fuelDecrement))
    });
    pointIndex += 1;
    minuteOffset += 8;

    pushTrackPoint(track, {
      id: `track-${pointIndex}`,
      time: addMinutes(seed.startTime, minuteOffset),
      lat,
      lng: roundTo4(endLng),
      speed: 9.4,
      workState: "work",
      areaDoneHa: roundTo1((areaDoneHa += areaIncrement)),
      fuelLevelLiters: roundTo1((fuelLevelLiters -= fuelDecrement))
    });
    pointIndex += 1;
    minuteOffset += lane === 2 ? 10 : 6;

    if (lane === 2) {
      pushTrackPoint(track, {
        id: `track-${pointIndex}`,
        time: addMinutes(seed.startTime, minuteOffset - 4),
        lat,
        lng: roundTo4(endLng),
        speed: 0,
        workState: "idle",
        areaDoneHa: roundTo1(areaDoneHa),
        fuelLevelLiters: roundTo1((fuelLevelLiters -= fuelDecrement * 0.2))
      });
      pointIndex += 1;
    }

    if (lane < lanes - 1) {
      pushTrackPoint(track, {
        id: `track-${pointIndex}`,
        time: addMinutes(seed.startTime, minuteOffset),
        lat: nextLat,
        lng: roundTo4(endLng),
        speed: 5.3,
        workState: "turn",
        areaDoneHa: roundTo1(areaDoneHa),
        fuelLevelLiters: roundTo1((fuelLevelLiters -= fuelDecrement * 0.6))
      });
      pointIndex += 1;
      minuteOffset += 5;
    }
  }

  const events = seed.events.map((event, index) => ({
    id: `event-${index}`,
    time: track[Math.min(event.index, track.length - 1)]?.time ?? seed.startTime,
    type: event.type,
    severity: event.severity,
    description: event.description
  }));

  return {
    operationName: seed.operationName,
    machineName: seed.machineName,
    operator: seed.operator,
    plannedAreaHa: seed.plannedAreaHa,
    actualAreaHa: seed.actualAreaHa,
    plannedDurationHours: seed.plannedDurationHours,
    actualDurationHours: seed.actualDurationHours,
    overlapPercent: seed.overlapPercent,
    skipPercent: seed.skipPercent,
    fuelNormLiters: seed.fuelNormLiters,
    fuelUsedLiters: seed.fuelUsedLiters,
    materialRatePlan: seed.materialRatePlan,
    materialRateFact: seed.materialRateFact,
    track,
    events
  };
}

function pushTrackPoint(
  track: OperationReplay["track"],
  point: OperationReplay["track"][number]
) {
  track.push(point);
}

function getBounds(boundary: [number, number][]) {
  const latitudes = boundary.map(([lat]) => lat);
  const longitudes = boundary.map(([, lng]) => lng);

  return [
    Math.min(...latitudes),
    Math.max(...latitudes),
    Math.min(...longitudes),
    Math.max(...longitudes)
  ] as const;
}

function addMinutes(baseTime: string, deltaMinutes: number) {
  const [hours, minutes] = baseTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + deltaMinutes;
  const safeHours = Math.floor(totalMinutes / 60);
  const safeMinutes = totalMinutes % 60;

  return `${String(safeHours).padStart(2, "0")}:${String(safeMinutes).padStart(2, "0")}`;
}

function interpolate(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio;
}

function roundTo1(value: number) {
  return Math.round(value * 10) / 10;
}

function roundTo4(value: number) {
  return Math.round(value * 10000) / 10000;
}
