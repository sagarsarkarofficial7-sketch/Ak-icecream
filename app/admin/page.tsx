import { prisma } from "@/lib/prisma"
import { Package, ShoppingCart, Users, IndianRupee, ArrowRight } from "lucide-react"
import Link from "next/link"
import { DashboardCharts } from "@/components/admin/DashboardCharts"

export default async function AdminDashboardPage() {
  const productCount = await prisma.product.count()
  const orderCount = await prisma.order.count()
  const userCount = await prisma.user.count()

  const revenueAgg = await prisma.order.aggregate({
    _sum: { amount: true },
    where: { status: { in: ['paid', 'delivered', 'shipped'] } }
  })
  const totalRevenue = revenueAgg._sum.amount || 0;

  const stats = [
    { name: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/admin/analytics/revenue' },
    { name: 'Total Orders', value: orderCount.toString(), icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/admin/analytics/orders' },
    { name: 'Products', value: productCount.toString(), icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10', href: '/admin/products' },
    { name: 'Admin Users', value: userCount.toString(), icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10', href: '/admin' },
  ]

  // All-Time Transaction visualization logic
  const allOrders = await prisma.order.findMany({
    where: { 
      status: { in: ['paid', 'delivered', 'shipped'] }
    },
    orderBy: { createdAt: 'asc' }
  });

  const chartData = allOrders.map((o, index) => {
      const dateStr = o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
          name: "Order #" + (index + 1) + " (" + dateStr + ")",
          Revenue: o.amount
      }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-neutral-400 mt-2">Welcome to the AK Icecream administration panel.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="group overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-sm hover:border-neutral-700 hover:bg-neutral-800/50 transition-all flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-600 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" />
            </div>
            
            <dl>
              <dt className="truncate text-sm font-medium text-neutral-400 mb-1">{stat.name}</dt>
              <dd className="text-2xl font-semibold text-white">{stat.value}</dd>
            </dl>
          </Link>
        ))}
      </div>

      <DashboardCharts data={chartData} />
    </div>
  )
}
