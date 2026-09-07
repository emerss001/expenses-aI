"use server";

import { env } from "@/app/_lib/env";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckout = async (priceId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "boleto"],
    mode: "subscription",
    success_url: "http://localhost:3000/subscription?success=true",
    cancel_url: "http://localhost:3000/subscription?canceled=true",
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  return { sessionUrl: session.url };
};
