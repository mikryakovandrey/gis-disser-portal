import type { ReactNode } from "react";
import clsx from "clsx";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionCard({
  title,
  subtitle,
  children,
  className,
  id
}: SectionCardProps) {
  return (
    <section id={id} className={clsx("app-panel px-5 py-5 lg:px-6", className)}>
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-ink">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
