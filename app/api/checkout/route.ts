import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Inicializa o Stripe com a chave secreta do ambiente
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

// Inicializa o Supabase com as variáveis do ambiente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Este endpoint é chamado quando o usuário inicia o checkout.
 * Ele cria uma sessão de pagamento no Stripe com base no produto do Supabase.
 */
export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "productId é obrigatório" }, { status: 400 });
    }

    // Busca o produto no Supabase
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Cria uma sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Erro no checkout:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
