"use client";

import dynamic from "next/dynamic";
import { Field } from "@/types";

const DynamicOperationTrackMap = dynamic(
  () => import("@/components/gis/operation-track-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[360px] items-center justify-center bg-gradient-to-br from-sage/70 to-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-moss/20" />
          <div className="mt-4 text-sm font-medium text-slate-600">
            Loading replay map...
          </div>
        </div>
      </div>
    )
  }
);

type OperationTrackViewProps = {
  field: Field;
  playbackIndex: number;
};

export function OperationTrackView(props: OperationTrackViewProps) {
  return <DynamicOperationTrackMap {...props} />;
}
