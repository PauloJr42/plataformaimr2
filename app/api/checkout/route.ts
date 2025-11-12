import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    console.log("🟢 [API] Iniciando checkout para o produto:", productId);

    const supabase = await createServerSupabaseClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("❌ [Supabase error]:", error.message);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!product) {
      console.warn("⚠️ [Produto não encontrado]:", productId);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("✅ [Produto encontrado]:", product);

    if (!process.env.NEXT_PUBLIC_URL) {
      console.error("❌ NEXT_PUBLIC_URL não definida!");
      return NextResponse.json({ error: "Config error: URL missing" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: product.title },
            unit_amount: product.price, // preço deve estar em centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    console.log("✅ [Stripe checkout criado]:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ [Checkout error]:", error.message || error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
