"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HR_ACCOUNTS, setSession } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const account = HR_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );
    if (account) {
      setSession();
      router.push("/");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0_0)] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        {/* Brand */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[oklch(0.52_0_0)] mb-3">
            Institutional Memory Platform
          </p>
          <h1 className="text-[28px] font-semibold tracking-tight text-[oklch(0.12_0_0)]">
            OmniSync
          </h1>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[oklch(0.62_0.16_250)] bg-[oklch(0.62_0.16_250)]/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.16_250)]" />
            AI-Powered HR Intelligence
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[oklch(0.88_0_0)] rounded-2xl p-8 shadow-sm">
          <p className="text-[13px] text-[oklch(0.52_0_0)] mb-6">
            Sign in to your HR portal
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[oklch(0.35_0_0)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hr1@omnisync.com"
                required
                className="w-full h-10 px-3 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-[oklch(0.97_0_0)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 focus:border-[oklch(0.62_0.16_250)] transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[oklch(0.35_0_0)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 px-3 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-[oklch(0.97_0_0)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 focus:border-[oklch(0.62_0.16_250)] transition-all"
              />
            </div>

            {error && (
              <p className="text-[12px] text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full h-10 mt-2 bg-[oklch(0.12_0_0)] text-white text-[13px] font-semibold rounded-lg hover:bg-[oklch(0.20_0_0)] transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[oklch(0.92_0_0)]">
            <p className="text-[11px] text-[oklch(0.62_0_0)] text-center">
              Demo · hr1@omnisync.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
