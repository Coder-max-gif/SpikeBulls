import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AuthShell, Field, ErrorBanner } from "./LoginPage";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start with SpikeBulls in under a minute.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <Field icon={User} label="Full name" value={name} onChange={setName} placeholder="Your name" required autoComplete="name" />
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required autoComplete="email" />
        <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" required autoComplete="new-password" />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </button>
        <p className="text-center text-[13px] text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
