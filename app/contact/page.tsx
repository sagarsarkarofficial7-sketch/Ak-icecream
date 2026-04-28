import { prisma } from "@/lib/prisma";
import ContactClientLayout from "./ContactClientLayout";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [contentDoc, stores] = await Promise.all([
    prisma.pageContent.findUnique({ where: { pageSlug: 'contact' } }),
    prisma.storeLocation.findMany({ orderBy: { createdAt: 'asc' } })
  ])

  let contactData = {}
  if (contentDoc && contentDoc.content !== "{}") {
    contactData = JSON.parse(contentDoc.content)
  }

  return <ContactClientLayout contactData={contactData} stores={stores} />
}
