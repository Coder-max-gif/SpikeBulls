import React, { useEffect, useState } from "react";
import { Loader2, Shield, ShieldOff, UserCog } from "lucide-react";
import { api } from "../../lib/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/users").then((r) => setUsers(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setRole = async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, null, { params: { role } });
    load();
  };
  const toggleActive = async (id, is_active) => {
    await api.patch(`/admin/users/${id}/active`, null, { params: { is_active } });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[32px] text-white font-semibold tracking-tight">Users</h1>
        <p className="text-zinc-400 text-[14px] mt-1">{users.length} registered accounts</p>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-500" /> : (
        <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-zinc-500 text-[11.5px] uppercase tracking-wider border-b border-white/[0.05]">
              <th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.03] last:border-0">
                  <td className="px-5 py-3 text-white">{u.name}</td>
                  <td className="px-5 py-3 text-zinc-200">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${u.role === "admin" ? "bg-violet-500/15 text-violet-300" : "bg-blue-500/10 text-blue-300"}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${u.is_active ? "bg-emerald-500/10 text-emerald-300" : "bg-zinc-500/15 text-zinc-300"}`}>{u.is_active ? "active" : "disabled"}</span>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setRole(u.id, u.role === "admin" ? "user" : "admin")}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-zinc-300 hover:text-white hover:bg-white/[0.04]">
                      <UserCog className="h-3.5 w-3.5" /> {u.role === "admin" ? "Demote" : "Promote"}
                    </button>
                    <button onClick={() => toggleActive(u.id, !u.is_active)}
                      className={`ml-1 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] ${u.is_active ? "text-rose-300 hover:bg-rose-500/10" : "text-emerald-300 hover:bg-emerald-500/10"}`}>
                      {u.is_active ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                      {u.is_active ? "Disable" : "Enable"}
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
