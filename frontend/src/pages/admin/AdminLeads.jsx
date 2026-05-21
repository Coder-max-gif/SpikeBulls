import React, { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { api } from "../../lib/api";

const STATUS = ["new", "in_progress", "closed"];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    api.get("/admin/leads").then((r) => setLeads(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/leads/${id}`, null, { params: { status } });
    load();
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[32px] text-slate-900 font-semibold tracking-tight">Leads</h1>
          <p className="text-slate-600 text-[14px] mt-1">{leads.length} contact submissions</p>
        </div>
        <div className="flex gap-2">
          {["all", ...STATUS].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md text-[12.5px] ${
              filter === s ? "bg-slate-200 text-slate-900 border border-slate-200" : "text-slate-600 border border-slate-200"
            }`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-500" /> : (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-slate-600">No leads in this view.</div>
          ) : filtered.map((l) => (
            <div key={l.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[14.5px] text-slate-900 font-medium">{l.name}</div>
                    <a href={`mailto:${l.email}`} className="text-[12.5px] text-blue-600 inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {l.email}</a>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">{l.topic}</span>
                  </div>
                  <p className="mt-2 text-[13.5px] text-slate-700 whitespace-pre-wrap">{l.message}</p>
                  <p className="mt-2 text-[11px] text-slate-500">{new Date(l.created_at).toLocaleString()} · {l.source || "—"}</p>
                </div>
                <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-2 py-1 text-[12px] text-slate-900">
                  {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
