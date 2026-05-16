import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Activity } from "lucide-react";
import { BRAND, NAV_LINKS } from "../mock";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                className="px-4 py-2 text-[14px] text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNav("/contact")}
              className="text-[14px] text-zinc-400 hover:text-white transition-colors px-3 py-2"
            >
              Contact
            </button>
            <button
              onClick={() => handleNav("/pricing")}
              className="btn-primary !py-2 !px-4 !text-[14px]"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
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
              <button
                onClick={() => handleNav("/contact")}
                className="text-left px-4 py-3 text-[15px] text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg"
              >
                Contact
              </button>
              <button onClick={() => handleNav("/pricing")} className="btn-primary mt-2">
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
