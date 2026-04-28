import { prisma } from "@/lib/prisma"
import { OrdersAnalyticsClient } from "@/components/admin/OrdersAnalyticsClient"

export default async function OrdersAnalyticsPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // We serialize dates so Client Components don't crash from complex Date objects during SSR
  const serializedOrders = orders.map(o => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }))

  return <OrdersAnalyticsClient initialOrders={serializedOrders} />
}
