// app/api/webhook/route.ts
import Stripe from "stripe";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "edge"; // Stripe exige performance

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("WEBHOOK SIGNATURE ERROR:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;

    if (!userId || !productId) {
      console.error("Missing metadata in checkout session");
      return new Response("Metadata missing", { status: 400 });
    }

    // Registrar compra
    await supabaseAdmin.from("purchases").insert({
      user_id: userId,
      product_id: productId,
      stripe_session_id: session.id,
      amount: session.amount_total! / 100,
      status: "paid",
    });
  }

  return new Response("OK", { status: 200 });
}
