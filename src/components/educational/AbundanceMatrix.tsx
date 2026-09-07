"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Sparkles, User, Orbit, ArrowUpRight } from "lucide-react";

interface AbundanceMatrixProps {
  onSelectElement?: (atomicNumber: number) => void;
}

type AbundanceDomain = "universe" | "crust" | "humanBody";

export function AbundanceMatrix({ onSelectElement }: AbundanceMatrixProps) {
  const { t, lang, getElementName } = useLanguage();
  const [activeDomain, setActiveDomain] = useState<AbundanceDomain>("universe");

  const domainData = {
    universe: {
      title: lang === "tr" ? "Evrendeki Element Dağılımı" : "Elemental Abundance in the Universe",
      desc:
        lang === "tr"
          ? "Büyük Patlama nükleosentezi ve yıldız füzyonu sonucu oluşan kozmik element bolluğu (kütlece yaklaşık oranlar)."
          : "Cosmic elemental mass distribution originating from Big Bang nucleosynthesis and stellar fusion.",
      elements: [
        { num: 1, sym: "H", pct: 73.9, color: "#8461d4" },
        { num: 2, sym: "He", pct: 24.0, color: "#d24792" },
        { num: 8, sym: "O", pct: 1.04, color: "#8461d4" },
        { num: 6, sym: "C", pct: 0.46, color: "#8461d4" },
        { num: 10, sym: "Ne", pct: 0.13, color: "#d24792" },
        { num: 26, sym: "Fe", pct: 0.11, color: "#3b82c4" },
        { num: 7, sym: "N", pct: 0.10, color: "#8461d4" },
      ],
    },
    crust: {
      title: lang === "tr" ? "Yer Kabuğundaki Element Dağılımı" : "Elemental Abundance in Earth's Crust",
      desc:
        lang === "tr"
          ? "Gezegenimizin katı kabuğunu ve silikat kayalarını oluşturan başlıca elementler (kütlece %)."
          : "Primary elemental building blocks comprising the planet's solid crust and silicate minerals (mass %).",
      elements: [
        { num: 8, sym: "O", pct: 46.1, color: "#8461d4" },
        { num: 14, sym: "Si", pct: 28.2, color: "#2ca779" },
        { num: 13, sym: "Al", pct: 8.23, color: "#2da599" },
        { num: 26, sym: "Fe", pct: 5.63, color: "#3b82c4" },
        { num: 20, sym: "Ca", pct: 4.15, color: "#d97736" },
        { num: 11, sym: "Na", pct: 2.36, color: "#dc4c4c" },
        { num: 12, sym: "Mg", pct: 2.33, color: "#d97736" },
        { num: 19, sym: "K", pct: 2.09, color: "#dc4c4c" },
      ],
    },
    humanBody: {
      title: lang === "tr" ? "İnsan Vücudundaki Element Dağılımı" : "Elemental Composition of Human Body",
      desc:
        lang === "tr"
          ? "Canlı biyokimyasını, suyu, DNA'yı, proteinleri ve iskelet sistemini oluşturan temel elementler."
          : "Biochemical elemental composition constituting water, DNA, amino acids, and the human skeletal structure.",
      elements: [
        { num: 8, sym: "O", pct: 65.0, color: "#8461d4" },
        { num: 6, sym: "C", pct: 18.5, color: "#8461d4" },
        { num: 1, sym: "H", pct: 9.5, color: "#8461d4" },
        { num: 7, sym: "N", pct: 3.2, color: "#8461d4" },
        { num: 20, sym: "Ca", pct: 1.5, color: "#d97736" },
        { num: 15, sym: "P", pct: 1.0, color: "#8461d4" },
        { num: 19, sym: "K", pct: 0.4, color: "#dc4c4c" },
        { num: 16, sym: "S", pct: 0.3, color: "#8461d4" },
      ],
    },
  };

  const current = domainData[activeDomain];

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 my-8">
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0c1017]/90 border border-white/[0.12] shadow-card">
        {/* Header with Domain Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded-md bg-white/[0.05] text-cyan-400">
                <Globe className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                {t("abundanceTitle")}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight font-sans">
              {current.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
              {current.desc}
            </p>
          </div>

          {/* Domain Segmented Control */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.08] shrink-0 text-xs font-mono">
            <button
              onClick={() => setActiveDomain("universe")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeDomain === "universe"
                  ? "bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>{t("universe")}</span>
            </button>
            <button
              onClick={() => setActiveDomain("crust")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeDomain === "crust"
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t("crust")}</span>
            </button>
            <button
              onClick={() => setActiveDomain("humanBody")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeDomain === "humanBody"
                  ? "bg-rose-500/20 text-rose-200 border border-rose-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t("humanBody")}</span>
            </button>
          </div>
        </div>

        {/* Abundance Progress Bars List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {current.elements.map((el) => {
            const elName = getElementName(el.num, el.sym);
            return (
              <div
                key={el.num}
                onClick={() => onSelectElement?.(el.num)}
                className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer group flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="font-mono text-sm font-bold w-9 h-9 rounded-xl flex items-center justify-center border"
                      style={{
                        color: el.color,
                        borderColor: `${el.color}40`,
                        backgroundColor: `${el.color}15`,
                      }}
                    >
                      {el.sym}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                          {elName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">#{el.num}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-slate-100 tabular-nums">
                      %{el.pct}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/[0.05]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, Math.max(3, el.pct))}%`,
                      backgroundColor: el.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
