"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/gis", label: "GIS Portal" }
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[1000] border-b border-white/50 bg-canvas/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#264c3d] via-[#38725b] to-[#d39a3c] shadow-soft">
            <div className="h-5 w-5 rounded-full border-2 border-white/70" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold tracking-[-0.04em] text-ink">
              AgroSphere
            </div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Precision Farming Decision Support
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/60 p-1 shadow-soft md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-ink text-white"
                    : "text-slate-600 hover:bg-white hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-soft">
            Model status: <span className="font-semibold text-slate-800">Operational</span>
          </div>
        </div>
      </div>
    </header>
  );
}
