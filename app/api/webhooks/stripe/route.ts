import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Erro de verificação Stripe:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("💰 Pagamento confirmado:", session.id);

      // Salva no banco
      const { error } = await supabaseAdmin.from("purchases").insert({
        user_id: session.client_reference_id,
        product_id: session.metadata?.productId,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: "paid",
      });

      if (error) {
        console.error("Erro ao salvar compra:", error.message);
        return NextResponse.json({ error: "DB insert error" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Erro interno no webhook:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
