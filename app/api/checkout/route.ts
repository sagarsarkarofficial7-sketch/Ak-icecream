import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { amount, items, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod } = data;

    // Load Dynamic Settings Native from DB
    const settingsDoc = await prisma.pageContent.findUnique({ where: { pageSlug: 'payment-settings' } });
    let key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
    let key_secret = process.env.RAZORPAY_KEY_SECRET!;

    if (settingsDoc?.content) {
      const config = JSON.parse(settingsDoc.content);
      if (config.razorpayKeyId && config.razorpaySecretKey) {
        key_id = config.razorpayKeyId;
        key_secret = config.razorpaySecretKey;
      }
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // COD Logic Bypass Hook
    if (paymentMethod === 'cod') {
      const isCodEnabled = settingsDoc?.content ? JSON.parse(settingsDoc.content).codEnabled : false;
      
      if (!isCodEnabled) {
         return NextResponse.json({ error: "Cash on delivery is currently deactivated." }, { status: 400 });
      }

      // Generate a mock unique proxy for schema conformity
      const codMockId = `cod_ak_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const newOrder = await prisma.order.create({
        data: {
          razorpayOrderId: codMockId,
          amount: amount,
          status: "pending", 
          customerName: customerName || "Guest User",
          customerEmail: customerEmail || "guest@example.com",
          customerPhone: customerPhone || "9999999999",
          shippingAddress: shippingAddress || "Pending Address",
          items: JSON.stringify(items || []),
        }
      });
      
      return NextResponse.json({
         success: true,
         mode: 'cod',
         dbOrderId: newOrder.id
      });
    }

    // Razorpay expects the amount in subunits (paise for INR)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save pending order to DB
    const newOrder = await prisma.order.create({
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: amount,
        status: "pending",
        customerName: customerName || "Guest User",
        customerEmail: customerEmail || "guest@example.com",
        customerPhone: customerPhone || "9999999999",
        shippingAddress: shippingAddress || "Pending Address",
        items: JSON.stringify(items || []),
      }
    });

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      dbOrderId: newOrder.id,
      key_id: key_id // Securely pass the active dynamic client ID to CartDrawer
    });
  } catch (err: any) {
    console.error("Checkout API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
