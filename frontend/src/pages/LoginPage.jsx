import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextParam = new URLSearchParams(location.search).get("next") || "/dashboard";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      navigate(user.role === "admin" ? "/admin" : nextParam);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to access your dashboard and licenses.">
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
      <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
      <div className="flex items-center justify-between text-[12.5px]">
        <Link to="/forgot-password" className="text-zinc-400 hover:text-white transition-colors">Forgot password?</Link>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="text-center text-[13px] text-zinc-500">
        New here? <Link to="/register" className="text-blue-300 hover:text-blue-200">Create an account</Link>
      </p>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="bg-app min-h-screen">
      <section className="relative pt-32 pb-20 sm:pt-40 overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-md px-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-[0_0_28px_-4px_rgba(96,165,250,0.6)]">
                <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="font-display text-[34px] text-white font-semibold tracking-tight text-center">{title}</h1>
            {subtitle && <p className="mt-2 text-zinc-400 text-[15px] text-center">{subtitle}</p>}
            <div className="mt-8 glass-strong rounded-2xl p-7">{children}</div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export function Field({ icon: Icon, label, value, onChange, type = "text", placeholder, required, autoComplete }) {
  return (
    <div>
      <label className="text-[12px] text-zinc-400">{label}</label>
      <div className="mt-2 relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full bg-white/[0.03] border border-white/10 rounded-lg ${Icon ? "pl-10" : "pl-3"} pr-3 py-2.5 text-[14px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400/50 transition-colors`}
        />
      </div>
    </div>
  );
}

export function ErrorBanner({ message }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2.5 text-[13px] text-rose-200">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function SuccessBanner({ message }) {
  return (
    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2.5 text-[13px] text-emerald-200">
      {message}
    </div>
  );
}
