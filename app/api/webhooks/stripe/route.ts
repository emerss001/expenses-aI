import { env } from "@/app/_lib/env";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { SUBSCRIPTION_PLANS } from "@/app/_utils/subscription-plan";

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;

      // Captura o ID do cliente e da assinatura
      const customer = invoice.customer as string;
      const subscription = invoice.subscription as string;

      const clerkUserId = invoice.subscription_details?.metadata?.clerk_user_id;

      if (!clerkUserId) {
        return NextResponse.json(
          { error: "User ID not found" },
          { status: 400 },
        );
      }

      // Captura o ID do preço pago nesta fatura
      const priceId = invoice.lines.data[0]?.price?.id;

      // Define qual plano foi assinado baseado no priceId
      let plan = null;
      if (priceId === env.STRIPE_PREMIUM_PRICE_MONTHLY_ID) {
        plan = SUBSCRIPTION_PLANS.MONTHLY;
      } else if (priceId === env.STRIPE_PREMIUM_PRICE_YEARLY_ID) {
        plan = SUBSCRIPTION_PLANS.YEARLY;
      } else if (priceId === env.STRIPE_TEST_PRICE_ID) {
        plan = SUBSCRIPTION_PLANS.TEST;
      }

      const client = await clerkClient();
      await client.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
        },
        publicMetadata: {
          subscriptionPlan: plan,
        },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerk_user_id;

      if (clerkUserId) {
        const client = await clerkClient();
        await client.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: null,
            stripeSubscriptionId: null,
          },
          publicMetadata: {
            subscriptionPlan: null,
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
};
