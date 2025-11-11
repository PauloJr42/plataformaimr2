import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    const supabase = await createServerSupabaseClient();

    // Pega usuário logado (se existir)
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user ?? null;

    // Busca o produto
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Criação da sessão Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      metadata: {
        productId: product.id,
      },

      client_reference_id: user?.id ?? undefined,

      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.title,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
