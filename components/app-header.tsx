"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#264c3d] via-[#38725b] to-[#d39a3c] shadow-soft sm:h-12 sm:w-12">
            <div className="h-4 w-4 rounded-full border-2 border-white/70 sm:h-5 sm:w-5" />
          </div>
          <div>
            <div className="font-display text-base font-semibold tracking-[-0.04em] text-ink sm:text-lg">
              AgroSphere
            </div>
            <div className="hidden text-xs uppercase tracking-[0.16em] text-slate-500 sm:block">
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

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/75 text-slate-700 shadow-soft transition hover:bg-white md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="relative h-4 w-5">
            <span
              className={clsx(
                "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition",
                isMobileMenuOpen && "top-[7px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition",
                isMobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition",
                isMobileMenuOpen && "top-[7px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-white/60 bg-canvas/95 px-4 pb-4 pt-3 shadow-soft backdrop-blur-xl md:hidden">
          <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-3">
            <div className="grid gap-2">
              {roleAwareItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                      isActive
                        ? "border-ink bg-ink text-white"
                        : "border-slate-200 bg-white/80 text-slate-700"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="rounded-[22px] border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
              Model status: <span className="font-semibold text-slate-800">Operational</span>
            </div>

            {isReady ? (
              currentUser ? (
                <div className="rounded-[22px] border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
                  <div>
                    Signed in: <span className="font-semibold text-slate-800">{currentUser.name}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {currentUser.role}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {currentUser.isVerified ? "verified" : "unverified"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full bg-moss px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#21473a]"
                  >
                    Register
                  </Link>
                </div>
              )
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
