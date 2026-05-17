import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { api } from "../lib/api";
import { AuthShell, Field, ErrorBanner, SuccessBanner } from "./LoginPage";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token) return setError("Missing reset token.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess("Password updated. Redirecting to sign in...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password (8+ characters).">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        {success && <SuccessBanner message={success} />}
        <Field icon={Lock} label="New password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" required autoComplete="new-password" />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Update password <ArrowRight className="h-4 w-4" /></>}
        </button>
        <p className="text-center text-[13px] text-zinc-500">
          <Link to="/login" className="text-blue-300 hover:text-blue-200">Back to sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
