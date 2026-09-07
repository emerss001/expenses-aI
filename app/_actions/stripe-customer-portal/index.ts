"use server";

import { env } from "@/app/_lib/env";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripePortal = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // Busca o usuário no Clerk para pegar o stripeCustomerId que o webhook salvou
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const stripeCustomerId = user.privateMetadata.stripeCustomerId as string;

  if (!stripeCustomerId) {
    throw new Error("Usuário não é um cliente do Stripe ainda.");
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia", // Use a mesma versão que está usando no checkout
  });

  // Cria a sessão de acesso ao portal do cliente
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: "http://localhost:3000", // Para onde o usuário volta ao sair do portal
    configuration: env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL,
  });

  return { portalUrl: portalSession.url };
};
