import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Activity, User, LogOut, LayoutDashboard, Shield, Package, ChevronDown } from "lucide-react";
import { BRAND } from "../mock";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Hide chrome on admin routes (admin layout has its own sidebar)
  if (location.pathname.startsWith("/admin")) return null;

  const handleNav = (href) => {
    setOpen(false);
    if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 80);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
            scrolled ? "glass-strong" : "bg-transparent border border-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-[0_0_24px_-4px_rgba(96,165,250,0.6)]">
              <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[17px] font-semibold tracking-tight text-white">
              {BRAND.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className={`px-4 py-2 text-[14px] transition-colors rounded-lg hover:bg-white/[0.04] ${
                  location.pathname === link.href ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass hover:border-white/15 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-[11px] font-medium text-white">
                    {user.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "U"}
                  </div>
                  <span className="text-[13px] text-zinc-200 max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 mt-2 w-56 glass-strong rounded-xl p-1.5 shadow-xl"
                    >
                      <MenuItem icon={LayoutDashboard} label="Dashboard" onClick={() => { setUserMenu(false); navigate("/dashboard"); }} />
                      <MenuItem icon={Package} label="My Licenses" onClick={() => { setUserMenu(false); navigate("/dashboard?tab=licenses"); }} />
                      <MenuItem icon={User} label="Account" onClick={() => { setUserMenu(false); navigate("/dashboard?tab=account"); }} />
                      {isAdmin && (
                        <>
                          <div className="my-1 h-px bg-white/[0.06]" />
                          <MenuItem icon={Shield} label="Admin Panel" onClick={() => { setUserMenu(false); navigate("/admin"); }} accent />
                        </>
                      )}
                      <div className="my-1 h-px bg-white/[0.06]" />
                      <MenuItem icon={LogOut} label="Log out" onClick={handleLogout} danger />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-[14px] text-zinc-300 hover:text-white transition-colors px-3 py-2"
                >
                  Sign in
                </button>
                <button onClick={() => navigate("/register")} className="btn-primary !py-2 !px-4 !text-[14px]">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden h-9 w-9 rounded-lg glass flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden mt-2 glass-strong rounded-2xl p-3 flex flex-col gap-1"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className="text-left px-4 py-3 text-[15px] text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg"
                >
                  {link.label}
                </button>
              ))}
              <div className="my-1 h-px bg-white/[0.06]" />
              {user ? (
                <>
                  <button onClick={() => { setOpen(false); navigate("/dashboard"); }} className="text-left px-4 py-3 text-[15px] text-zinc-200 hover:bg-white/[0.04] rounded-lg">
                    Dashboard
                  </button>
                  {isAdmin && (
                    <button onClick={() => { setOpen(false); navigate("/admin"); }} className="text-left px-4 py-3 text-[15px] text-blue-300 hover:bg-white/[0.04] rounded-lg">
                      Admin Panel
                    </button>
                  )}
                  <button onClick={handleLogout} className="text-left px-4 py-3 text-[15px] text-rose-300 hover:bg-white/[0.04] rounded-lg">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setOpen(false); navigate("/login"); }} className="text-left px-4 py-3 text-[15px] text-zinc-200 hover:bg-white/[0.04] rounded-lg">
                    Sign in
                  </button>
                  <button onClick={() => { setOpen(false); navigate("/register"); }} className="btn-primary mt-2">
                    Get Started <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger, accent }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13.5px] hover:bg-white/[0.05] transition-colors ${
        danger ? "text-rose-300" : accent ? "text-blue-300" : "text-zinc-200"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
