import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const settingsDoc = await prisma.pageContent.findUnique({
    where: { pageSlug: 'payment-settings' }
  });

  const rawData = settingsDoc?.content
    ? JSON.parse(settingsDoc.content)
    : { razorpayKeyId: "", razorpaySecretKey: "", isTestMode: true };

  return <SettingsClient initialData={rawData} />;
}
