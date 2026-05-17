import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Key,
  Receipt,
  User as UserIcon,
  Copy,
  CheckCircle2,
  Loader2,
  Download,
  Calendar,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const TABS = [
  { id: "overview", label: "Overview", icon: Package },
  { id: "licenses", label: "Licenses", icon: Key },
  { id: "orders", label: "Orders", icon: Receipt },
  { id: "account", label: "Account", icon: UserIcon },
];

export default function DashboardPage() {
  const { user, updateProfile, logout } = useAuth();
  const [params, setParams] = useSearchParams();
  const initialTab = TABS.find((t) => t.id === params.get("tab"))?.id || "overview";
  const [tab, setTab] = useState(initialTab);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setParams(tab === "overview" ? {} : { tab }, { replace: true });
  }, [tab, setParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.get("/me/summary"),
      api.get("/me/orders"),
      api.get("/me/licenses"),
    ])
      .then(([s, o, l]) => {
        if (cancelled) return;
        setSummary(s.data);
        setOrders(o.data);
        setLicenses(l.data);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="bg-app min-h-screen">
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-7xl px-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-zinc-300">Dashboard</div>
                <h1 className="mt-3 font-display text-[34px] sm:text-[42px] text-white font-semibold tracking-tight">
                  Welcome back, {user?.name?.split(" ")[0]}.
                </h1>
                <p className="mt-1 text-zinc-400 text-[14.5px]">
                  Manage your licenses, downloads, and orders.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 border-b border-white/[0.05] pb-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] transition-colors ${
                    tab === t.id
                      ? "bg-white/[0.06] text-white border border-white/10"
                      : "text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </div>

            <div className="mt-8">
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>
              ) : tab === "overview" ? (
                <Overview summary={summary} licenses={licenses} />
              ) : tab === "licenses" ? (
                <Licenses licenses={licenses} />
              ) : tab === "orders" ? (
                <Orders orders={orders} />
              ) : (
                <Account user={user} updateProfile={updateProfile} onLogout={logout} />
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-zinc-500">{label}</span>
        {Icon && (
          <div className="h-7 w-7 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center text-blue-300">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <div className="mt-2 font-display text-[28px] text-white font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Overview({ summary, licenses }) {
  const recent = licenses.slice(0, 3);
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Active licenses" value={summary?.active_licenses ?? 0} icon={Key} />
        <StatCard label="Paid orders" value={summary?.orders ?? 0} icon={Receipt} />
        <StatCard label="Account" value={"Active"} icon={ShieldCheck} />
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[20px] text-white font-medium">Recent licenses</h2>
          <Link to="?tab=licenses" className="text-[13px] text-blue-300 hover:text-blue-200">View all</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState message="You don't have any licenses yet." cta={{ to: "/products", label: "Browse products" }} />
        ) : (
          <ul className="space-y-2">
            {recent.map((l) => <LicenseRow key={l.id} lic={l} compact />)}
          </ul>
        )}
      </div>
    </div>
  );
}

function Licenses({ licenses }) {
  if (licenses.length === 0) {
    return <EmptyState message="No licenses yet. Pick up a product to get started." cta={{ to: "/products", label: "Browse products" }} />;
  }
  return (
    <ul className="space-y-2">
      {licenses.map((l) => <LicenseRow key={l.id} lic={l} />)}
    </ul>
  );
}

function LicenseRow({ lic, compact }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(lic.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const expired = lic.status !== "active";
  const expires = lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : "Lifetime";
  return (
    <li className="glass rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between">
      <div className="min-w-0">
        <div className="text-[14.5px] text-white font-medium truncate">{lic.product_name}</div>
        <div className="mt-1 flex items-center gap-2">
          <code className="text-[12px] text-blue-200 bg-white/[0.04] border border-white/8 px-2 py-1 rounded-md">{lic.key}</code>
          <button onClick={copy} className="h-7 w-7 rounded-md glass flex items-center justify-center text-zinc-400 hover:text-white">
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      {!compact && (
        <div className="flex items-center gap-3 text-[12px] text-zinc-400">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {expires}</span>
          <span className={`px-2 py-0.5 rounded-md ${expired ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300"}`}>
            {lic.status}
          </span>
        </div>
      )}
    </li>
  );
}

function Orders({ orders }) {
  if (orders.length === 0) {
    return <EmptyState message="You haven't placed any orders yet." cta={{ to: "/products", label: "Browse products" }} />;
  }
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <table className="w-full text-[13.5px]">
        <thead>
          <tr className="text-left text-zinc-500 text-[11.5px] uppercase tracking-wider border-b border-white/[0.05]">
            <th className="px-5 py-3">Order</th>
            <th className="px-5 py-3">Items</th>
            <th className="px-5 py-3">Total</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-white/[0.03] last:border-0">
              <td className="px-5 py-3 text-zinc-300 font-mono text-[12px]">{o.id.slice(0, 8)}</td>
              <td className="px-5 py-3 text-zinc-200">{o.items.map((i) => i.name).join(", ")}</td>
              <td className="px-5 py-3 text-white">${o.total.toFixed(2)}</td>
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                  o.status === "paid" ? "bg-emerald-500/10 text-emerald-300" :
                  o.status === "pending" ? "bg-amber-500/10 text-amber-300" :
                  "bg-rose-500/10 text-rose-300"
                }`}>{o.status}</span>
                {o.simulated && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-300">simulated</span>}
              </td>
              <td className="px-5 py-3 text-zinc-400">{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Account({ user, updateProfile, onLogout }) {
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const payload = { name };
      if (password) payload.password = password;
      await updateProfile(payload);
      setPassword("");
      setMsg("Saved.");
    } catch (err) {
      setMsg(err.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="max-w-xl glass rounded-2xl p-6">
      <h2 className="font-display text-[22px] text-white font-medium">Account settings</h2>
      <p className="mt-1 text-[13px] text-zinc-500">Signed in as <span className="text-zinc-300">{user?.email}</span></p>
      <form onSubmit={save} className="mt-6 space-y-4">
        <div>
          <label className="text-[12px] text-zinc-400">Name</label>
          <input className="mt-2 w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-400/50" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-[12px] text-zinc-400">New password (optional)</label>
          <input type="password" className="mt-2 w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-400/50" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave empty to keep current password" autoComplete="new-password" />
        </div>
        {msg && <p className="text-[13px] text-zinc-300">{msg}</p>}
        <div className="flex items-center gap-3">
          <button disabled={saving} className="btn-primary !py-2.5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}</button>
          <button type="button" onClick={onLogout} className="btn-ghost !py-2.5">Log out</button>
        </div>
      </form>
    </div>
  );
}

function EmptyState({ message, cta }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.05] border border-white/8 flex items-center justify-center text-zinc-400 mb-3">
        <Download className="h-4 w-4" />
      </div>
      <p className="text-zinc-300">{message}</p>
      {cta && <Link to={cta.to} className="inline-block mt-4 btn-primary !py-2 !px-4 !text-[13px]">{cta.label}</Link>}
    </div>
  );
}
