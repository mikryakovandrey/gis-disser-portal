"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  TileLayer,
  useMap
} from "react-leaflet";
import { Field } from "@/types";

type OperationTrackMapProps = {
  field: Field;
  playbackIndex: number;
};

export default function OperationTrackMap({
  field,
  playbackIndex
}: OperationTrackMapProps) {
  const track = field.operationReplay.track;
  const completedTrack = track.slice(0, playbackIndex + 1);
  const currentPoint = completedTrack.at(-1);

  return (
    <MapContainer
      center={[field.centroid.lat, field.centroid.lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToBoundary boundary={field.boundary} />
      <FocusTrackPoint point={currentPoint} />

      <Polygon
        positions={field.boundary}
        pathOptions={{
          color: "#275947",
          weight: 2.5,
          fillColor: "#95b98b",
          fillOpacity: 0.15
        }}
      />

      <Polyline
        positions={track.map((point) => [point.lat, point.lng] as [number, number])}
        pathOptions={{
          color: "#aac3d8",
          weight: 3,
          dashArray: "6 6",
          opacity: 0.8
        }}
      />

      <Polyline
        positions={completedTrack.map((point) => [point.lat, point.lng] as [number, number])}
        pathOptions={{
          color: "#d97c39",
          weight: 4
        }}
      />

      {currentPoint ? (
        <CircleMarker
          center={[currentPoint.lat, currentPoint.lng]}
          radius={7}
          pathOptions={{
            color: "#ffffff",
            fillColor: currentPoint.workState === "idle" ? "#a855f7" : "#d6534c",
            fillOpacity: 1,
            weight: 3
          }}
        />
      ) : null}
    </MapContainer>
  );
}

function FitToBoundary({ boundary }: { boundary: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    const points = boundary.map(([lat, lng]) => L.latLng(lat, lng));

    map.fitBounds(L.latLngBounds(points), { padding: [28, 28] });
  }, [boundary, map]);

  return null;
}

function FocusTrackPoint({
  point
}: {
  point?: Field["operationReplay"]["track"][number];
}) {
  const map = useMap();

  useEffect(() => {
    if (!point) {
      return;
    }

    map.panTo([point.lat, point.lng], {
      animate: true,
      duration: 0.8
    });
  }, [map, point]);

  return null;
}
