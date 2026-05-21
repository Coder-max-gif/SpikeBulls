import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, X, ArrowRight, Zap, Sparkles, Star } from "lucide-react";
import { useProducts } from "../lib/queries";
import { SectionHeader } from "./ProductsOverview";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";

export default function PricingPreview() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const plans = [
    {
      id: "basic",
      name: "Starter",
      description: "Perfect for new traders",
      price: "$29",
      period: "/month",
      featured: false,
      features: [
        "Indicator Subscription (Monthly)",
        "3–6 signals / session",
        "Telegram + Email alerts",
        "Basic risk guidance",
        "Community access",
      ],
      accent: "blue",
    },
    {
      id: "pro",
      name: "Professional",
      description: "Most popular choice",
      price: "$69",
      period: "/6 months",
      featured: true,
      features: [
        "Indicator Subscription (6 Months)",
        "Algorithm Subscription (6 Months)",
        "All features included",
        "Priority support",
        "VIP Discord access",
        "VPS setup assistance",
        "Best value!",
      ],
      accent: "violet",
    },
    {
      id: "enterprise",
      name: "Elite",
      description: "For serious traders",
      price: "$299",
      period: "/year",
      featured: false,
      features: [
        "Indicator Lifetime License",
        "Algorithm Lifetime License",
        "Automation Suite License",
        "All features included",
        "1-on-1 onboarding",
        "Lifetime updates",
        "Priority feature requests",
      ],
      accent: "gradient",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="mx-auto max-w-7xl px-5 relative z-10">
        <SectionHeader
          eyebrow="Pricing that scales"
          title="Choose your edge"
          subtitle="Flexible plans for every stage of your trading journey — from beginner to professional."
        />

        <div className="mt-16 grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.1, type: "spring" }}
              style={{
                zIndex: plan.featured ? 10 : 1,
              }}
            >
              <TiltCard className="h-full">
                <div
                  className={`relative h-full glass-strong rounded-2xl p-7 sm:p-8 overflow-hidden border-2 ${
                    plan.featured
                      ? "border-gradient-to-r from-blue-500/40 to-violet-500/40"
                      : "border-white/10"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
                  )}

                  {plan.featured && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex items-center gap-1.5 glass-strong rounded-full px-3 py-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-[11px] text-yellow-300 font-medium">
                          Most Popular
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-display text-[24px] text-white font-semibold">
                      {plan.name}
                    </h3>
                    <p className="text-zinc-400 text-[14px] mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-[52px] text-white font-bold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-zinc-400 text-[16px]">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center bg-emerald-500/15">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </div>
                        <span className="text-zinc-300 text-[14px] leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    className="w-full !py-3"
                    onClick={() => navigate("/pricing")}
                    style={
                      plan.featured
                        ? {
                            background:
                              "linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)",
                            borderColor: "rgba(167,139,250,0.6)",
                            boxShadow:
                              "0 8px 24px -8px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
                          }
                        : undefined
                    }
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <button
            onClick={() => navigate("/pricing")}
            className="btn-ghost !py-2.5"
          >
            View complete pricing <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
