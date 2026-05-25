"use client";

import dynamic from "next/dynamic";
import { Field } from "@/types";

const DynamicMapCanvas = dynamic(() => import("@/components/gis/map-canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[540px] items-center justify-center bg-gradient-to-br from-sage/70 to-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-moss/20" />
        <div className="mt-4 text-sm font-medium text-slate-600">Loading GIS map...</div>
      </div>
    </div>
  )
});

type MapViewProps = {
  fields: Field[];
  selectedFieldId: string;
  onSelectField: (fieldId: string) => void;
};

export function MapView(props: MapViewProps) {
  return <DynamicMapCanvas {...props} />;
}
