"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/ui/section-card";
import { useDemoPlatform } from "@/components/providers/demo-platform-provider";

export default function VerifyPage() {
  const router = useRouter();
  const { currentUser, verifyCurrentUser, isReady } = useDemoPlatform();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isReady && !currentUser) {
      router.replace("/login");
    }
  }, [currentUser, isReady, router]);

  useEffect(() => {
    if (isReady && currentUser?.isVerified) {
      router.replace(currentUser.role === "admin" ? "/admin" : "/profile");
    }
  }, [currentUser, isReady, router]);

  const isDemoMailboxVisible = useMemo(
    () => Boolean(currentUser && !currentUser.isVerified),
    [currentUser]
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <SectionCard
        title="Verify account"
        subtitle="Mandatory verification step before opening the service workspaces."
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const result = verifyCurrentUser(code);
              setMessage(result.message);

              if (result.ok && currentUser) {
                router.push(currentUser.role === "admin" ? "/admin" : "/profile");
              }
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Verification code</span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
                placeholder="Enter 6-digit code"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21473a]"
              >
                Verify account
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
              Demo mailbox
            </div>
            {isDemoMailboxVisible ? (
              <div className="space-y-3 text-sm leading-7 text-slate-600">
                <p>
                  Because this thesis build runs on GitHub Pages without a backend mail server, verification is simulated inside the app.
                </p>
                <p>
                  Use the generated code from your local demo mailbox. The code is stored only in browser-local demo data.
                </p>
                <div className="rounded-[20px] border border-dashed border-emerald-200 bg-white px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Local verification code
                  </div>
                  <div className="mt-2 font-display text-3xl tracking-[0.18em] text-ink">
                    {currentUser?.verificationCode ?? "------"}
                  </div>
                </div>
                <p>
                  Signed in as <span className="font-semibold text-slate-800">{currentUser?.email}</span>.
                </p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-slate-600">
                Sign in first to continue with account verification.
              </p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
