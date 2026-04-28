"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";

export default function OrderRow({ order }: { order: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Safe JSON Parse
  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  } catch(e) {}

  const handleDelete = async () => {
    if (!window.confirm("Are you entirely sure you want to permanently delete this order?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/orders/" + order.id, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh(); // Automatically triggers Server Component to fetch updated ledger
    } catch (e) {
      alert("Failed to delete order data.");
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Order status updated successfully!");
      setIsOpen(false);
    } catch (e) {
      alert("Failed to update status.");
    } finally {
      setIsSaving(false);
    }
  };

  const statusColors: any = {
    'paid': 'bg-green-500/20 text-green-400 border-green-500/20',
    'failed': 'bg-red-500/20 text-red-400 border-red-500/20',
    'shipped': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
    'delivered': 'bg-purple-500/20 text-purple-400 border-purple-500/20',
    'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
  };

  const currentColor = statusColors[status] || statusColors['pending'];

  return (
    <>
      <tr className="hover:bg-white/[0.02] transition-colors group border-b border-white/5 last:border-0">
        <td className="p-6 text-white/70">
          {new Date(order.createdAt).toLocaleDateString('en-GB')}
        </td>
        <td className="p-6">
          <div className="text-white/90 font-medium font-mono text-sm">{order.razorpayOrderId}</div>
          <div className="text-white/40 text-xs mt-1">PayID: {order.paymentId || 'N/A'}</div>
        </td>
        <td className="p-6">
          <div className="text-white/90 font-medium">{order.customerName}</div>
          <div className="text-white/40 text-xs mt-1">{order.customerPhone}</div>
          <div className="text-white/40 text-xs truncate max-w-[200px]" title={order.shippingAddress}>{order.shippingAddress}</div>
        </td>
        <td className="p-6 text-white/90 font-semibold">
          ₹{order.amount}
        </td>
        <td className="p-6">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${currentColor}`}>
            {status.toUpperCase()}
          </span>
        </td>
        <td className="p-6 text-right">
           <div className="flex items-center justify-end gap-3">
             <button 
               onClick={() => setIsReceiptOpen(true)}
               className="text-emerald-400 hover:text-white font-medium text-sm transition-colors border border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full cursor-pointer"
             >
               Print KOT
             </button>
             <button 
               onClick={() => setIsOpen(true)}
               className="text-pinkCream hover:text-white font-medium text-sm transition-colors border border-pinkCream/30 hover:border-white px-4 py-2 rounded-full cursor-pointer"
             >
               View Details
             </button>
             <button 
               onClick={handleDelete}
               disabled={isDeleting}
               className="text-red-400 hover:text-red-300 font-medium transition-colors border border-red-500/20 hover:border-red-400 w-9 h-9 rounded-full cursor-pointer flex items-center justify-center disabled:opacity-50 hover:bg-red-500/10"
               title="Delete Order"
             >
               <Trash2 className="w-4 h-4" />
             </button>
           </div>
        </td>
      </tr>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                 <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-outfit font-bold text-white mb-2">Order Management</h2>
              <p className="text-white/50 font-poppins mb-6">Review the cart receipt and alter the delivery state.</p>

              <div className="grid grid-cols-2 gap-6 mb-8 mt-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Customer Details</h3>
                    <div className="text-white font-poppins space-y-1">
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-sm text-white/70">{order.customerEmail}</p>
                      <p className="text-sm text-white/70">{order.customerPhone}</p>
                      <p className="text-sm text-white/50 mt-2">{order.shippingAddress}</p>
                    </div>
                 </div>

                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Order Ledger</h3>
                    <div className="text-white font-mono text-sm space-y-2">
                       <p><span className="text-white/50">Receipt:</span> {order.id}</p>
                       <p><span className="text-white/50">RZP_ID:</span> {order.razorpayOrderId}</p>
                       <p><span className="text-white/50">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                       <p><span className="text-white/50">Net Amount:</span> <span className="font-bold text-emerald-400">₹{order.amount}</span></p>
                    </div>
                 </div>
              </div>

              {/* Items */}
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Cart Manifest</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
                 {items.length > 0 ? items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 border-b border-white/5 last:border-0">
                       <span className="text-white font-poppins text-sm">{item.quantity}x {item.name || "Ice Cream"}</span>
                       <span className="text-white/70 font-mono text-sm">₹{item.price}</span>
                    </div>
                 )) : (
                    <div className="p-4 text-white/40 italic text-sm text-center">No precise item details captured.</div>
                 )}
              </div>

              {/* Status Updater */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                 <div className="flex items-center gap-4">
                    <span className="text-white/60 font-poppins font-semibold">Change Status:</span>
                    <select 
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="bg-black border border-white/20 text-white px-4 py-2 rounded-lg font-poppins focus:outline-none focus:border-pinkCream"
                    >
                       <option value="pending">Pending</option>
                       <option value="paid">Paid</option>
                       <option value="failed">Failed</option>
                       <option value="shipped">Shipped</option>
                       <option value="delivered">Delivered</option>
                    </select>
                 </div>
                 <button 
                   onClick={handleStatusUpdate}
                   disabled={isSaving || status === order.status}
                   className="bg-pinkCream text-black font-bold font-poppins px-6 py-2 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(255,192,203,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isSaving ? "Updating..." : "Save State"}
                 </button>
              </div>

           </div>
        </div>
      )}

      {/* KOT RECEIPT PRINT MODAL */}
      {isReceiptOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
           
           <div className="bg-white text-black p-6 w-full max-w-sm rounded-[2rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto kot-print-zone">
              
              <div className="text-center border-b border-black/20 pb-4 mb-4">
                 <h2 className="text-2xl font-black font-mono tracking-tighter uppercase">AK Icecream</h2>
                 <p className="text-sm font-mono font-medium">Aashutosh Kothi</p>
                 <p className="text-xs font-mono text-black/60 mt-1">Order #{order.id.slice(-6).toUpperCase()}</p>
                 <p className="text-xs font-mono text-black/60">{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div className="mb-4">
                 <h3 className="font-mono text-sm font-bold border-b border-black/20 pb-1 mb-2 uppercase">Customer details</h3>
                 <p className="font-mono text-sm uppercase">{order.customerName}</p>
                 <p className="font-mono text-sm">{order.customerPhone}</p>
                 <div className="font-mono text-xs mt-1 text-black/80">{order.shippingAddress}</div>
              </div>
              
              <div className="flex-1 w-full border-b border-black/20 pb-4 mb-4">
                 <h3 className="font-mono text-sm font-bold border-b border-black/20 pb-1 mb-2 uppercase flex justify-between">
                    <span>Item</span>
                    <span>Amt</span>
                 </h3>
                 <div className="space-y-2">
                    {items.length > 0 ? items.map((item: any, idx: number) => {
                       const basePrice = Math.round(item.price / 1.05);
                       const lineTotal = item.price * item.quantity;
                       return (
                         <div key={idx} className="font-mono text-xs flex justify-between items-start">
                            <div className="pr-4">
                               <p className="font-bold uppercase">{item.quantity}x {item.name}</p>
                               <p className="opacity-60">{item.size}</p>
                            </div>
                            <span className="font-bold">₹{lineTotal}</span>
                         </div>
                       )
                    }) : (
                       <div className="font-mono text-xs text-black/50">No structured items.</div>
                    )}
                 </div>
              </div>

              {(() => {
                 const baseAmountText = Math.round(order.amount / 1.05);
                 const totalGSTText = order.amount - baseAmountText;
                 return (
                   <div className="text-right font-mono text-sm space-y-1 mb-6 border-b border-black/20 pb-4">
                      <div className="flex justify-between">
                         <span className="uppercase opacity-80">Subtotal</span>
                         <span>₹{baseAmountText}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="uppercase opacity-80">5% GST</span>
                         <span>₹{totalGSTText}</span>
                      </div>
                      <div className="flex justify-between text-lg font-black uppercase mt-2 pt-2 border-t border-black/20">
                         <span>Total</span>
                         <span>₹{order.amount}</span>
                      </div>
                      <div className="text-center font-bold uppercase mt-4 text-xs opacity-70">
                         {order.paymentId === "cod" || order.razorpayOrderId?.startsWith("cod_") ? "PAYMENT DUE (COD)" : "PAID (RAZORPAY)"}
                      </div>
                   </div>
                 )
              })()}

              <div className="text-center font-mono text-[10px] opacity-70 uppercase mb-8 kot-hide-print">
                 End of receipt
              </div>

              {/* ACTION BUTTONS (NO PRINT) */}
              <div className="flex gap-3 kot-hide-print sticky bottom-0 bg-white pt-2 border-t border-black/10 mt-auto">
                 <button 
                   onClick={() => setIsReceiptOpen(false)}
                   className="flex-1 py-3 border border-black/20 text-black hover:bg-black/5 font-bold font-poppins rounded-xl transition-all uppercase text-sm"
                 >
                   Close
                 </button>
                 <button 
                   onClick={() => window.print()}
                   className="flex-1 py-3 bg-black text-white hover:bg-black/80 font-bold font-poppins rounded-xl shadow-lg transition-all uppercase text-sm"
                 >
                   Print KOT
                 </button>
              </div>

           </div>
        </div>
      )}
    </>
  );
}
