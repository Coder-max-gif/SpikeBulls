import React, { useEffect, useState } from "react";
import { Users, Package, Receipt, Mail, Key, DollarSign, Loader2 } from "lucide-react";
import { api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/summary"),
      api.get("/admin/orders"),
      api.get("/admin/leads"),
    ])
      .then(([s, o, l]) => {
        setData(s.data);
        setRecentOrders(o.data.slice(0, 5));
        setRecentLeads(l.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[32px] text-white font-semibold tracking-tight">Overview</h1>
        <p className="text-zinc-400 text-[14px] mt-1">A snapshot of the SpikeBulls platform.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Stat label="Total revenue" value={`$${(data?.revenue || 0).toFixed(0)}`} icon={DollarSign} accent="emerald" />
        <Stat label="Paid orders" value={data?.paid_orders ?? 0} icon={Receipt} />
        <Stat label="Active licenses" value={data?.active_licenses ?? 0} icon={Key} />
        <Stat label="Users" value={data?.users ?? 0} icon={Users} />
        <Stat label="Products" value={data?.products ?? 0} icon={Package} />
        <Stat label="Leads" value={data?.leads ?? 0} icon={Mail} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Recent orders" link={{ to: "/admin/orders", label: "All orders" }}>
          {recentOrders.length === 0 ? (
            <Empty msg="No orders yet." />
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <div className="text-[13px] text-white truncate">{o.items.map((i) => i.name).join(", ")}</div>
                    <div className="text-[11.5px] text-zinc-500">{o.user_email}</div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13px] text-white">${o.total.toFixed(2)}</div>
                    <div className={`text-[11px] ${o.status === "paid" ? "text-emerald-300" : "text-amber-300"}`}>{o.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent leads" link={{ to: "/admin/leads", label: "All leads" }}>
          {recentLeads.length === 0 ? (
            <Empty msg="No leads yet." />
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {recentLeads.map((l) => (
                <li key={l.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] text-white">{l.name}</div>
                    <div className="text-[11px] text-zinc-500">{new Date(l.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-[12px] text-zinc-400 truncate mt-0.5">{l.email} · {l.topic}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, accent }) {
  const colors = accent === "emerald"
    ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
    : "bg-blue-500/10 border-blue-400/30 text-blue-300";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-zinc-500">{label}</span>
        <div className={`h-7 w-7 rounded-lg border flex items-center justify-center ${colors}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-2 font-display text-[28px] text-white font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Card({ title, link, children }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-[18px] text-white font-medium">{title}</h3>
        {link && <Link to={link.to} className="text-[12.5px] text-blue-300 hover:text-blue-200">{link.label}</Link>}
      </div>
      {children}
    </div>
  );
}

function Empty({ msg }) {
  return <div className="text-[13px] text-zinc-500 py-4">{msg}</div>;
}
