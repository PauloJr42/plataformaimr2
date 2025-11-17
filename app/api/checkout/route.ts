// app/api/checkout/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get(process.env.TOKEN_NAME!)?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return new Response("Invalid token", { status: 401 });
    }

    const userId = payload.sub;

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return new Response("Missing productId", { status: 400 });
    }

    // Buscar produto
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (!product) {
      return new Response("Product not found", { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100, // centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      metadata: {
        userId,
        productId: productId.toString(),
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
