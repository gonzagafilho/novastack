"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Falha no login");
      window.location.href = "/admin/leads";
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">NovaStack • Admin Login</h1>
        <p className="mt-2 text-sm text-white/60">Acesso restrito.</p>

        <div className="mt-6 grid gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none"
          />

          {err && <div className="text-sm text-red-400">{err}</div>}

          <button
            onClick={onLogin}
            disabled={loading || !email || !password}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </main>
  );
}
