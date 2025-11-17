// ...existing code...
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function serializeCookie(name: string, value: string, opts: { maxAge?: number; path?: string; httpOnly?: boolean; secure?: boolean; sameSite?: "Strict" | "Lax" | "None" } = {}) {
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
    const { name, email, phone, password_hash } = await req.json();

    if (!name || !email || !phone || !password_hash) {
      return NextResponse.json(
        { error: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!/^\d{10,14}$/.test(phone)) {
      return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("users_custom")
      .select("id, is_verified")
      .eq("email", email)
      .single();

    if (existing && existing.is_verified) {
      return NextResponse.json(
        { error: "Este email já está cadastrado." },
        { status: 400 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { data: user, error: upsertError } = await supabase
      .from("users_custom")
      .upsert(
        {
          email,
          name,
          phone,
          password_hash,
          verification_code: code,
          status: false,
          created_at: new Date(),
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (upsertError) {
      console.error(upsertError);
      return NextResponse.json(
        { error: "Erro ao registrar usuário" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        pending: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );

    // Substitui cookies().set(...) por Set-Cookie no response
    const cookieName = process.env.TOKEN_NAME || "imr_session";
    const secure = process.env.NODE_ENV === "production";
    const serialized = serializeCookie(cookieName, token, {
      maxAge: 300,
      path: "/",
      httpOnly: true,
      secure,
      sameSite:"None",  // PERMITE redirecionamento externo (Stripe → seu site),
    });

    // 📌 Enviar email (placeholder — depois conectamos ao Resend)
    console.log("Código enviado ao email:", code);

    const response = NextResponse.json({
      message: "Usuário criado. Código enviado ao email.",
      
    });
    response.headers.append("Set-Cookie", serialized);
    return response;
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
// ...existing code...