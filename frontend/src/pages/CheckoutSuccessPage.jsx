import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2, Copy, Key } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");
  const simulated = params.get("simulated") === "1";
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    if (!orderId || !isAuthenticated) {
      setLoading(false);
      return;
    }
    api
      .get(`/checkout/orders/${orderId}`)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId, isAuthenticated]);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(""), 1500);
  };

  return (
    <main className="bg-app min-h-screen">
      <section className="relative pt-32 pb-20 sm:pt-40">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="mt-6 font-display text-[40px] sm:text-[52px] text-slate-900 font-semibold tracking-tight">Order confirmed</h1>
            <p className="mt-3 text-slate-600 text-[15.5px]">
              Thanks for your purchase. Your licenses are ready in your dashboard.
              {simulated && (
                <span className="block mt-2 text-amber-600 text-[13px]">
                  (Simulated checkout — enable Stripe in backend/.env for live payments.)
                </span>
              )}
            </p>

            <div className="mt-8 glass-strong rounded-2xl p-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-[18px] text-slate-900 font-medium">Your licenses</h2>
                <Key className="h-4 w-4 text-slate-600" />
              </div>
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-slate-500" /></div>
              ) : !data ? (
                <p className="text-[13.5px] text-slate-600">Sign in to view your licenses.</p>
              ) : data.licenses.length === 0 ? (
                <p className="text-[13.5px] text-slate-600">Your licenses will appear here shortly.</p>
              ) : (
                <ul className="space-y-2">
                  {data.licenses.map((l) => (
                    <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 glass rounded-lg p-3">
                      <span className="text-[14px] text-slate-900">{l.product_name}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-[12px] text-blue-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">{l.key}</code>
                        <button onClick={() => copy(l.key)} className="h-7 w-7 rounded-md glass flex items-center justify-center text-slate-600 hover:text-slate-900">
                          {copiedKey === l.key ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard" className="btn-primary">Go to dashboard <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/products" className="btn-ghost">Browse more products</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
