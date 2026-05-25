import clsx from "clsx";
import { FieldStatus } from "@/types";
import { getStatusMeta } from "@/utils/field-helpers";

type StatusBadgeProps = {
  status: FieldStatus;
  compact?: boolean;
};

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={clsx(
        meta.badgeClassName,
        compact ? "px-3 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
      )}
    >
      {meta.label}
    </span>
  );
}
