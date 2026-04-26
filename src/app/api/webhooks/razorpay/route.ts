import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";
import { Tier } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return new NextResponse("No signature", { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Webhook event received:", event.event);

    // We listen for order.paid which is triggered when a payment is successful for an order
    if (event.event === "order.paid") {
      const order = event.payload.order.entity;
      const { userId, tier } = order.notes;

      if (userId && tier) {
        const payment = await db.payment.findUnique({
          where: { razorpayOrderId: order.id },
        });

        if (payment && payment.status !== "completed") {
          let tokens = 50;
          if (tier === "PRO") {
            tokens = 250;
          } else if (tier === "ENTERPRISE") {
            tokens = 1000;
          }

          await db.$transaction([
            db.user.update({
              where: { clerkId: userId },
              data: {
                tier: tier as Tier,
                tokens: { increment: tokens },
              },
            }),
            db.payment.update({
              where: { id: payment.id },
              data: { status: "completed" },
            }),
          ]);

          console.log(
            `Webhook: Successfully upgraded user ${userId} to ${tier}`,
          );
        } else {
          console.log(
            `Webhook: Order ${order.id} already processed or not found`,
          );
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
