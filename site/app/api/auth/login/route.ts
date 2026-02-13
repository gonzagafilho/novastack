import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signSession, setSessionCookie } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
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
