import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import { api } from "../../lib/api";

const BLANK = {
  name: "",
  slug: "",
  category: "indicator",
  short_description: "",
  description: "",
  price: 99,
  compare_at_price: null,
  features: [],
  platforms: [],
  images: [],
  delivery_type: "license",
  file_path: null,
  max_downloads: 5,
  license_duration_days: null,
  status: "active",
  highlight: false,
  badge: "",
  accent: "blue",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product or null

  const load = async () => {
    setLoading(true);
    const res = await api.get("/admin/products");
    setProducts(res.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[32px] text-white font-semibold tracking-tight">Products</h1>
          <p className="text-zinc-400 text-[14px] mt-1">Manage your catalog. Changes are live immediately.</p>
        </div>
        <button onClick={() => setEditing({ ...BLANK })} className="btn-primary !py-2.5">
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-500" /> : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-zinc-500 text-[11.5px] uppercase tracking-wider border-b border-white/[0.05]">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.03] last:border-0">
                  <td className="px-5 py-3">
                    <div className="text-white">{p.name}</div>
                    <div className="text-[11.5px] text-zinc-500">{p.slug}</div>
                  </td>
                  <td className="px-5 py-3 text-zinc-300">{p.category}</td>
                  <td className="px-5 py-3 text-white">${p.price.toFixed(0)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${p.status === "active" ? "bg-emerald-500/10 text-emerald-300" : "bg-zinc-500/15 text-zinc-300"}`}>{p.status}</span>
                    {p.highlight && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300">highlight</span>}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setEditing(p)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-zinc-300 hover:text-white hover:bg-white/[0.04]">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => onDelete(p.id)} className="ml-1 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-rose-300 hover:bg-rose-500/10">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <ProductDrawer
            initial={editing}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductDrawer({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    ...initial,
    features_text: (initial.features || []).join("\n"),
    platforms_text: (initial.platforms || []).join(", "),
    images_text: (initial.images || []).join("\n"),
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      features: form.features_text.split("\n").map((s) => s.trim()).filter(Boolean),
      platforms: form.platforms_text.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images_text.split("\n").map((s) => s.trim()).filter(Boolean),
      price: parseFloat(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      license_duration_days: form.license_duration_days ? parseInt(form.license_duration_days, 10) : null,
      max_downloads: form.max_downloads ? parseInt(form.max_downloads, 10) : null,
      file_path: form.file_path || null,
    };
    delete payload.features_text;
    delete payload.platforms_text;
    delete payload.images_text;
    if (!payload.slug) payload.slug = slugify(payload.name);
    if (!payload.badge) payload.badge = null;

    try {
      if (initial.id) {
        delete payload.created_at;
        delete payload.updated_at;
        delete payload.id;
        await api.patch(`/admin/products/${initial.id}`, payload);
      } else {
        await api.post("/admin/products", payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="relative w-full sm:w-[560px] bg-[#0A0B11] border-l border-white/[0.06] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#0A0B11] z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
          <h2 className="font-display text-[20px] text-white">{initial.id ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-md glass flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {error && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-[13px] text-rose-200">{error}</div>}
          <Row><L label="Name"><Input v={form.name} on={(v) => set("name", v)} required /></L></Row>
          <Row><L label="Slug (URL)"><Input v={form.slug} on={(v) => set("slug", v)} placeholder="auto-generated if empty" /></L></Row>
          <div className="grid grid-cols-2 gap-3">
            <L label="Category"><Select v={form.category} on={(v) => set("category", v)} options={[
              { v: "indicator", l: "Indicator" }, { v: "algo", l: "Algo" }, { v: "signals", l: "Signals" }, { v: "automation", l: "Automation" }
            ]} /></L>
            <L label="Accent"><Select v={form.accent} on={(v) => set("accent", v)} options={[
              { v: "blue", l: "Blue" }, { v: "violet", l: "Violet" }, { v: "gradient", l: "Gradient" }
            ]} /></L>
          </div>
          <Row><L label="Short description"><Input v={form.short_description} on={(v) => set("short_description", v)} required /></L></Row>
          <Row><L label="Full description"><Textarea v={form.description} on={(v) => set("description", v)} rows={4} required /></L></Row>
          <div className="grid grid-cols-2 gap-3">
            <L label="Price (USD)"><Input type="number" v={form.price} on={(v) => set("price", v)} required /></L>
            <L label="Compare-at price"><Input type="number" v={form.compare_at_price || ""} on={(v) => set("compare_at_price", v)} /></L>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <L label="Delivery type"><Select v={form.delivery_type} on={(v) => set("delivery_type", v)} options={[
              { v: "license", l: "License" }, { v: "download", l: "Download" }, { v: "membership", l: "Membership" }
            ]} /></L>
            <L label="License days (blank = lifetime)"><Input type="number" v={form.license_duration_days || ""} on={(v) => set("license_duration_days", v)} /></L>
          </div>
          {form.delivery_type === "download" && (
            <div className="grid grid-cols-2 gap-3">
              <L label="File path (in storage/products/)"><Input v={form.file_path || ""} on={(v) => set("file_path", v)} placeholder="spikebulls-indicator.zip" /></L>
              <L label="Max downloads"><Input type="number" v={form.max_downloads} on={(v) => set("max_downloads", v)} /></L>
            </div>
          )}
          <Row><L label="Features (one per line)"><Textarea v={form.features_text} on={(v) => set("features_text", v)} rows={5} /></L></Row>
          <Row><L label="Platforms (comma-separated)"><Input v={form.platforms_text} on={(v) => set("platforms_text", v)} placeholder="MetaTrader 5, VPS" /></L></Row>
          <Row><L label="Image URLs (one per line)"><Textarea v={form.images_text} on={(v) => set("images_text", v)} rows={3} placeholder="https://..." /></L></Row>
          <div className="grid grid-cols-2 gap-3">
            <L label="Status"><Select v={form.status} on={(v) => set("status", v)} options={[
              { v: "active", l: "Active" }, { v: "draft", l: "Draft" }, { v: "archived", l: "Archived" }
            ]} /></L>
            <L label="Badge (optional)"><Input v={form.badge || ""} on={(v) => set("badge", v)} placeholder="Most Popular" /></L>
          </div>
          <label className="flex items-center gap-2 text-[13px] text-zinc-300">
            <input type="checkbox" checked={!!form.highlight} onChange={(e) => set("highlight", e.target.checked)} />
            Highlight on landing page
          </label>

          <div className="sticky bottom-0 -mx-6 mt-6 px-6 py-4 bg-[#0A0B11] border-t border-white/[0.05] flex gap-2">
            <button disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Save</>}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Row({ children }) { return <div>{children}</div>; }
function L({ label, children }) { return <label className="block"><span className="text-[12px] text-zinc-400">{label}</span><div className="mt-2">{children}</div></label>; }
function Input({ v, on, type = "text", ...rest }) { return <input type={type} value={v ?? ""} onChange={(e) => on(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-[13.5px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400/50" {...rest} />; }
function Textarea({ v, on, rows, ...rest }) { return <textarea value={v} onChange={(e) => on(e.target.value)} rows={rows} className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-[13.5px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400/50 resize-none" {...rest} />; }
function Select({ v, on, options }) { return <select value={v} onChange={(e) => on(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-[13.5px] text-white focus:outline-none focus:border-blue-400/50">{options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select>; }
