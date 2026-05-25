"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import { Field } from "@/types";
import { getStatusMeta } from "@/utils/field-helpers";
import {
  formatArea,
  formatPercent,
  formatTemperature,
  formatYield
} from "@/utils/formatters";

type MapCanvasProps = {
  fields: Field[];
  selectedFieldId: string;
  onSelectField: (fieldId: string) => void;
};

export default function MapCanvas({
  fields,
  selectedFieldId,
  onSelectField
}: MapCanvasProps) {
  const initialCenter = fields[0]?.centroid ?? { lat: 53.426, lng: 75.288 };
  const selectedField = fields.find((field) => field.id === selectedFieldId);

  return (
    <MapContainer
      center={[initialCenter.lat, initialCenter.lng]}
      zoom={12}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToFields fields={fields} />
      <FocusField field={selectedField} />

      {fields.map((field) => {
        const status = getStatusMeta(field.status);
        const isSelected = field.id === selectedFieldId;

        return (
          <Polygon
            key={field.id}
            positions={field.boundary}
            pathOptions={{
              color: status.strokeColor,
              fillColor: status.fillColor,
              fillOpacity: isSelected ? 0.72 : 0.48,
              weight: isSelected ? 4 : 2.5
            }}
            eventHandlers={{
              click: () => onSelectField(field.id)
            }}
          >
            <Popup>
              <div className="min-w-[240px] space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    {field.crop}
                  </div>
                  <div className="mt-1 font-display text-xl tracking-[-0.04em] text-slate-800">
                    {field.name}
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{field.locationLabel}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Area
                    </div>
                    <div className="mt-1 font-medium">{formatArea(field.areaHa)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Status
                    </div>
                    <div className="mt-1 font-medium">{status.label}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Moisture
                    </div>
                    <div className="mt-1 font-medium">
                      {formatPercent(field.soilMoisture)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Temperature
                    </div>
                    <div className="mt-1 font-medium">
                      {formatTemperature(field.airTemperature)}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Yield forecast:{" "}
                  <span className="font-semibold text-slate-800">
                    {formatYield(field.yieldForecast)}
                  </span>
                </div>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}

function FitToFields({ fields }: { fields: Field[] }) {
  const map = useMap();

  useEffect(() => {
    if (!fields.length) {
      return;
    }

    const points = fields.flatMap((field) =>
      field.boundary.map(([lat, lng]) => L.latLng(lat, lng))
    );

    map.fitBounds(L.latLngBounds(points), { padding: [32, 32] });
  }, [fields, map]);

  return null;
}

function FocusField({ field }: { field?: Field }) {
  const map = useMap();
  const fieldId = field?.id;
  const fieldLat = field?.centroid.lat;
  const fieldLng = field?.centroid.lng;

  useEffect(() => {
    if (!fieldId || fieldLat === undefined || fieldLng === undefined) {
      return;
    }

    map.flyTo([fieldLat, fieldLng], 13, {
      duration: 1.2
    });
  }, [fieldId, fieldLat, fieldLng, map]);

  return null;
}
