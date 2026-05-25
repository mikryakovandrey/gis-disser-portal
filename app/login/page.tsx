"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/ui/section-card";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser, isReady } = useDemoPlatform();
  const [email, setEmail] = useState("admin@agrosphere.demo");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isReady && currentUser) {
      router.replace(currentUser.role === "admin" ? "/admin" : "/profile");
    }
  }, [currentUser, isReady, router]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <SectionCard
        title="Demo login"
        subtitle="Client-side authentication for the thesis defense build."
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const result = login(email, password);
              setMessage(result.message);
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21473a]"
              >
                Sign in
              </button>
              <Link
                href="/register"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Create user account
              </Link>
            </div>

            {message ? (
              <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                {message}
              </div>
            ) : null}
          </form>

          <div className="space-y-4 rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Ready for defense
            </div>
            <div className="space-y-3 text-sm leading-7 text-slate-600">
              <p>
                This demo build uses a local browser database to simulate real authentication and role separation.
              </p>
              <p>
                Admin demo account: <span className="font-semibold text-slate-800">admin@agrosphere.demo / admin123</span>
              </p>
              <p>
                User demo account: <span className="font-semibold text-slate-800">user@agrosphere.demo / user123</span>
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
