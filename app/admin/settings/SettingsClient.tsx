"use client";

import { useState } from "react";

export default function SettingsClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug: "payment-settings",
          content: JSON.stringify(data)
        })
      });
      if (res.ok) {
        alert("Payment settings securely updated!");
      } else {
        alert("Failed to update payment settings");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-outfit font-bold text-white mb-2">Platform Settings</h1>
            <p className="text-white/50 font-poppins">Manage sensitive application secrets and system-wide configurations.</p>
         </div>
      </div>

      <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Decorator */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pinkCream/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

        <h2 className="text-2xl font-outfit font-bold text-white mb-6">Razorpay Gateway</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 w-max cursor-pointer" onClick={() => setData({...data, isTestMode: !data.isTestMode})}>
             <div className={`w-12 h-6 rounded-full transition-colors relative ${data.isTestMode ? 'bg-yellow-500/50' : 'bg-emerald-500/50'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data.isTestMode ? 'left-1' : 'left-7'}`}></div>
             </div>
             <span className={`font-poppins font-medium ${data.isTestMode ? 'text-yellow-400' : 'text-emerald-400'}`}>
               {data.isTestMode ? "Test Mode Active" : "Live Production Active"}
             </span>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 w-max cursor-pointer" onClick={() => setData({...data, codEnabled: !data.codEnabled})}>
             <div className={`w-12 h-6 rounded-full transition-colors relative ${data.codEnabled ? 'bg-emerald-500/50' : 'bg-neutral-600/50'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data.codEnabled ? 'left-7' : 'left-1'}`}></div>
             </div>
             <span className={`font-poppins font-medium ${data.codEnabled ? 'text-emerald-400' : 'text-neutral-400'}`}>
               {data.codEnabled ? "Cash on Delivery Available" : "Cash on Delivery Disabled"}
             </span>
          </div>

          <div className="space-y-2 relative z-10">
             <label className="text-white/60 font-poppins text-sm uppercase tracking-wider font-semibold">Razorpay Key ID</label>
             <input 
               type="text" 
               placeholder="rzp_test_..."
               value={data.razorpayKeyId}
               onChange={e => setData({...data, razorpayKeyId: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins placeholder:text-white/20 focus:outline-none focus:border-pinkCream/50 transition-colors"
             />
          </div>

          <div className="space-y-2 relative z-10">
             <label className="text-white/60 font-poppins text-sm uppercase tracking-wider font-semibold">Razorpay Secret Key</label>
             <input 
               type="password" 
               placeholder="Enter your secret key"
               value={data.razorpaySecretKey}
               onChange={e => setData({...data, razorpaySecretKey: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins placeholder:text-white/20 focus:outline-none focus:border-pinkCream/50 transition-colors"
             />
             <p className="text-white/40 text-xs mt-2 font-poppins">This secret verifies cryptographically authentic callback hooks from the Razorpay API network. Keep this absolutely secure.</p>
          </div>
        </div>

        <h2 className="text-2xl font-outfit font-bold text-white mt-10 mb-6 relative z-10">Dispatch Settings</h2>
        
        <div className="space-y-6">
           <div className="space-y-2 relative z-10">
              <label className="text-white/60 font-poppins text-sm uppercase tracking-wider font-semibold">Rapido Store Link</label>
              <input 
                type="text" 
                placeholder="https://rapido.bike/..."
                value={data.rapidoLink || ""}
                onChange={e => setData({...data, rapidoLink: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins placeholder:text-white/20 focus:outline-none focus:border-pinkCream/50 transition-colors"
              />
           </div>

           <div className="space-y-2 relative z-10">
              <label className="text-white/60 font-poppins text-sm uppercase tracking-wider font-semibold">Uber Eats Store Link</label>
              <input 
                type="text" 
                placeholder="https://ubereats.com/..."
                value={data.uberEatsLink || ""}
                onChange={e => setData({...data, uberEatsLink: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins placeholder:text-white/20 focus:outline-none focus:border-pinkCream/50 transition-colors"
              />
           </div>
        </div>

        <div className="mt-10 relative z-10">
          <button 
             onClick={saveSettings}
             disabled={isSaving}
             className="px-8 py-3 bg-white text-black font-poppins font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 transform disabled:opacity-50"
          >
             {isSaving ? "Synchronizing Context..." : "Save Settings"}
          </button>
        </div>

      </div>
    </div>
  )
}
