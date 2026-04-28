"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

export function DashboardCharts({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-neutral-500 font-poppins text-sm tracking-wide">Insufficient Data for Visualizations</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-sm min-h-[450px] flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold font-outfit text-white tracking-widest">Revenue Analytics</h2>
        <p className="text-xs font-poppins text-emerald-500 uppercase font-semibold mt-1">All-Time Transactions</p>
      </div>

      <div className="flex-1 w-full h-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#525252" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#525252" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `₹${value}`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '0.5rem', filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' }}
              itemStyle={{ color: '#10b981', fontWeight: 600, fontFamily: 'sans-serif' }}
              labelStyle={{ color: '#a3a3a3', marginBottom: '0.25rem' }}
              cursor={{ stroke: '#262626', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="Revenue" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
