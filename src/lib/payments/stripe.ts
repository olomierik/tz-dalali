import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27-acacia' as any,
});

export async function createStripeConnectAccount(email: string) {
  return await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
}

export async function createStripePaymentIntent(amount: number, currency: string, accountId: string) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    application_fee_amount: Math.round(amount * 0.05 * 100), // 5% fee
    transfer_data: {
      destination: accountId,
    },
  });
}
