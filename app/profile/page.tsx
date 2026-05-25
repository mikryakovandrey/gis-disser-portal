"use client";

import Link from "next/link";
import type { Route } from "next";
import { RoleGate } from "@/components/auth/role-gate";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";
import { SectionCard } from "@/components/ui/section-card";

export default function ProfilePage() {
  const { currentUser, fieldOverrides, users } = useDemoPlatform();

  return (
    <RoleGate allow={["user", "admin"]}>
      <div className="flex flex-col gap-6">
        <SectionCard
          title="User profile"
          subtitle="Session summary for the current thesis demo account."
        >
          <div className="grid gap-4 lg:grid-cols-4">
            <ProfileStat
              label="Name"
              value={currentUser?.name ?? "-"}
            />
            <ProfileStat
              label="Role"
              value={currentUser?.role.toUpperCase() ?? "-"}
            />
            <ProfileStat
              label="Users in demo DB"
              value={String(users.length)}
            />
            <ProfileStat
              label="Field overrides"
              value={String(fieldOverrides.length)}
            />
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionCard
            title="Available workspaces"
            subtitle="Role-based navigation from the current authenticated session."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <WorkspaceCard
                href="/"
                title="Dashboard"
                body="General project metrics and risk overview."
              />
              <WorkspaceCard
                href="/gis"
                title="GIS portal"
                body="Scenario lab, analytics, and plan/fact replay."
              />
              <WorkspaceCard
                href="/login"
                title="Session switch"
                body="Log out and sign in under another role."
              />
              {currentUser?.role === "admin" ? (
                <WorkspaceCard
                  href="/admin"
                  title="Admin console"
                  body="Manage users and field overrides in the local demo database."
                />
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Defense talking points"
            subtitle="How to explain this part during the presentation."
          >
            <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
              <p>
                The system supports user authentication and role-based access separation.
              </p>
              <p>
                Standard users can inspect dashboards and GIS analytics, while administrators can also manage users and demo field states.
              </p>
              <p>
                In this defense build, the data layer is implemented as a local browser database, which keeps the prototype fully deployable on GitHub Pages.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </RoleGate>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function WorkspaceCard({
  href,
  title,
  body
}: {
  href: Route;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="font-display text-2xl tracking-[-0.04em] text-ink">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
    </Link>
  );
}
