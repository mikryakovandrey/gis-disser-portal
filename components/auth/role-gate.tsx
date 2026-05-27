"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { UserRole } from "@/types";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";
import { SectionCard } from "@/components/ui/section-card";

export function RoleGate({
  allow,
  children
}: {
  allow: UserRole[];
  children: ReactNode;
}) {
  const { currentUser, isReady } = useDemoPlatform();

  if (!isReady) {
    return (
      <SectionCard title="Loading access state" subtitle="Checking the current session and access policy.">
        <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-5 py-10 text-sm text-slate-500">
          Loading...
        </div>
      </SectionCard>
    );
  }

  if (!currentUser) {
    return (
      <SectionCard
        title="Login required"
        subtitle="This area is available only after authentication."
      >
        <div className="space-y-4 rounded-[22px] border border-slate-200 bg-slate-50/80 px-5 py-6">
          <p className="text-sm leading-7 text-slate-600">
            Sign in or create a new account to continue.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21473a]"
            >
              Open login
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
            >
              Register user
            </Link>
          </div>
        </div>
      </SectionCard>
    );
  }

  if (!currentUser.isVerified) {
    return (
      <SectionCard
        title="Email verification required"
        subtitle="The account exists, but access stays locked until verification is completed."
      >
        <div className="space-y-4 rounded-[22px] border border-amber-200 bg-amber-50/80 px-5 py-6">
          <p className="text-sm leading-7 text-slate-700">
            Signed in as <span className="font-semibold">{currentUser.email}</span>, but the account is not verified yet.
          </p>
          <Link
            href="/verify"
            className="inline-flex rounded-full bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21473a]"
          >
            Open verification step
          </Link>
        </div>
      </SectionCard>
    );
  }

  if (!allow.includes(currentUser.role)) {
    return (
      <SectionCard
        title="Access restricted"
        subtitle="Your current role does not allow editing this workspace."
      >
        <div className="space-y-4 rounded-[22px] border border-amber-200 bg-amber-50/80 px-5 py-6">
          <p className="text-sm leading-7 text-slate-700">
            Signed in as <span className="font-semibold">{currentUser.email}</span> with role{" "}
            <span className="font-semibold uppercase">{currentUser.role}</span>. This section is reserved for{" "}
            {allow.join(" / ")}.
          </p>
          <Link
            href="/profile"
            className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
          >
            Go to profile
          </Link>
        </div>
      </SectionCard>
    );
  }

  return <>{children}</>;
}
