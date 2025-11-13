import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Dados incompletos." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // busca o usuário
    const { data: user, error } = await supabase
      .from("users_custom")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (user.status === "active") {
      return NextResponse.json({ error: "Conta já verificada!" }, { status: 400 });
    }

    if (user.verification_code !== code) {
      return NextResponse.json({ error: "Código incorreto." }, { status: 400 });
    }

    // Atualiza status e remove o código
    const { error: updateError } = await supabase
      .from("users_custom")
      .update({
        status: "active",
        verification_code: null
      })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json(
        { error: "Erro ao atualizar usuário." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Conta verificada com sucesso!"
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
