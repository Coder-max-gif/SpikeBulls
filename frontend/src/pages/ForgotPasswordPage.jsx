import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { api } from "../lib/api";
import { AuthShell, Field, ErrorBanner, SuccessBanner } from "./LoginPage";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSuccess("If that email exists, a reset link has been sent. Check your inbox (and spam).");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Reset password" subtitle="Enter your email and we'll send a reset link.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        {success && <SuccessBanner message={success} />}
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send reset link <ArrowRight className="h-4 w-4" /></>}
        </button>
        <p className="text-center text-[13px] text-slate-500">
          Remembered it? <Link to="/login" className="text-blue-600 hover:text-blue-700">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
