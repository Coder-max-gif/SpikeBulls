import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <main className="bg-app min-h-screen">
      <section className="relative pt-32 pb-20 sm:pt-40">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-xl px-5 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-rose-500/15 border border-rose-400/30 flex items-center justify-center">
            <XCircle className="h-7 w-7 text-rose-600" />
          </div>
          <h1 className="mt-6 font-display text-[40px] text-slate-900 font-semibold tracking-tight">Checkout cancelled</h1>
          <p className="mt-3 text-slate-600">No charge was made. You can try again any time.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/pricing" className="btn-primary">Back to pricing</Link>
            <Link to="/" className="btn-ghost">Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
