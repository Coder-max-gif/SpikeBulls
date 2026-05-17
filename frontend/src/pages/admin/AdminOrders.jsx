import React, { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { api } from "../../lib/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  useEffect(() => {
    api.get("/admin/orders").then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);
  const filtered = orders.filter((o) =>
    !q || o.user_email?.toLowerCase().includes(q.toLowerCase()) || o.id.includes(q)
  );
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-[32px] text-white font-semibold tracking-tight">Orders</h1>
          <p className="text-zinc-400 text-[14px] mt-1">{orders.length} total · ${orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.total, 0).toFixed(0)} revenue</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email or order id"
            className="pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-[13px] text-white focus:outline-none focus:border-blue-400/50" />
        </div>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-500" /> : (
        <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-zinc-500 text-[11.5px] uppercase tracking-wider border-b border-white/[0.05]">
              <th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Items</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
            </tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.03] last:border-0">
                  <td className="px-5 py-3 text-zinc-400 font-mono text-[11.5px]">{o.id.slice(0, 8)}</td>
                  <td className="px-5 py-3 text-zinc-200">{o.user_email}</td>
                  <td className="px-5 py-3 text-zinc-300">{o.items.map((i) => i.name).join(", ")}</td>
                  <td className="px-5 py-3 text-white">${o.total.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${o.status === "paid" ? "bg-emerald-500/10 text-emerald-300" : o.status === "pending" ? "bg-amber-500/10 text-amber-300" : "bg-rose-500/10 text-rose-300"}`}>{o.status}</span>
                    {o.simulated && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-300">sim</span>}
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-zinc-500">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
