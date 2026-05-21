import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Twitter, Youtube, Send, MessageCircle } from "lucide-react";
import { BRAND, FOOTER_LINKS } from "../mock";

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8">
        <div className="grid lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden bg-slate-100">
                <img src="/spikebulls-logo.png" alt="SpikeBulls Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-display text-[17px] font-semibold tracking-tight text-slate-900">
                {BRAND.name}
              </span>
            </Link>
            <p className="mt-4 text-[14px] text-slate-600 leading-relaxed max-w-xs">
              {BRAND.tagline}. Built by traders, for traders who refuse to gamble.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <SocialLink href={BRAND.social.twitter} icon={Twitter} />
              <SocialLink href={BRAND.social.youtube} icon={Youtube} />
              <SocialLink href={BRAND.social.telegram} icon={Send} />
              <SocialLink href={BRAND.social.discord} icon={MessageCircle} />
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[12px] uppercase tracking-[0.18em] text-slate-500 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("/") ? (
                      <Link
                        to={l.href}
                        className="text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[12px] text-slate-500">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400 max-w-2xl sm:text-right">
            Risk disclosure: Trading derivatives carries substantial risk and may not be suitable for all investors. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }) {
  return (
    <a
      href={href}
      className="h-9 w-9 rounded-lg glass flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
