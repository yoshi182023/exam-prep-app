// src/services/stripeService.ts
import { Stripe } from 'stripe';

// Type definitions
interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

interface PaymentVerificationResult {
  status: Stripe.PaymentIntent.Status;
  amount: number;
  currency: string;
  customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null;
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const StripeService = {
  /**
   * Creates a new payment intent
   * @param email - Customer email for receipt
   * @param amount - Amount in smallest currency unit (e.g., cents)
   * @param currency - Three-letter ISO currency code
   */
  async createPaymentIntent(
    email: string,
    amount = 1000, // $10.00 in cents
    currency = 'usd'
  ): Promise<PaymentIntentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        receipt_email: email,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          service: 'user-registration',
        },
      });

      if (!paymentIntent.client_secret) {
        throw new Error(
          'Failed to create payment intent: missing client secret'
        );
      }

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  },

  /**
   * Verifies a payment intent status
   * @param paymentIntentId - The Stripe payment intent ID
   */
  async verifyPayment(
    paymentIntentId: string
  ): Promise<PaymentVerificationResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        customer: paymentIntent.customer,
      };
    } catch (error) {
      console.error('Stripe payment verification error:', error);
      throw new Error('Payment verification failed');
    }
  },

  /**
   * Refunds a payment
   * @param paymentIntentId - The Stripe payment intent ID
   * @param reason - Reason for refund
   */
  async refundPayment(
    paymentIntentId: string,
    reason = 'requested_by_customer'
  ): Promise<void> {
    try {
      await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason,
      });
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw new Error('Refund failed');
    }
  },
};

export type { PaymentIntentResult, PaymentVerificationResult };
