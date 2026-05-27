"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/ui/section-card";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useDemoPlatform();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <SectionCard
        title="Create account"
        subtitle="Register a new account to access the platform."
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const result = register({ name, email, password, confirmPassword });
              setMessage(result.message);

              if (result.ok) {
                router.push("/verify");
              }
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Full name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                placeholder="Ainur Sarsembayeva"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                placeholder="ainur@example.com"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                placeholder="Create password"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                placeholder="Repeat password"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21473a]"
              >
                Register
              </button>
              <Link
                href="/login"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Back to login
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
              Registration flow
            </div>
            <ul className="space-y-3 text-sm leading-7 text-slate-600">
              <li>Each account is created with its own access profile.</li>
              <li>Every new registration receives the <span className="font-semibold text-slate-800">user</span> role.</li>
              <li>Email format and password strength are validated before account creation.</li>
              <li>Role promotion to <span className="font-semibold text-slate-800">admin</span> is available only from the admin console.</li>
            </ul>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
