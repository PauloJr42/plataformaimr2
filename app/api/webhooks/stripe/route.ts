import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("✅ EVENT RECEBIDO:", event.type);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ Erro webhook:", err.message);
    return new NextResponse("Webhook error", { status: 400 });
  }
}
