import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settingsDoc = await prisma.pageContent.findUnique({
      where: { pageSlug: 'payment-settings' }
    });
    
    let codEnabled = false;
    let rapidoLink = "";
    let uberEatsLink = "";

    if (settingsDoc?.content) {
      const config = JSON.parse(settingsDoc.content);
      // Explicitly only leak the cod field. Never return the config block directly.
      if (typeof config.codEnabled === 'boolean') {
        codEnabled = config.codEnabled;
      }
      if (config.rapidoLink) {
        rapidoLink = config.rapidoLink;
      }
      if (config.uberEatsLink) {
        uberEatsLink = config.uberEatsLink;
      }
    }

    return NextResponse.json({ codEnabled, rapidoLink, uberEatsLink });
  } catch (error) {
    console.error("Checkout methods API error:", error);
    // Assume secure defaults (false) on crash
    return NextResponse.json({ codEnabled: false, rapidoLink: "", uberEatsLink: "" });
  }
}
