"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-[#FFF8F5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-pinkCream font-poppins font-semibold uppercase tracking-widest text-sm mb-4 block">Help Center</span>
          <h2 className="text-3xl md:text-5xl font-outfit font-black text-black/90">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={faq.id} 
              className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-outfit font-bold text-black/80">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-pinkCream" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-black/60 font-poppins leading-relaxed border-t border-black/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
