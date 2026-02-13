import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "ns_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  return new TextEncoder().encode(secret || "");
}

async function isAuthed(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // liberar login e rotas públicas
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // proteger API admin
  if (pathname.startsWith("/api/admin")) {
    const ok = await isAuthed(req);
    if (!ok) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
    return NextResponse.next();
  }

  // proteger páginas admin
  if (pathname.startsWith("/admin")) {
    const ok = await isAuthed(req);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
