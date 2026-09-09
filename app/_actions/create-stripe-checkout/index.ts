"use server";

import { env } from "@/app/_lib/env";
import { ActionError, runAction } from "@/app/_lib/action-result";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckout = async (priceId?: string) =>
  runAction(async () => {
    const { userId } = await auth();
    if (!userId) {
      throw new ActionError(
        "Sua sessão expirou. Entre novamente para continuar.",
      );
    }

    if (!priceId) {
      throw new ActionError(
        "Este plano está indisponível no momento. Tente novamente mais tarde.",
      );
    }

    // cliente que o webhook ja registrou em assinaturas anteriores
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const stripeCustomerId = user.privateMetadata.stripeCustomerId as
      | string
      | undefined;

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      mode: "subscription",
      // sem reaproveitar o cliente, cada assinatura cria um cadastro novo no
      // Stripe e o historico anterior fica orfao
      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
      success_url: `${env.APP_URL}/subscription?success=true`,
      cancel_url: `${env.APP_URL}/subscription?canceled=true`,
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

    if (!session.url) {
      throw new ActionError(
        "Não foi possível abrir a página de pagamento. Tente novamente em instantes.",
      );
    }

    return { sessionUrl: session.url };
  });
