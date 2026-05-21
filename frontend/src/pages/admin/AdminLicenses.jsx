import React, { useEffect, useState } from "react";
import { Loader2, Key, ShieldOff, RotateCw, Copy, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/api";

export default function AdminLicenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/admin/licenses").then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const revoke = async (id) => {
    if (!window.confirm("Revoke this license? The user will lose access.")) return;
    await api.post(`/admin/licenses/${id}/revoke`);
    load();
  };
  const regen = async (id) => {
    await api.post(`/admin/licenses/${id}/regenerate`);
    load();
  };
  const copy = (k) => { navigator.clipboard.writeText(k); setCopied(k); setTimeout(() => setCopied(""), 1500); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[32px] text-slate-900 font-semibold tracking-tight">Licenses</h1>
        <p className="text-slate-600 text-[14px] mt-1">{items.length} licenses issued</p>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-500" /> : (
        <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-slate-500 text-[11.5px] uppercase tracking-wider border-b border-slate-200">
              <th className="px-5 py-3">Key</th><th className="px-5 py-3">Product</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Expires</th><th className="px-5 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-blue-600" />
                      <code className="text-[12px] text-blue-700">{l.key}</code>
                      <button onClick={() => copy(l.key)} className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center">
                        {copied === l.key ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-500" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-800">{l.product_name}</td>
                  <td className="px-5 py-3 text-slate-700">{l.user_email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${l.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>{l.status}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{l.expires_at ? new Date(l.expires_at).toLocaleDateString() : "Lifetime"}</td>
                  <td className="px-5 py-3 text-right">
                    {l.status === "active" && (
                      <button onClick={() => revoke(l.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-rose-600 hover:bg-rose-500/10">
                        <ShieldOff className="h-3.5 w-3.5" /> Revoke
                      </button>
                    )}
                    <button onClick={() => regen(l.id)} className="ml-1 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-slate-700 hover:text-slate-900 hover:bg-slate-100">
                      <RotateCw className="h-3.5 w-3.5" /> Regenerate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
