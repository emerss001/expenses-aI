"use server";

import { env } from "@/app/_lib/env";
import { ActionError, runAction } from "@/app/_lib/action-result";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripePortal = async () =>
  runAction(async () => {
    const { userId } = await auth();
    if (!userId) {
      throw new ActionError(
        "Sua sessão expirou. Entre novamente para continuar.",
      );
    }

    // Busca o usuário no Clerk para pegar o stripeCustomerId que o webhook salvou
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const stripeCustomerId = user.privateMetadata.stripeCustomerId as string;

    if (!stripeCustomerId) {
      throw new ActionError(
        "Você ainda não possui uma assinatura para gerenciar.",
      );
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });

    // Cria a sessão de acesso ao portal do cliente
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: env.APP_URL, // Para onde o usuário volta ao sair do portal
      configuration: env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL,
    });

    return { portalUrl: portalSession.url };
  });
