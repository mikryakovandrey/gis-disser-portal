import { Field } from "@/types";
import { getStatusMeta } from "@/utils/field-helpers";

type RecommendationCardProps = {
  field: Field;
};

export function RecommendationCard({ field }: RecommendationCardProps) {
  const status = getStatusMeta(field.status);

  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 transition hover:border-slate-300 hover:bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
            {field.name}
          </div>
          <h3 className="mt-1 font-display text-2xl tracking-[-0.04em] text-ink">
            {field.recommendation}
          </h3>
        </div>
        <span className={status.badgeClassName}>{status.label}</span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Crop
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-700">
            {field.crop}
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Risk Index
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-700">
            {field.riskIndex}/100
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <div className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Updated
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-700">
            {field.updatedAt}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">{field.modelSummary}</p>
    </article>
  );
}
