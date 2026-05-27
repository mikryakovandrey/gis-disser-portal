"use client";

import {
  Field,
  IrrigationMode,
  ScenarioInput,
  ScenarioResult
} from "@/types";
import { SectionCard } from "@/components/ui/section-card";
import {
  getOptimalCareRecommendation,
  scenarioPresets
} from "@/utils/scenario-model";
import {
  formatPercent,
  formatTemperature,
  formatYield
} from "@/utils/formatters";

type ScenarioLabProps = {
  field?: Field;
  input?: ScenarioInput;
  result?: ScenarioResult;
  onChange: (next: ScenarioInput) => void;
  onReset: () => void;
  onApplyPreset: (presetId: string) => void;
};

type ChangedSetting = {
  label: string;
  before: string;
  after: string;
};

const irrigationModeLabels: Record<IrrigationMode, string> = {
  none: "No irrigation",
  standard: "Standard",
  smart: "Smart"
};

const factorToneClasses = {
  positive: "bg-emerald-100 text-emerald-700",
  negative: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-700"
} as const;

export function ScenarioLab({
  field,
  input,
  result,
  onChange,
  onReset,
  onApplyPreset
}: ScenarioLabProps) {
  if (!field || !input || !result) {
    return (
      <SectionCard
        title="Scenario Lab"
        subtitle="Select a field to run live what-if scenarios."
      >
        <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/70 px-5 py-12 text-center text-sm text-slate-500">
          No field selected.
        </div>
      </SectionCard>
    );
  }

  const riskDelta = result.field.riskIndex - result.baselineRisk;
  const yieldDelta = result.field.yieldForecast - result.baselineYield;
  const waterDelta = result.waterNeedMm - result.baselineWaterNeedMm;
  const netEffect = result.economicEffect.netEffectKzt;
  const observedPresets = scenarioPresets.filter(
    (preset) => preset.category === "observed"
  );
  const actionPresets = scenarioPresets.filter(
    (preset) => preset.category === "action"
  );
  const changedSettings = buildChangedSettings(field, input);
  const optimalCare = getOptimalCareRecommendation(field, input);

  return (
    <SectionCard
      title="Scenario Lab"
      subtitle="Separate observed field conditions from controllable actions so operators can clearly see what can be adjusted."
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Active scenario
            </div>
            <div className="font-display text-2xl tracking-[-0.04em] text-ink">
              {field.name}
            </div>
            <p className="text-sm text-slate-600">{field.locationLabel}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                {field.crop}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                {field.growthStage}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                Live irrigation: {formatIrrigationMode(field.irrigationMode)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset to live field
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Observed field scenarios
            </div>
            <div className="mt-1 text-sm text-slate-600">
              External conditions that describe what the field experiences, not what the operator directly controls.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {observedPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyPreset(preset.id)}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/85 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="font-semibold text-slate-800">{preset.label}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-[#eef5ea] to-white p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Operator response actions
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Only controllable levers are changed here: irrigation regime and nutrient program.
            </div>
            <div className="mt-4 rounded-[22px] border border-emerald-200 bg-white/90 p-4 shadow-sm">
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {optimalCare.title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {optimalCare.rationale}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                    Risk after: {optimalCare.result.field.riskIndex}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                    Water need: {optimalCare.result.waterNeedMm.toFixed(1)} mm
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                    Net effect: {formatKzt(optimalCare.result.economicEffect.netEffectKzt)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(optimalCare.input)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#2f6b54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#275947]"
                >
                  Apply optimal care plan
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {actionPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyPreset(preset.id)}
                  className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-[20px] border border-white/90 bg-white/80 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                What changed
              </div>
              <div className="mt-3 space-y-2">
                {changedSettings.length ? (
                  changedSettings.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50/80 px-3 py-3"
                    >
                      <div className="text-sm font-medium text-slate-700">{item.label}</div>
                      <div className="text-right text-sm text-slate-600">
                        <span>{item.before}</span>
                        <span className="mx-2 text-slate-400">{"->"}</span>
                        <span className="font-semibold text-slate-800">{item.after}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50/80 px-3 py-3 text-sm text-slate-500">
                    Inputs still match the live field. No scenario changes are active.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <CompareCard
            label="Risk"
            baseline={`${result.baselineRisk}`}
            current={`${result.field.riskIndex}`}
            delta={formatSignedNumber(riskDelta)}
            tone={getToneFromDelta(riskDelta * -1)}
          />
          <CompareCard
            label="Yield forecast"
            baseline={formatYield(result.baselineYield)}
            current={formatYield(result.field.yieldForecast)}
            delta={formatSignedNumber(yieldDelta, " t/ha")}
            tone={getToneFromDelta(yieldDelta)}
          />
          <CompareCard
            label="Water need"
            baseline={`${result.baselineWaterNeedMm.toFixed(1)} mm`}
            current={`${result.waterNeedMm.toFixed(1)} mm`}
            delta={formatSignedNumber(waterDelta, " mm")}
            tone={getToneFromDelta(waterDelta * -1)}
          />
          <CompareCard
            label="Net effect"
            baseline="Baseline"
            current={formatKzt(netEffect)}
            delta={netEffect >= 0 ? "Improvement" : "Loss scenario"}
            tone={getToneFromDelta(netEffect)}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Observed conditions
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Manual tuning of telemetry and weather inputs. Rainfall stays here because it is an observed condition, not a control action.
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ScenarioSlider
                label="Soil moisture"
                value={input.soilMoisture}
                min={10}
                max={45}
                step={0.5}
                displayValue={formatPercent(input.soilMoisture)}
                onChange={(value) => onChange({ ...input, soilMoisture: value })}
              />
              <ScenarioSlider
                label="Air temperature"
                value={input.airTemperature}
                min={8}
                max={40}
                step={0.5}
                displayValue={formatTemperature(input.airTemperature)}
                onChange={(value) => onChange({ ...input, airTemperature: value })}
              />
              <ScenarioSlider
                label="Air humidity"
                value={input.airHumidity}
                min={20}
                max={90}
                step={1}
                displayValue={formatPercent(input.airHumidity)}
                onChange={(value) => onChange({ ...input, airHumidity: value })}
              />
              <ScenarioSlider
                label="Rainfall (24h)"
                value={input.precipitation}
                min={0}
                max={15}
                step={0.1}
                displayValue={`${input.precipitation.toFixed(1)} mm`}
                onChange={(value) => onChange({ ...input, precipitation: value })}
              />
              <ScenarioSlider
                label="Soil pH"
                value={input.soilPh}
                min={4.5}
                max={8.5}
                step={0.1}
                displayValue={input.soilPh.toFixed(1)}
                onChange={(value) => onChange({ ...input, soilPh: value })}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Controllable settings
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Settings the operator can actually adjust in the field.
            </div>
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
              <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
                <div className="space-y-4 rounded-[20px] bg-white px-4 py-4 shadow-sm">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Irrigation mode
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      Choose the field water management regime directly.
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(
                      ["none", "standard", "smart"] as IrrigationMode[]
                    ).map((mode) => {
                      const isActive = input.irrigationMode === mode;

                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() =>
                            onChange({
                              ...input,
                              irrigationMode: mode
                            })
                          }
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                            isActive
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {formatIrrigationMode(mode)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[20px] bg-white px-4 py-4 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Nutrient profile
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Adjust only the controllable N/P/K package.
                  </div>
                  <div className="mt-4 space-y-4">
                    <CompactControlSlider
                      label="Nitrogen (N)"
                      value={input.nutrients.n}
                      min={10}
                      max={65}
                      step={1}
                      displayValue={`${input.nutrients.n} ppm`}
                      onChange={(value) =>
                        onChange({
                          ...input,
                          nutrients: { ...input.nutrients, n: value }
                        })
                      }
                    />
                    <CompactControlSlider
                      label="Phosphorus (P)"
                      value={input.nutrients.p}
                      min={8}
                      max={40}
                      step={1}
                      displayValue={`${input.nutrients.p} ppm`}
                      onChange={(value) =>
                        onChange({
                          ...input,
                          nutrients: { ...input.nutrients, p: value }
                        })
                      }
                    />
                    <CompactControlSlider
                      label="Potassium (K)"
                      value={input.nutrients.k}
                      min={10}
                      max={45}
                      step={1}
                      displayValue={`${input.nutrients.k} ppm`}
                      onChange={(value) =>
                        onChange({
                          ...input,
                          nutrients: { ...input.nutrients, k: value }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <OutputCard
            label="Recommendation"
            value={result.field.recommendation}
            hint={result.field.irrigationWindow}
          />
          <OutputCard
            label="Scenario status"
            value={`${result.field.status} / ${irrigationModeLabels[result.field.irrigationMode]}`}
            hint={`Water need ${result.waterNeedMm.toFixed(1)} mm`}
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#eef5ea] to-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Economic effect
            </div>
            <div className="mt-1 text-sm text-slate-600">
                A business view of what the scenario means for yield, water, fuel, and money.
            </div>
            </div>
            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                netEffect >= 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {netEffect >= 0 ? "Positive scenario" : "Negative scenario"}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <EconomicCard
              label="Yield delta"
              value={`${formatSignedNumber(result.economicEffect.expectedYieldDeltaTons, " t")}`}
              hint={formatKzt(result.economicEffect.expectedRevenueDeltaKzt)}
            />
            <EconomicCard
              label="Water volume"
              value={`${formatSignedInteger(result.economicEffect.irrigationVolumeDeltaM3)} m3`}
              hint={formatKzt(result.economicEffect.irrigationCostDeltaKzt)}
            />
            <EconomicCard
              label="Fuel impact"
              value={`${formatSignedNumber(result.economicEffect.fuelDeltaLiters, " L")}`}
              hint={`Avoided loss ${formatKzt(result.economicEffect.avoidedLossKzt)}`}
            />
            <EconomicCard
              label="Net effect"
              value={formatKzt(netEffect)}
              hint={`Nutrition cost ${formatKzt(result.economicEffect.nutrientAdjustmentCostKzt)}`}
            />
          </div>
        </div>

        <details className="rounded-[24px] border border-slate-200 bg-white/80 p-5">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
            Raw telemetry and evidence drawer
          </summary>
          <div className="mt-4 space-y-5">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Model input trace
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="text-xs uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Input</th>
                      <th className="px-3 py-2">Live field</th>
                      <th className="px-3 py-2">Scenario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Soil moisture",
                        formatPercent(field.soilMoisture),
                        formatPercent(input.soilMoisture)
                      ],
                      [
                        "Air temperature",
                        formatTemperature(field.airTemperature),
                        formatTemperature(input.airTemperature)
                      ],
                      [
                        "Air humidity",
                        formatPercent(field.airHumidity),
                        formatPercent(input.airHumidity)
                      ],
                      [
                        "Rainfall",
                        `${field.precipitation.toFixed(1)} mm`,
                        `${input.precipitation.toFixed(1)} mm`
                      ],
                      ["Soil pH", field.soilPh.toFixed(1), input.soilPh.toFixed(1)],
                      [
                        "N / P / K",
                        `${field.nutrients.n}/${field.nutrients.p}/${field.nutrients.k}`,
                        `${input.nutrients.n}/${input.nutrients.p}/${input.nutrients.k}`
                      ],
                      [
                        "Irrigation mode",
                        formatIrrigationMode(field.irrigationMode),
                        formatIrrigationMode(input.irrigationMode)
                      ]
                    ].map(([label, baseline, scenario]) => (
                      <tr key={label} className="border-t border-slate-200/80">
                        <td className="px-3 py-3 font-medium">{label}</td>
                        <td className="px-3 py-3">{baseline}</td>
                        <td className="px-3 py-3">{scenario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Source telemetry packets
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="text-xs uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Metric</th>
                      <th className="px-3 py-2">Source</th>
                      <th className="px-3 py-2">Value</th>
                      <th className="px-3 py-2">Quality</th>
                      <th className="px-3 py-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {field.telemetryPackets.map((packet) => (
                      <tr key={packet.id} className="border-t border-slate-200/80 align-top">
                        <td className="px-3 py-3">
                          <div className="font-medium">{packet.metric}</div>
                          <div className="mt-1 text-xs text-slate-500">{packet.note}</div>
                        </td>
                        <td className="px-3 py-3">{packet.source}</td>
                        <td className="px-3 py-3">
                          {packet.value} {packet.unit}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                              packet.quality === "verified"
                                ? "bg-emerald-100 text-emerald-700"
                                : packet.quality === "warning"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {packet.quality}
                          </span>
                        </td>
                        <td className="px-3 py-3">{packet.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>

        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#f6f1e3] to-white p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Why the result changed
          </div>
          <div className="mt-4 space-y-3">
            {result.factors.map((factor) => (
              <div
                key={`${factor.key}-${factor.label}`}
                className="rounded-[20px] border border-slate-200 bg-white/85 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-slate-800">{factor.label}</div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${factorToneClasses[factor.impact]}`}
                  >
                    {factor.impact}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {factor.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

type ScenarioSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
};

function ScenarioSlider({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange
}: ScenarioSliderProps) {
  return (
    <label className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#2f6b54]"
      />
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </label>
  );
}

type CompactControlSliderProps = ScenarioSliderProps;

function CompactControlSlider({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange
}: CompactControlSliderProps) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-slate-50/80 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#2f6b54]"
      />
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

type OutputCardProps = {
  label: string;
  value: string;
  hint: string;
};

function OutputCard({ label, value, hint }: OutputCardProps) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-800">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{hint}</div>
    </div>
  );
}

type CompareCardProps = {
  label: string;
  baseline: string;
  current: string;
  delta: string;
  tone: "positive" | "negative" | "neutral";
};

function CompareCard({ label, baseline, current, delta, tone }: CompareCardProps) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Before</div>
          <div className="mt-1 text-sm font-semibold text-slate-700">{baseline}</div>
        </div>
        <div className="text-sm text-slate-400">{"->"}</div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-400">After</div>
          <div className="mt-1 text-sm font-semibold text-slate-800">{current}</div>
        </div>
      </div>
      <div
        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${factorToneClasses[tone]}`}
      >
        {delta}
      </div>
    </div>
  );
}

type EconomicCardProps = {
  label: string;
  value: string;
  hint: string;
};

function EconomicCard({ label, value, hint }: EconomicCardProps) {
  return (
    <div className="rounded-[22px] border border-emerald-100 bg-white/85 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 font-display text-2xl tracking-[-0.04em] text-ink">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{hint}</div>
    </div>
  );
}

function buildChangedSettings(field: Field, input: ScenarioInput): ChangedSetting[] {
  const settings: ChangedSetting[] = [];

  pushChangedSetting(
    settings,
    "Irrigation mode",
    formatIrrigationMode(field.irrigationMode),
    formatIrrigationMode(input.irrigationMode)
  );
  pushChangedSetting(
    settings,
    "Soil moisture",
    formatPercent(field.soilMoisture),
    formatPercent(input.soilMoisture)
  );
  pushChangedSetting(
    settings,
    "Air temperature",
    formatTemperature(field.airTemperature),
    formatTemperature(input.airTemperature)
  );
  pushChangedSetting(
    settings,
    "Air humidity",
    formatPercent(field.airHumidity),
    formatPercent(input.airHumidity)
  );
  pushChangedSetting(
    settings,
    "Rainfall (24h)",
    `${field.precipitation.toFixed(1)} mm`,
    `${input.precipitation.toFixed(1)} mm`
  );
  pushChangedSetting(settings, "Soil pH", field.soilPh.toFixed(1), input.soilPh.toFixed(1));
  pushChangedSetting(
    settings,
    "Nitrogen (N)",
    `${field.nutrients.n} ppm`,
    `${input.nutrients.n} ppm`
  );
  pushChangedSetting(
    settings,
    "Phosphorus (P)",
    `${field.nutrients.p} ppm`,
    `${input.nutrients.p} ppm`
  );
  pushChangedSetting(
    settings,
    "Potassium (K)",
    `${field.nutrients.k} ppm`,
    `${input.nutrients.k} ppm`
  );

  return settings;
}

function pushChangedSetting(
  settings: ChangedSetting[],
  label: string,
  before: string,
  after: string
) {
  if (before === after) {
    return;
  }

  settings.push({ label, before, after });
}

function formatIrrigationMode(mode: IrrigationMode) {
  return irrigationModeLabels[mode];
}

function formatKzt(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")} KZT`;
}

function formatSignedNumber(value: number, suffix = "") {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(value).toFixed(1)}${suffix}`;
}

function formatSignedInteger(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")}`;
}

function getToneFromDelta(value: number): "positive" | "negative" | "neutral" {
  if (value > 0.01) {
    return "positive";
  }

  if (value < -0.01) {
    return "negative";
  }

  return "neutral";
}
