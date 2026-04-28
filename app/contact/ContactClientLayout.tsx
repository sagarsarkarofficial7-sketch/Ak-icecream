"use client";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import StoresSlider from "@/components/StoresSlider";

export default function ContactClientLayout({ contactData, stores }: { contactData: any, stores: any[] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus({ type: 'success', msg: "Message sent successfully! We'll get back to you soon." });
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      setStatus({ type: 'error', msg: "Something went wrong. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FFF8F5]">
      {/* Background Hero Design matching the brand */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pinkCream/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-iceBlue/30 rounded-full blur-[150px] -translate-x-1/4"></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-pinkCream/10 to-transparent"></div>
      </div>

      <div className="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-pinkCream tracking-widest uppercase font-poppins font-semibold text-sm mb-4 block"
          >
            {contactData.headerSmall || "Get In Touch"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[80px] font-outfit font-black text-black/90 drop-shadow-sm tracking-tight mb-6"
          >
            {contactData.headingPart1 || "Let's Talk"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pinkCream to-cherryRed">{contactData.headingPart2 || "Ice Cream"}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-poppins text-black/60 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {contactData.subheading || "Whether you have a question about our flavors, want to discuss catering for an event, or are interested in franchise opportunities, we're here to help."}
          </motion.p>
        </div>

        {/* Contact Form & Info Grid */}
        <div className="flex flex-col xl:flex-row gap-16 lg:gap-20 relative z-20">
          
          {/* Left Column: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full xl:w-5/12 space-y-12 shrink-0"
          >
            <div>
              <h3 className="text-2xl font-outfit font-bold text-black/80 mb-6">{contactData.storesHeading || "Visit Our Stores"}</h3>
              {stores.length === 0 ? (
                <p className="text-black/50 text-sm italic">Stores are being added soon.</p>
              ) : (
                <StoresSlider stores={stores} />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-outfit font-bold text-black/80 mb-6">{contactData.directContactHeading || "Direct Contact"}</h3>
              <div className="space-y-4 font-poppins text-black/70">
                <a href={`mailto:${contactData.email || 'hello@akicecream.com'}`} className="flex items-center gap-4 hover:text-pinkCream transition-colors">
                  <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-xl">✉️</span>
                  {contactData.email || "hello@akicecream.com"}
                </a>
                <a href={`tel:${contactData.phone || '+919876543210'}`} className="flex items-center gap-4 hover:text-pinkCream transition-colors">
                  <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-xl">📞</span>
                  {contactData.phone || "+91 98765 43210"}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full xl:w-7/12 backdrop-blur-3xl bg-white/40 border border-white/60 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-20"
          >
            <h3 className="text-3xl font-outfit font-black text-black/80 mb-8">{contactData.formHeading || "Send us a message"}</h3>
            
            {status && (
              <div className={`mb-8 p-4 rounded-2xl font-poppins text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {status.msg}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-poppins font-medium text-black/70 mb-2">Your Name</label>
                  <input 
                    type="text" id="name" required 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/50 border border-white focus:border-pinkCream outline-none focus:ring-4 ring-pinkCream/10 rounded-2xl px-5 py-4 font-poppins text-black/80 transition-all placeholder:text-black/30" placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-poppins font-medium text-black/70 mb-2">Email Address</label>
                  <input 
                    type="email" id="email" required 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/50 border border-white focus:border-pinkCream outline-none focus:ring-4 ring-pinkCream/10 rounded-2xl px-5 py-4 font-poppins text-black/80 transition-all placeholder:text-black/30" placeholder="john@example.com" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-poppins font-medium text-black/70 mb-2">Subject</label>
                <select 
                  id="subject" 
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/50 border border-white focus:border-pinkCream outline-none focus:ring-4 ring-pinkCream/10 rounded-2xl px-5 py-4 font-poppins text-black/80 transition-all appearance-none cursor-pointer"
                >
                  <option>General Inquiry</option>
                  <option>Catering Event</option>
                  <option>Franchise Opportunities</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-poppins font-medium text-black/70 mb-2">Your Message</label>
                <textarea 
                  id="message" rows={5} required 
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/50 border border-white focus:border-pinkCream outline-none focus:ring-4 ring-pinkCream/10 rounded-2xl px-5 py-4 font-poppins text-black/80 transition-all placeholder:text-black/30 resize-none" placeholder="How can we sweeten your day?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-black/80 text-white font-poppins font-semibold text-lg py-5 rounded-2xl shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
