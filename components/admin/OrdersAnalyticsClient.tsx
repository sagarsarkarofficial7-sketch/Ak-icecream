"use client"
import { useState, useMemo } from 'react'
import { ExportButton } from '@/components/admin/ExportButton'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Filter, Calendar } from 'lucide-react'

export function OrdersAnalyticsClient({ initialOrders }: { initialOrders: any[] }) {
  const [filterYear, setFilterYear] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const filteredOrders = useMemo(() => {
     return initialOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        
        if (filterYear !== 'All' && orderDate.getFullYear().toString() !== filterYear) return false;
        if (filterMonth !== 'All' && (orderDate.getMonth() + 1).toString() !== filterMonth) return false;
        
        if (filterDate) {
           const matchDate = new Date(filterDate);
           if (orderDate.toDateString() !== matchDate.toDateString()) return false;
        }

        return true;
     })
  }, [initialOrders, filterYear, filterMonth, filterDate]);

  const availableYears = Array.from(new Set(initialOrders.map(o => new Date(o.createdAt).getFullYear().toString()))).sort().reverse();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const exportData = filteredOrders.map(o => {
     let totalQty = 0;
     try {
       const items = JSON.parse(o.items || "[]");
       totalQty = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
     } catch (e) {}

     return {
        "Order ID": o.id,
        "Date": new Date(o.createdAt).toLocaleDateString('en-IN'),
        "Time": new Date(o.createdAt).toLocaleTimeString('en-IN'),
        "Customer Name": o.customerName,
        "Email ID": o.customerEmail,
        "Phone": o.customerPhone,
        "Tracking Status": o.status.toUpperCase(),
        "Total Quantity Supplied": totalQty,
        "Net Amount Received (₹)": o.amount
     }
  });

  return (
    <div className="space-y-8">
      {/* Header Overlay */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin" className="text-neutral-500 hover:text-white flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
             <ShoppingCart className="w-8 h-8 text-blue-400" />
             Orders Analytical Engine
          </h1>
          <p className="text-neutral-400 mt-2">Aggregate tracking view parsing historical purchase volumes mapped alongside real-time Excel extractions.</p>
        </div>
        <ExportButton data={exportData} filename={`Order_Aggregate_${new Date().toISOString().split('T')[0]}`} />
      </div>

      {/* Interactive Filtering Bay */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-end">
         
         <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase flex items-center gap-2 tracking-widest">
               <Calendar className="w-4 h-4 text-blue-500" /> Exact Timestamp
            </label>
            <input 
               type="date" 
               value={filterDate} 
               onChange={(e) => { setFilterDate(e.target.value); setFilterMonth('All'); setFilterYear('All'); }}
               className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
         </div>

         <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Filter By Month</label>
            <select 
               value={filterMonth} 
               onChange={(e) => { setFilterMonth(e.target.value); setFilterDate(''); }}
               className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
               <option value="All">All Months (Lifetime)</option>
               {months.map((m, i) => (
                  <option key={m} value={(i + 1).toString()}>{m}</option>
               ))}
            </select>
         </div>

         <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Filter By Year</label>
            <select 
               value={filterYear} 
               onChange={(e) => { setFilterYear(e.target.value); setFilterDate(''); }}
               className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
               <option value="All">All Years (Lifetime)</option>
               {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
               ))}
            </select>
         </div>

         <button 
            onClick={() => { setFilterDate(''); setFilterMonth('All'); setFilterYear('All'); }}
            className="w-full md:w-auto px-6 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium border border-neutral-700 transition-colors flex items-center justify-center gap-2"
         >
            <Filter className="w-4 h-4 text-neutral-400" /> Clear
         </button>
      </div>

      {/* Summary KPI */}
      <div className="flex items-center gap-4 text-sm text-neutral-400">
         <span className="font-semibold text-blue-400">{filteredOrders.length}</span> matching order records found in matrix.
      </div>

      {/* Aggregate Output Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-[#0f0f0f] text-neutral-400 border-b border-neutral-800">
                  <tr>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Date</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Order ID</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Customer</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-center">Net Qty</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                     <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Revenue</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {filteredOrders.map(o => {
                     let qty = 0;
                     try {
                        const items = JSON.parse(o.items || "[]");
                        qty = items.reduce((acc: number, curr: any) => acc + (curr.quantity || 1), 0);
                     } catch(e) {}

                     return (
                        <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                           <td className="px-6 py-4">
                              <div className="font-medium text-white">{new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                              <div className="text-xs text-neutral-500">{new Date(o.createdAt).toLocaleTimeString('en-IN')}</div>
                           </td>
                           <td className="px-6 py-4 text-neutral-500 font-mono text-xs">{o.id}</td>
                           <td className="px-6 py-4">
                              <div className="text-white font-medium">{o.customerName}</div>
                              <div className="text-neutral-500 text-xs">{o.customerEmail}</div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-neutral-800 font-bold text-blue-400 border border-neutral-700">
                                 {qty}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                 o.status === "failed" ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                                 o.status === "pending" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                 "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              }`}>
                                 {o.status.toUpperCase()}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right font-semibold text-white">₹{o.amount.toFixed(2)}</td>
                        </tr>
                     )
                  })}
                  
                  {filteredOrders.length === 0 && (
                     <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-neutral-500">
                           No orders matched your active date filters.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
      
    </div>
  )
}
