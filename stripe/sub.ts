import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20"
});

export async function POST(req: Request) {
  const { userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "AI SaaS Pro"
          },
          unit_amount: 2199,
          recurring: {
            interval: "month"
          }
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/chat`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing`
  });

  return NextResponse.json({ url: session.url });
}