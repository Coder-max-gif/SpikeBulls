import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Radio, Settings2, Sparkles, Zap, Layers, Shield, Loader2 } from "lucide-react";
import { useProducts } from "../lib/queries";
import { SectionHeader } from "./ProductsOverview";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";

export default function ProductPreview() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const signals = products.find((p) => p.category === "signals");
  const automation = products.find((p) => p.category === "automation");

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="More than indicators"
          title="Signals and automation that compound your edge"
          subtitle="Daily institutional-style trade ideas and a complete MT5 automation toolkit — ready out of the box."
        />

        {loading ? (
          <div className="mt-14 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="mt-14 grid lg:grid-cols-2 gap-5">
            {signals && (
              <ProductCard
                product={signals}
                accent="blue"
                Icon={Radio}
                eyebrow="Forex Signals"
                badges={[
                  { Icon: Sparkles, label: "3–6 ideas / session" },
                  { Icon: Zap, label: "Telegram + Discord" },
                  { Icon: Shield, label: "Risk guidance" },
                ]}
                onClick={() => navigate(`/products/${signals.slug}`)}
              />
            )}
            {automation && (
              <ProductCard
                product={automation}
                accent="violet"
                Icon={Settings2}
                eyebrow="Automation Suite"
                badges={[
                  { Icon: Layers, label: "Multi-account copier" },
                  { Icon: Shield, label: "Risk caps" },
                  { Icon: Zap, label: "Smart trailing" },
                ]}
                onClick={() => navigate(`/products/${automation.slug}`)}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, accent, Icon, eyebrow, badges, onClick }) {
  const isBlue = accent === "blue";
  const image = product.images?.[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <TiltCard className="glass-strong rounded-2xl p-6 relative overflow-hidden">
        <div
          className={`absolute -top-24 ${isBlue ? "-left-20" : "-right-20"} h-56 w-56 rounded-full blur-3xl pointer-events-none ${
            isBlue ? "bg-blue-500/20" : "bg-violet-500/20"
          }`}
        />
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-10 w-10 rounded-lg border flex items-center justify-center ${
              isBlue
                ? "bg-blue-500/15 border-blue-400/30 text-blue-600"
                : "bg-violet-500/15 border-violet-400/30 text-violet-600"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">{eyebrow}</div>
            <h3 className="font-display text-[22px] text-slate-900 font-medium">{product.name}</h3>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[16/10] bg-slate-50">
          {image && (
            <img
              src={image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-white/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="glass rounded-md px-2.5 py-1.5 text-[11px] text-slate-900">{eyebrow}</span>
            <span className="glass rounded-md px-2.5 py-1.5 text-[11px] text-emerald-600">
              ${product.price.toFixed(0)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[14px] text-slate-600 leading-relaxed">{product.short_description}</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {badges.map((b, i) => (
            <div key={i} className="glass rounded-lg p-3 flex items-center gap-2">
              <b.Icon className={`h-4 w-4 ${isBlue ? "text-blue-600" : "text-violet-600"}`} />
              <span className="text-[12px] text-slate-700">{b.label}</span>
            </div>
          ))}
        </div>

        <MagneticButton
          onClick={onClick}
          className="mt-6 !py-2.5"
          variant={isBlue ? "primary" : "primary"}
          style={
            !isBlue
              ? {
                  background: "linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)",
                  borderColor: "rgba(167,139,250,0.6)",
                  boxShadow: "0 8px 24px -8px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
                }
              : undefined
          }
        >
          Explore {product.name}
          <ArrowRight className="h-4 w-4" />
        </MagneticButton>
      </TiltCard>
    </motion.div>
  );
}
