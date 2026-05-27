"use client";

import { useEffect, useState } from "react";
import { Field } from "@/types";
import { OperationTrackView } from "@/components/gis/operation-track-view";
import { SectionCard } from "@/components/ui/section-card";
import { formatArea } from "@/utils/formatters";

type OperationsReplayProps = {
  field: Field;
};

const severityClasses = {
  info: "bg-sky-100 text-sky-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-rose-100 text-rose-700"
} as const;

export function OperationsReplay({ field }: OperationsReplayProps) {
  const track = field.operationReplay.track;
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setPlaybackIndex(0);
    setIsPlaying(false);
  }, [field.id]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setPlaybackIndex((current) => {
        if (current >= track.length - 1) {
          window.clearInterval(timer);
          setIsPlaying(false);

          return current;
        }

        return current + 1;
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [isPlaying, track.length]);

  const replay = field.operationReplay;
  const currentPoint = track[playbackIndex];
  const progress = currentPoint
    ? Math.min((currentPoint.areaDoneHa / replay.actualAreaHa) * 100, 100)
    : 0;
  const completedEvents = replay.events.filter((event) =>
    currentPoint ? event.time <= currentPoint.time : false
  );
  const latestEvent = completedEvents.at(-1);
  const nextEvent = replay.events.find((event) =>
    currentPoint ? event.time > currentPoint.time : true
  );
  const areaDelta = replay.actualAreaHa - replay.plannedAreaHa;
  const durationDelta = replay.actualDurationHours - replay.plannedDurationHours;
  const fuelDelta = replay.fuelUsedLiters - replay.fuelNormLiters;
  const materialDelta = replay.materialRateFact - replay.materialRatePlan;

  return (
    <SectionCard
      title="Plan / Fact Replay"
      subtitle={`Track replay and execution-quality review for ${replay.operationName.toLowerCase()} on ${field.name}.`}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50/75 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Active operation
            </div>
            <div className="font-display text-3xl tracking-[-0.05em] text-ink">
              {replay.operationName}
            </div>
            <div className="text-sm leading-6 text-slate-600">
              {replay.machineName} / operator {replay.operator}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (playbackIndex >= track.length - 1) {
                  setPlaybackIndex(0);
                }
                setIsPlaying((current) => !current);
              }}
              className="rounded-full bg-[#2f6b54] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#275947]"
            >
              {isPlaying ? "Pause replay" : playbackIndex >= track.length - 1 ? "Replay again" : "Play replay"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setPlaybackIndex(0);
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReplayStat
            label="Area"
            planned={formatArea(replay.plannedAreaHa)}
            actual={formatArea(replay.actualAreaHa)}
            delta={formatSigned(areaDelta, " ha")}
          />
          <ReplayStat
            label="Duration"
            planned={`${replay.plannedDurationHours.toFixed(1)} h`}
            actual={`${replay.actualDurationHours.toFixed(1)} h`}
            delta={formatSigned(durationDelta, " h")}
          />
          <ReplayStat
            label="Fuel"
            planned={`${replay.fuelNormLiters.toFixed(0)} L`}
            actual={`${replay.fuelUsedLiters.toFixed(0)} L`}
            delta={formatSigned(fuelDelta, " L")}
          />
          <ReplayStat
            label="Material rate"
            planned={`${replay.materialRatePlan.toFixed(0)} kg/ha`}
            actual={`${replay.materialRateFact.toFixed(0)} kg/ha`}
            delta={formatSigned(materialDelta, " kg/ha")}
          />
        </div>

        <div className="grid gap-5 2xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="h-[300px] overflow-hidden rounded-[28px] border border-slate-200 sm:h-[360px] xl:h-[430px]">
              <OperationTrackView field={field} playbackIndex={playbackIndex} />
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white/85 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Replay progress
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {currentPoint?.time ?? "--:--"} / {currentPoint?.workState ?? "idle"} / {currentPoint?.speed.toFixed(1) ?? "0.0"} km/h
                  </div>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {progress.toFixed(0)}% complete
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#d97c39] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <input
                type="range"
                min={0}
                max={Math.max(track.length - 1, 0)}
                step={1}
                value={playbackIndex}
                onChange={(event) => {
                  setIsPlaying(false);
                  setPlaybackIndex(Number(event.target.value));
                }}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#2f6b54]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/85 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Current machine state
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                <CurrentStateCard
                  label="Replay phase"
                  value={isPlaying ? "Playback running" : "Playback paused"}
                />
                <CurrentStateCard
                  label="Time"
                  value={currentPoint?.time ?? "--:--"}
                />
                <CurrentStateCard
                  label="Area completed"
                  value={`${currentPoint?.areaDoneHa.toFixed(1) ?? "0.0"} ha`}
                />
                <CurrentStateCard
                  label="Fuel level"
                  value={`${currentPoint?.fuelLevelLiters.toFixed(1) ?? "0.0"} L`}
                />
                <CurrentStateCard
                  label="Coverage quality"
                  value={`Overlap ${replay.overlapPercent.toFixed(1)}% / Skip ${replay.skipPercent.toFixed(1)}%`}
                />
                <CurrentStateCard
                  label="Latest event"
                  value={latestEvent ? `${latestEvent.time} / ${latestEvent.type}` : "No triggered events yet"}
                />
                <CurrentStateCard
                  label="Next event"
                  value={nextEvent ? `${nextEvent.time} / ${nextEvent.type}` : "Replay completed"}
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white/85 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Replay events
              </div>
              <div className="mt-4 space-y-3">
                {replay.events.map((event) => {
                  const isActive = currentPoint ? event.time <= currentPoint.time : false;

                  return (
                    <div
                      key={event.id}
                      className={`rounded-[20px] border px-4 py-3 transition ${
                        isActive
                          ? "border-slate-200 bg-slate-50"
                          : "border-slate-100 bg-white opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-800">{event.type}</div>
                          <div className="mt-1 text-sm text-slate-500">{event.time}</div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${severityClasses[event.severity]}`}
                        >
                          {event.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {event.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#f8f2e1] to-white p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Plan / fact interpretation
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The replay shows how the operation drifted from plan in area, duration, and input rate so operators can tie execution quality back to field performance.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {completedEvents.length} events reached
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {replay.overlapPercent.toFixed(1)}% overlap
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {replay.skipPercent.toFixed(1)}% skip
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

type ReplayStatProps = {
  label: string;
  planned: string;
  actual: string;
  delta: string;
};

function ReplayStat({ label, planned, actual, delta }: ReplayStatProps) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/75 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Plan</div>
          <div className="mt-1 text-sm font-semibold text-slate-700">{planned}</div>
        </div>
        <div className="text-sm text-slate-400">{"->"}</div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Fact</div>
          <div className="mt-1 text-sm font-semibold text-slate-800">{actual}</div>
        </div>
      </div>
      <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
        {delta}
      </div>
    </div>
  );
}

type CurrentStateCardProps = {
  label: string;
  value: string;
};

function CurrentStateCard({ label, value }: CurrentStateCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-700">{value}</div>
    </div>
  );
}

function formatSigned(value: number, suffix: string) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(value).toFixed(1)}${suffix}`;
}
