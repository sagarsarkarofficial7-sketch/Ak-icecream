"use client";

import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Custom hook to load the Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [codEnabled, setCodEnabled] = useState(false);
  const [rapidoLink, setRapidoLink] = useState("");
  const [uberEatsLink, setUberEatsLink] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  useEffect(() => {
    if (isCartOpen) {
        fetch("/api/checkout/methods")
         .then(res => res.json())
         .then(data => {
            setCodEnabled(data.codEnabled === true);
            setRapidoLink(data.rapidoLink || "");
            setUberEatsLink(data.uberEatsLink || "");
         })
         .catch(() => setCodEnabled(false));
    }
  }, [isCartOpen]);

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    
    // 1. Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsOrdering(false);
      return;
    }

    try {
      // 2. Create Order on our Next.js API Route
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: cartTotal,
          items: items,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          shippingAddress: customerData.address,
          paymentMethod: paymentMethod
        }), 
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // COD DIRECT RESOLUTION BYPASS
      if (orderData.mode === 'cod' && orderData.success) {
         clearCart();
         setShowCheckoutForm(false);
         setCustomerData({ name: "", email: "", phone: "", address: "" });
         setIsOrdering(false);
         setOrderSuccess(true);
         // Auto-close removed to allow Dispatch Partner selection.
         return;
      }

      // 3. Initialize Razorpay Options
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholderKey", 
        amount: orderData.amount, // from backend API
        currency: orderData.currency,
        name: "Aashutosh Kothi Ice Cream",
        description: "Premium Ice Cream Order",
        image: "/Logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 4. Verification Callback (On Success)
          setIsOrdering(true); // Keep loading state during verification
          try {
            const verifyRes = await fetch("/api/payment-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              clearCart();
              setShowCheckoutForm(false);
              setCustomerData({ name: "", email: "", phone: "", address: "" });
              setIsOrdering(false);
              setOrderSuccess(true);
              // Auto-close removed to allow Dispatch Partner selection.
            } else {
              alert("Payment verification failed! Please contact support.");
              setIsOrdering(false);
            }
          } catch(e) {
            alert("Error verifying payment.");
            setIsOrdering(false);
          }
        },
        prefill: {
          name: customerData.name,
          email: customerData.email,
          contact: customerData.phone
        },
        theme: {
          color: "#E2A9B9" // Matches 'pinkCream'
        }
      };

      // 5. Open Razorpay Gateway Modal
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment Failed: " + response.error.description);
        setIsOrdering(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Checkout currently unavailable. Please check API keys.");
      setIsOrdering(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isOrdering && setIsCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] z-[70] bg-[#111111] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="text-2xl font-outfit font-black text-white/90">Your Order</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                disabled={isOrdering}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Success Message UI */}
            {orderSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/40">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_50px_rgba(74,222,128,0.2)]">
                  ✓
                </div>
                <h3 className="text-3xl font-outfit font-bold text-white/90 mb-2">Order Placed!</h3>
                <p className="text-white/60 font-poppins text-lg mb-10">Your delicious masterpieces are being prepared.</p>
                
                <h4 className="font-outfit font-bold text-xl text-white mb-4">Choose your Pickup Partner</h4>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                   {rapidoLink && (
                     <a href={rapidoLink} target="_blank" rel="noopener noreferrer" className="w-full relative overflow-hidden bg-white hover:bg-neutral-200 text-black font-poppins font-bold text-lg py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                        Rapido Dispatch
                     </a>
                   )}
                   {uberEatsLink && (
                     <a href={uberEatsLink} target="_blank" rel="noopener noreferrer" className="w-full relative overflow-hidden bg-[#06C167] hover:bg-[#05a055] text-white font-poppins font-bold text-lg py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                        Uber Eats Dispatch
                     </a>
                   )}
                </div>

                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-12 text-white/40 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
                >
                  I'll pick it up myself. Close Cart.
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/40 font-poppins">
                      <div className="text-6xl mb-6 opacity-30">🛒</div>
                      <p>Your cart is surprisingly empty.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 text-pinkCream hover:text-white transition-colors"
                      >
                        Browse Flavours →
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 relative group">
                        
                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="absolute -top-2 -right-2 w-8 h-8 z-10 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm shadow-lg"
                        >
                          ✕
                        </button>

                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-black/40 border border-white/5 shadow-inner hidden sm:block">
                          <Image 
                            src={`/categories/${item.image}`} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full relative">
                          <h4 className="font-outfit font-bold text-lg text-white/90">{item.name}</h4>
                          <div className="text-sm font-poppins text-white/50 mb-3">{item.category} • {item.size}</div>
                          
                          {(() => {
                             const basePrice = Math.round(item.price / 1.05);
                             const itemTotal = item.price * item.quantity;
                             const baseTotal = basePrice * item.quantity;
                             const gstTotal = itemTotal - baseTotal;
                             
                             return (
                               <div className="flex flex-col gap-1 mb-4 text-xs sm:text-sm font-poppins bg-black/20 p-3 rounded-lg border border-white/5">
                                 <div className="flex justify-between text-white/60">
                                   <span>Item price:</span>
                                   <span>₹{basePrice} &times; {item.quantity} = ₹{baseTotal}</span>
                                 </div>
                                 <div className="flex justify-between text-white/60">
                                   <span>5% GST:</span>
                                   <span>₹{gstTotal}</span>
                                 </div>
                                 <div className="flex justify-between font-bold text-pinkCream border-t border-white/10 pt-2 mt-1">
                                   <span>Total:</span>
                                   <span>₹{itemTotal}</span>
                                 </div>
                               </div>
                             );
                          })()}
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 bg-black/40 w-max rounded-full px-2 py-1 border border-white/10">
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              -
                            </button>
                            <span className="font-outfit font-bold text-white px-2 min-w-[2rem] text-center text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                  <div className="p-6 border-t border-white/10 bg-[#0A0A0A] shrink-0">
                    
                    <AnimatePresence>
                      {showCheckoutForm && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-6 space-y-3"
                        >
                          <h4 className="font-outfit font-bold text-white mb-2">Delivery Details</h4>
                          <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={customerData.name}
                            onChange={e => setCustomerData({...customerData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins placeholder:text-white/30 focus:outline-none focus:border-pinkCream/50 transition-colors"
                          />
                          <div className="flex gap-3">
                            <input 
                              type="email" 
                              placeholder="Email Address" 
                              value={customerData.email}
                              onChange={e => setCustomerData({...customerData, email: e.target.value})}
                              className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins placeholder:text-white/30 focus:outline-none focus:border-pinkCream/50 transition-colors"
                            />
                            <input 
                              type="tel" 
                              placeholder="Phone Number" 
                              value={customerData.phone}
                              onChange={e => setCustomerData({...customerData, phone: e.target.value})}
                              className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins placeholder:text-white/30 focus:outline-none focus:border-pinkCream/50 transition-colors"
                            />
                          </div>
                          <textarea 
                            placeholder="Complete Shipping Address" 
                            value={customerData.address}
                            onChange={e => setCustomerData({...customerData, address: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-poppins min-h-[80px] resize-none placeholder:text-white/30 focus:outline-none focus:border-pinkCream/50 transition-colors"
                          />

                          {codEnabled && (
                            <div className="pt-2">
                               <h4 className="font-outfit font-bold text-white/80 mb-2 mt-2">Payment Method</h4>
                               <div className="flex gap-3">
                                  <button
                                     onClick={() => setPaymentMethod('razorpay')}
                                     className={`flex-1 py-3 rounded-xl border border-white/10 font-poppins text-sm font-semibold transition-all ${paymentMethod === 'razorpay' ? 'bg-pinkCream text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                                  >
                                     Pay Online (Cards/UPI)
                                  </button>
                                  <button
                                     onClick={() => setPaymentMethod('cod')}
                                     className={`flex-1 py-3 rounded-xl border border-white/10 font-poppins text-sm font-semibold transition-all ${paymentMethod === 'cod' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                                  >
                                     Cash on Delivery
                                  </button>
                               </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mb-6">
                      <span className="font-poppins text-white/60">Total Amount</span>
                      <span className="text-3xl font-outfit font-black text-white drop-shadow-md">₹{cartTotal}</span>
                    </div>
                    
                    {showCheckoutForm ? (
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={isOrdering || !customerData.name || !customerData.email || !customerData.phone || !customerData.address}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-pinkCream to-cherryRed hover:from-pinkCream/90 hover:to-cherryRed/90 hover:shadow-[0_0_30px_rgba(255,192,203,0.3)] text-white font-poppins font-bold text-lg py-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1 transform disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                      >
                        {isOrdering ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          paymentMethod === 'cod' ? "Place COD Order Now" : "Pay Securely via Razorpay"
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => setShowCheckoutForm(true)}
                        className="w-full relative overflow-hidden bg-white hover:bg-white/90 text-black font-poppins font-bold text-lg py-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1 transform"
                      >
                        Proceed to Checkout
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
