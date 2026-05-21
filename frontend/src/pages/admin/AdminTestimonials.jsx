import React, { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Check, X } from "lucide-react";
import { api } from "../../lib/api";

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: 5 });

  const load = () => {
    setLoading(true);
    api.get("/admin/testimonials").then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/admin/testimonials", form);
    setForm({ name: "", role: "", quote: "", rating: 5 });
    setAdding(false);
    load();
  };

  const del = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await api.delete(`/admin/testimonials/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-[32px] text-slate-900 font-semibold tracking-tight">Testimonials</h1>
          <p className="text-slate-600 text-[14px] mt-1">Manage the social proof on your landing page.</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="btn-primary !py-2.5">
          {adding ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add testimonial</>}
        </button>
      </div>

      {adding && (
        <form onSubmit={submit} className="glass-strong rounded-2xl p-5 grid sm:grid-cols-2 gap-3">
          <Field label="Name" v={form.name} on={(v) => setForm({ ...form, name: v })} required />
          <Field label="Role" v={form.role} on={(v) => setForm({ ...form, role: v })} placeholder="e.g. Prop Firm Trader" required />
          <div className="sm:col-span-2">
            <label className="text-[12px] text-slate-600">Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} required
              className="mt-2 w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] text-slate-900 focus:outline-none focus:border-blue-400/50 resize-none" />
          </div>
          <div>
            <label className="text-[12px] text-slate-600">Rating</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })}
              className="mt-2 w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] text-slate-900 focus:outline-none focus:border-blue-400/50">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
            </select>
          </div>
          <button className="btn-primary self-end"><Check className="h-4 w-4" /> Save testimonial</button>
        </form>
      )}

      {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-500" /> : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((t) => (
            <div key={t.id} className="glass rounded-2xl p-5 relative">
              <button onClick={() => del(t.id)} className="absolute top-3 right-3 h-7 w-7 rounded-md text-rose-600 hover:bg-rose-500/10 flex items-center justify-center">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="text-[12px] text-slate-600">{"★".repeat(t.rating)}</div>
              <p className="mt-2 text-[14px] text-slate-900">“{t.quote}”</p>
              <div className="mt-3 text-[13px] text-slate-900 font-medium">{t.name}</div>
              <div className="text-[12px] text-slate-500">{t.role}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, v, on, ...rest }) {
  return (
    <div>
      <label className="text-[12px] text-slate-600">{label}</label>
      <input value={v} onChange={(e) => on(e.target.value)} {...rest}
        className="mt-2 w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] text-slate-900 focus:outline-none focus:border-blue-400/50" />
    </div>
  );
}
