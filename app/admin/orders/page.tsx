import { prisma } from "@/lib/prisma";
import OrderRow from "@/components/admin/OrderRow";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-white mb-2">Order Fulfillment</h1>
          <p className="text-white/50 font-poppins">Manage and process customer transactions captured via Razorpay.</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 font-outfit text-white/50 text-sm tracking-wider uppercase">
                <th className="p-6 font-semibold">Date</th>
                <th className="p-6 font-semibold">Order ID</th>
                <th className="p-6 font-semibold">Customer</th>
                <th className="p-6 font-semibold">Net Total</th>
                <th className="p-6 font-semibold">Status</th>
                <th className="p-6 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-poppins">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40 italic">
                    No orders captured yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
