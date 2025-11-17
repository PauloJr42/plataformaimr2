//app/api/files/[product_id]/route.ts
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { product_id: string } }
) {
  try {
    // 1. Pegar cookie JWT
    const token = (cookies()).get(process.env.TOKEN_NAME!)?.value;
    if (!token) {
      return new Response("Not authenticated", { status: 401 });
    }

    // 2. Verificar JWT
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return new Response("Invalid token", { status: 401 });
    }

    const userId = payload.sub as string;

    // 3. Verificar compra do usuário
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", params.product_id)
      .eq("status", "paid")
      .maybeSingle();

    if (purchaseError) {
      console.error("[ERROR] purchase lookup:", purchaseError);
      return new Response("Error checking purchase", { status: 500 });
    }

    if (!purchase) {
      return new Response("Access denied", { status: 403 });
    }

    // 4. Buscar file_path do produto
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("file_path")
      .eq("id", params.product_id)
      .maybeSingle();

    if (productError) {
      console.error("[ERROR] product lookup:", productError);
      return new Response("Error checking product", { status: 500 });
    }

    if (!product?.file_path) {
      return new Response("File not found", { status: 404 });
    }

    const filePath = product.file_path;
    const fileName = filePath.split("/").pop() ?? "download";

    // 5. Baixar arquivo diretamente do Supabase Storage
    const { data: file, error: storageError } = await supabaseAdmin.storage
      .from("private")
      .download(filePath);

    if (storageError || !file) {
      console.error("[ERROR] file download:", storageError);
      return new Response("Could not download file", { status: 500 });
    }

    // 6. Converter para ArrayBuffer para enviar ao usuário
    const buffer = await file.arrayBuffer();

    // 7. Enviar arquivo binário sem expor URL
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
