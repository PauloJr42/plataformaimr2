import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function serializeCookie(
  name: string,
  value: string,
  opts: {
    maxAge?: number;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(opts.maxAge)}`);
  if (opts.path) parts.push(`Path=${opts.path}`);
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  return parts.join("; ");
}

export async function POST(req: Request) {
  try {
    const { email, password, password_hash } = await req.json();

    if (!email || (!password && !password_hash)) {
      console.log("[auth/login] missing credentials", {
        emailProvided: !!email,
        passwordProvided: !!password,
        passwordHashProvided: !!password_hash,
      });
      return NextResponse.json(
        { error: "email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("users_custom")
      .select("id, email, password_hash, status")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.log("[auth/login] user lookup failed", { email, error: error ?? "not found" });
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 401 });
    }

    // Normaliza valores
    const storedRaw = (user.password_hash ?? "") as unknown;
    const stored =
      typeof storedRaw === "string" ? storedRaw.trim() : String(storedRaw || "");
    const providedPlain = typeof password === "string" ? password.trim() : "";
    const providedHash =
      typeof password_hash === "string" ? password_hash.trim() : "";

    let valid = false;

    // Caso o banco tenha hash bcrypt ($2a/$2b/$2y...)
    if (stored && stored.startsWith("$2")) {
      if (providedPlain) {
        valid = await bcrypt.compare(providedPlain, stored);
      } else if (providedHash) {
        // fallback: se o cliente enviou o hash (não recomendado), compara igualdade
        valid = providedHash === stored;
      }
    } else if (stored) {
      // banco armazena senha em texto ou outro formato: comparar igualdade como fallback
      if (providedPlain) valid = providedPlain === stored;
      else if (providedHash) valid = providedHash === stored;
    }

    if (!valid) {
      console.log("[auth/login] invalid credentials", {
        email,
        storedExists: !!stored,
        storedPrefix: stored ? stored.slice(0, 4) : null,
        providedPlain: !!providedPlain,
        providedHash: !!providedHash,
      });
      return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
    }

    if (user.status === "pending" || user.status === "inactive") {
      console.log("[auth/login] account not verified/active", {
        email,
        status: user.status,
      });
      return NextResponse.json({ error: "Conta não verificada ou inativa." }, { status: 403 });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const cookieName = process.env.TOKEN_NAME || "imr_session";
    const secure = process.env.NODE_ENV === "production";
    const serialized = serializeCookie(cookieName, token, {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      httpOnly: true,
      secure,
      sameSite: "Lax",  // PERMITE redirecionamento externo (Stripe → seu site)
    });

    console.log("[auth/login] success", { email, userId: user.id });

    const response = NextResponse.json({
      ok: true,
      id: user.id,
      message: "Login efetuado com sucesso.",
    });
    response.headers.append("Set-Cookie", serialized);
    return response;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}