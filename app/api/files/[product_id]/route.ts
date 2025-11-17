import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
//atualizado!
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ product_id: string }> }
) {
  try {
    const { product_id } = await context.params;

    const token = (await cookies()).get(process.env.TOKEN_NAME!)?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return new Response("Invalid token", { status: 401 });
    }

    const userId = payload.sub;

    // verificar compra
    const { data: purchase, error: purchaseErr } = await supabaseAdmin
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", product_id)
      .eq("status", "paid")
      .maybeSingle();

    if (!purchase) return new Response("Forbidden", { status: 403 });

    // pegar produto
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("file_path")
      .eq("id", product_id)
      .maybeSingle();

    if (!product || !product.file_path) {
      return new Response("File not found", { status: 404 });
    }

    // gerar URL assinada
    const { data: signed } = await supabaseAdmin.storage
      .from("private")
      .createSignedUrl(product.file_path, 60);

    if (!signed || !signed.signedUrl)
      return new Response("Error generating file", { status: 500 });

    // baixar sem expor URL ao cliente (stream)
    const fileRes = await fetch(signed.signedUrl);

    const blob = await fileRes.blob();

    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${product.file_path}"`,
      },
    });
  } catch (err) {
    console.error("FILE DOWNLOAD ERROR:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
