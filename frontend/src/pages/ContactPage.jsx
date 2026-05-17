import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Mail, MessageCircle, Send, Twitter, Youtube, Check, ArrowRight, Loader2 } from "lucide-react";
import { BRAND } from "../mock";
import { api } from "../lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/contact", { ...form, source: location.pathname });
      setSent(true);
      setForm({ name: "", email: "", topic: "general", message: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Submission failed. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-app">
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-zinc-300">Talk to us</div>
              <h1 className="mt-5 font-display text-[44px] sm:text-[56px] font-semibold tracking-tight leading-[1.05] text-white">
                Let's get you <span className="text-gradient-accent">trading.</span>
              </h1>
              <p className="mt-5 text-zinc-400 text-[16px] leading-relaxed max-w-lg">
                Questions about setup, demo licenses, bundle pricing, or VPS recommendations? Send a note and we'll reply within one business day.
              </p>

              <div className="mt-10 space-y-3">
                <ContactCard icon={Mail} label="Email" value={BRAND.email} href={`mailto:${BRAND.email}`} />
                <ContactCard icon={MessageCircle} label="Discord" value="Join the community" href={BRAND.social.discord} />
                <ContactCard icon={Send} label="Telegram" value="Live support channel" href={BRAND.social.telegram} />
                <div className="flex items-center gap-2 pt-2">
                  <SocialIcon href={BRAND.social.twitter} icon={Twitter} />
                  <SocialIcon href={BRAND.social.youtube} icon={Youtube} />
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-strong rounded-2xl p-7 sm:p-9"
            >
              <h2 className="font-display text-[24px] text-white font-semibold tracking-tight">Send a message</h2>
              <p className="mt-1 text-[13px] text-zinc-500">Replies typically within 24 hours.</p>

              {sent && (
                <div className="mt-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2.5 text-[13px] text-emerald-200 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Message received. We'll be in touch soon.
                </div>
              )}
              {error && (
                <div className="mt-5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2.5 text-[13px] text-rose-200">{error}</div>
              )}

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" required />
              </div>

              <div className="mt-3">
                <label className="text-[12px] text-zinc-400">Topic</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "general", label: "General" },
                    { id: "demo", label: "Demo license" },
                    { id: "bundle", label: "Bundle" },
                    { id: "support", label: "Support" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, topic: t.id })}
                      className={`text-[13px] py-2 rounded-lg border transition-colors ${
                        form.topic === t.id
                          ? "bg-blue-500/15 border-blue-400/40 text-blue-200"
                          : "bg-white/[0.03] border-white/8 text-zinc-300 hover:border-white/15"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <label className="text-[12px] text-zinc-400">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Tell us what you need..."
                  className="mt-2 w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-[14px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400/50 transition-colors resize-none"
                />
              </div>

              <button type="submit" disabled={submitting} className="mt-6 btn-primary w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send message <ArrowRight className="h-4 w-4" /></>}
              </button>
              <p className="mt-3 text-center text-[11px] text-zinc-500">By submitting you agree to our privacy policy.</p>
            </motion.form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="text-[12px] text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-[14px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400/50 transition-colors"
      />
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href }) {
  return (
    <a href={href} className="flex items-center gap-3 glass rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-white/10 flex items-center justify-center text-blue-300">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[11px] text-zinc-500 uppercase tracking-wider">{label}</div>
        <div className="text-[14px] text-white">{value}</div>
      </div>
    </a>
  );
}

function SocialIcon({ href, icon: Icon }) {
  return (
    <a href={href} className="h-9 w-9 rounded-lg glass flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
      <Icon className="h-4 w-4" />
    </a>
  );
}
