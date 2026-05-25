type KPIStatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function KPIStatCard({ label, value, helper }: KPIStatCardProps) {
  return (
    <div className="app-panel px-5 py-5">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-4 metric-value">{value}</div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
    </div>
  );
}
