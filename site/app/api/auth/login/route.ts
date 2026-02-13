import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signSession, setSessionCookie } from "@/app/lib/auth";
// --- Rate limit (memória) por IP: 10 tentativas / 10 min ---
type RateEntry = { count: number; resetAt: number };
const loginRate = (globalThis as any).__loginRate || new Map<string, RateEntry>();
(globalThis as any).__loginRate = loginRate;

const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_ATTEMPTS = 10;

function getClientIp(req: Request) {
  // Nginx geralmente manda x-forwarded-for
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = loginRate.get(key);

  if (!entry || now > entry.resetAt) {
    loginRate.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  loginRate.set(key, entry);
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, resetAt: entry.resetAt };
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getClientIp(req);
const key = `login:${ip}`;
const rl = checkRateLimit(key);

if (!rl.allowed) {
  const retryAfterSec = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
  return new Response(
    JSON.stringify({ ok: false, message: "Muitas tentativas. Tente novamente em alguns minutos." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    }
  );
}
  try {
    // ✅ pega o body
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;

    // ✅ pega hash do PM2 em base64 (seguro contra $)
    const adminHash =
      process.env.ADMIN_PASSWORD_HASH_B64
        ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64, "base64").toString("utf8")
        : process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminHash) {
      return NextResponse.json(
        { ok: false, error: "Admin não configurado no ambiente" },
        { status: 500 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Informe email e senha" },
        { status: 400 }
      );
    }
    // valida email
    if (
      String(email).toLowerCase().trim() !==
      String(adminEmail).toLowerCase().trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // valida senha
    const ok = bcrypt.compareSync(String(password), String(adminHash));
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const token = await signSession({ email: String(email).toLowerCase().trim() });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro no login" },
      { status: 500 }
    );
  }
}
