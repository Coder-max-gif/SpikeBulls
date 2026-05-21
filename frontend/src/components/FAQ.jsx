import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "../mock";
import { SectionHeader } from "./ProductsOverview";

export default function FAQ({ heading = true, limit }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  const [open, setOpen] = useState(0);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        {heading && (
          <SectionHeader
            eyebrow="FAQ"
            title="Questions, answered"
            subtitle="Everything you need to know before you start. Still curious? Reach out to support."
          />
        )}

        <div className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="glass rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-900/[0.025] transition-colors"
                >
                  <span className="text-[15px] text-slate-900 font-medium">{it.q}</span>
                  <span className="h-7 w-7 rounded-full glass flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5 text-blue-600" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-slate-700" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-[14px] text-slate-600 leading-relaxed">
                        {it.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
