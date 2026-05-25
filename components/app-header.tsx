"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";

type NavItem = {
  href: Route;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/gis", label: "GIS Portal" },
  { href: "/profile", label: "Profile" }
];

export function AppHeader() {
  const pathname = usePathname();
  const { currentUser, logout, isReady } = useDemoPlatform();
  const roleAwareItems: NavItem[] =
    currentUser?.role === "admin"
      ? [
          ...navItems,
          ...(currentUser.isVerified ? [] : [{ href: "/verify", label: "Verify" } as NavItem]),
          { href: "/admin", label: "Admin" }
        ]
      : currentUser && !currentUser.isVerified
        ? [...navItems, { href: "/verify", label: "Verify" }]
        : navItems;

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
          {roleAwareItems.map((item) => {
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
          {isReady ? (
            currentUser ? (
              <>
                <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-soft">
                  Signed in:{" "}
                  <span className="font-semibold text-slate-800">
                    {currentUser.name}
                  </span>{" "}
                  <span className="uppercase tracking-[0.14em] text-slate-500">
                    {currentUser.role}
                  </span>
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {currentUser.isVerified ? "verified" : "unverified"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-moss px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21473a]"
                >
                  Register
                </Link>
              </>
            )
          ) : null}
          <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-soft">
            Model status: <span className="font-semibold text-slate-800">Operational</span>
          </div>
        </div>
      </div>
    </header>
  );
}
