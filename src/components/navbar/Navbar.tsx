"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Atom, Search, Command, Flame, Sparkles, SlidersHorizontal, Scale, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenCommandPalette?: () => void;
  activeMode?: "standard" | "temperature" | "trends" | "compare";
  onSelectMode?: (mode: "standard" | "temperature" | "trends" | "compare") => void;
}

export function Navbar({
  onOpenSearch,
  onOpenCommandPalette,
  activeMode = "standard",
  onSelectMode,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#07090e]/90 backdrop-blur-2xl border-b border-white/[0.07] shadow-2xl shadow-black/60 py-2.5"
          : "bg-transparent border-b border-transparent py-4"
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-3 text-slate-100 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg px-1 py-0.5"
          >
            {/* Minimalist Geometric Nucleus Emblem */}
            <div className="relative w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.12] flex items-center justify-center text-slate-200 group-hover:border-white/[0.25] group-hover:bg-white/[0.08] transition-all shadow-subtle">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-100 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-1 rounded-full border border-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider font-mono uppercase text-slate-100 group-hover:text-white transition-colors">
                Elementa
              </span>
              <span className="text-[9px] tracking-widest text-slate-500 uppercase -mt-0.5 font-mono">
                {t("brandSubtitle")}
              </span>
            </div>
          </Link>

          {/* Precision Segmented Dock Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0c1017]/90 p-1 rounded-xl border border-white/[0.07] shadow-subtle" aria-label="Main Navigation">
            <button
              onClick={() => onSelectMode?.("standard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeMode === "standard"
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.14]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              {t("navTable")}
            </button>
            <button
              onClick={() => onSelectMode?.("temperature")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeMode === "temperature"
                  ? "bg-amber-500/15 text-amber-200 shadow-sm border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400/90" />
              <span>{t("navThermodynamics")}</span>
            </button>
            <button
              onClick={() => onSelectMode?.("trends")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeMode === "trends"
                  ? "bg-purple-500/15 text-purple-200 shadow-sm border border-purple-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400/90" />
              <span>{t("navTrends")}</span>
            </button>
            <button
              onClick={() => onSelectMode?.("compare")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeMode === "compare"
                  ? "bg-cyan-500/15 text-cyan-200 shadow-sm border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-cyan-400/90" />
              <span>{t("navCompare")}</span>
            </button>
            <div className="w-px h-4 bg-white/[0.08] mx-0.5" />
            <a
              href="#learn"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all"
            >
              {t("navLearn")}
            </a>
          </nav>
        </div>

        {/* Right: Language Switcher, Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Pill (TR / EN) */}
          <div className="flex items-center bg-[#0c1017] p-0.5 rounded-lg border border-white/[0.1] shadow-subtle text-xs font-mono">
            <button
              type="button"
              onClick={() => setLang("tr")}
              className={`px-2 py-1 rounded-md transition-all font-semibold ${
                lang === "tr"
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Türkçe"
            >
              TR
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-md transition-all font-semibold ${
                lang === "en"
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-slate-200 text-xs transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 shadow-subtle"
            title={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{lang === "tr" ? "Element ara..." : "Search..."}</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/[0.05] border border-white/[0.1] rounded">
              /
            </kbd>
          </button>

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-slate-200 text-xs transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 shadow-subtle"
            title={t("commandPalette")}
            aria-label={t("commandPalette")}
          >
            <Command className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline font-mono text-[11px] text-slate-400">⌘K</span>
          </button>
        </div>
      </div>
    </header>
  );
}
