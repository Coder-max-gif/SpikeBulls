import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { api } from "../lib/api";
import { AuthShell } from "./LoginPage";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("Missing verification token.");
      return;
    }
    api
      .post("/auth/verify-email", { token })
      .then(() => {
        setState("ok");
        setMessage("Your email is verified. Welcome aboard.");
      })
      .catch((err) => {
        setState("error");
        setMessage(err.response?.data?.detail || "Verification failed.");
      });
  }, [token]);

  return (
    <AuthShell title="Email verification" subtitle="Confirming your email address.">
      <div className="flex flex-col items-center text-center">
        {state === "verifying" && <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />}
        {state === "ok" && <CheckCircle2 className="h-10 w-10 text-emerald-400" />}
        {state === "error" && <XCircle className="h-10 w-10 text-rose-400" />}
        <p className="mt-4 text-zinc-200 text-[14.5px]">{message || "Verifying..."}</p>
        <Link to="/dashboard" className="mt-6 btn-primary">Go to dashboard</Link>
      </div>
    </AuthShell>
  );
}
