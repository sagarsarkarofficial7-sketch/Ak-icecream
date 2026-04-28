import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required signature components" }, { status: 400 });
    }

    // Attempt to load explicit admin configuration
    const settingsDoc = await prisma.pageContent.findUnique({ where: { pageSlug: 'payment-settings' } });
    let secret = process.env.RAZORPAY_KEY_SECRET!;
    
    if (settingsDoc?.content) {
      const config = JSON.parse(settingsDoc.content);
      if (config.razorpaySecretKey) {
        secret = config.razorpaySecretKey;
      }
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await prisma.order.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          paymentId: razorpay_payment_id,
          status: "paid"
        }
      });
      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      await prisma.order.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: "failed"
        }
      });
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Payment Verification Error:", err);
    return NextResponse.json({ error: "Internal Verification Error" }, { status: 500 });
  }
}
