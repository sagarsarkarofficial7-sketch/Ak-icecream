import { prisma } from "@/lib/prisma"
import { ExportButton } from "@/components/admin/ExportButton"
import Link from "next/link"
import { ArrowLeft, IndianRupee, TrendingUp } from "lucide-react"

export default async function RevenueAnalyticsPage() {
  const orders = await prisma.order.findMany({
    where: { status: { in: ['paid', 'delivered', 'shipped'] } },
    orderBy: { createdAt: 'desc' }
  })

  const exportData = orders.map(o => ({
    "Order ID": o.id,
    "Date": o.createdAt.toLocaleDateString('en-IN'),
    "Time": o.createdAt.toLocaleTimeString('en-IN'),
    "Status": o.status.toUpperCase(),
    "Customer": o.customerName,
    "Total Revenue (₹)": o.amount
  }));

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin" className="text-neutral-500 hover:text-white flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
             <TrendingUp className="w-8 h-8 text-emerald-400" />
             Revenue Analytics
          </h1>
          <p className="text-neutral-400 mt-2">Comprehensive financial breakdown of all successful conversions.</p>
        </div>
        <ExportButton data={exportData} filename={`Revenue_Report_${new Date().toISOString().split('T')[0]}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-neutral-900 border border-emerald-500/20 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-emerald-500 text-sm font-semibold uppercase tracking-widest mb-1">Lifetime Revenue</p>
               <h2 className="text-3xl font-bold text-white tracking-tight">₹{totalRevenue.toFixed(2)}</h2>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-full">
               <IndianRupee className="w-8 h-8 text-emerald-500" />
            </div>
         </div>
         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-neutral-500 text-sm font-semibold uppercase tracking-widest mb-1">Total Sales</p>
               <h2 className="text-3xl font-bold text-white tracking-tight">{orders.length} Units</h2>
            </div>
         </div>
         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-neutral-500 text-sm font-semibold uppercase tracking-widest mb-1">Avg. Order Value</p>
               <h2 className="text-3xl font-bold text-white tracking-tight">
                  ₹{orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
               </h2>
            </div>
         </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-neutral-800">
            <h3 className="text-lg font-semibold text-white">Transaction History</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-neutral-950/50 text-neutral-400 border-b border-neutral-800">
                  <tr>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Date</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Order ID</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Customer</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {orders.map((o) => (
                     <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-medium">{o.createdAt.toLocaleDateString('en-IN')}</div>
                           <div className="text-xs text-neutral-500">{o.createdAt.toLocaleTimeString('en-IN')}</div>
                        </td>
                        <td className="px-6 py-4 text-neutral-400 font-mono text-xs">{o.id}</td>
                        <td className="px-6 py-4">{o.customerName}</td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                              {o.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-white">₹{o.amount.toFixed(2)}</td>
                     </tr>
                  ))}
                  {orders.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">No revenue data available yet.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
