import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Users,
  Mail,
  Star,
  Key,
  LogOut,
  Activity,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: Receipt },
  { to: "/admin/licenses", label: "Licenses", icon: Key },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/leads", label: "Leads", icon: Mail },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-app flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <Link to="/" className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-200">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <Activity className="h-4 w-4 text-slate-900" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[16px] font-semibold tracking-tight text-slate-900">
            SpikeBulls
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500">Admin</span>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors ${
                  isActive
                    ? "bg-slate-200 text-slate-900 border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent"
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white">
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-500/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <div className="mt-3 px-3 text-[11px] text-slate-500">
            <div className="text-slate-700 truncate">{user?.name}</div>
            <div className="truncate">{user?.email}</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {/* mobile bar */}
        <div className="md:hidden flex items-center justify-between px-5 h-14 border-b border-slate-200 bg-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-slate-900" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[14px] font-semibold tracking-tight text-slate-900">Admin</span>
          </Link>
          <button onClick={() => { logout(); navigate("/"); }} className="text-[12px] text-rose-600">Sign out</button>
        </div>
        {/* mobile nav */}
        <div className="md:hidden overflow-x-auto border-b border-slate-200 bg-white">
          <div className="flex gap-1 px-3 py-2 w-max">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] whitespace-nowrap ${
                  isActive ? "bg-slate-200 text-slate-900" : "text-slate-600"
                }`}>
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="p-6 sm:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
