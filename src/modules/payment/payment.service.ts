import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia" as any, // use current or matching API version
});

const createPaymentIntent = async (amount: number) => {
  if (!amount || amount <= 0) {
    const error: any = new Error("Invalid amount");
    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  // Convert to cents for Stripe
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};

const savePaymentInfo = async (payload: {
  amount: number;
  transactionId: string;
  status: string;
  userId: string;
  bookingId?: string;
}) => {
  const payment = await prisma.payment.create({
    data: {
      amount: payload.amount,
      currency: "usd",
      transactionId: payload.transactionId,
      status: payload.status,
      userId: payload.userId,
      ...(payload.bookingId !== undefined ? { bookingId: payload.bookingId } : {}),
    },
  });

  return payment;
};

const getPaymentHistory = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      booking: true
    }
  });
  return payments;
};

export const PaymentService = {
  createPaymentIntent,
  savePaymentInfo,
  getPaymentHistory,
};
