"use client";

import React from "react";
import { ElementBlock, ElementPhase } from "@/types/element";
import { useLanguage } from "@/context/LanguageContext";
import { Layers, Flame, Radio, Magnet, X } from "lucide-react";

export type SpecialFilter = "radioactive" | "magnetic" | "synthetic";

interface ElementFilterBarProps {
  activeBlock: ElementBlock | null;
  onSelectBlock: (block: ElementBlock | null) => void;
  activePhase: ElementPhase | null;
  onSelectPhase: (phase: ElementPhase | null) => void;
  activeSpecial: SpecialFilter | null;
  onSelectSpecial: (special: SpecialFilter | null) => void;
  onClearAll: () => void;
}

export function ElementFilterBar({
  activeBlock,
  onSelectBlock,
  activePhase,
  onSelectPhase,
  activeSpecial,
  onSelectSpecial,
  onClearAll,
}: ElementFilterBarProps) {
  const { t, lang } = useLanguage();

  const hasActiveFilters = activeBlock !== null || activePhase !== null || activeSpecial !== null;

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
      <div className="flex flex-wrap items-center gap-3">
        {/* Block Filters */}
        <div className="flex items-center gap-1 bg-[#0c1017]/80 p-1 rounded-xl border border-white/[0.07] shadow-subtle">
          <span className="text-[10px] text-slate-500 uppercase px-2 font-semibold flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>{t("blockFilterTitle")}</span>
          </span>
          {(["s", "p", "d", "f"] as ElementBlock[]).map((block) => {
            const isActive = activeBlock === block;
            return (
              <button
                key={block}
                onClick={() => onSelectBlock(isActive ? null : block)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all font-semibold ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {block}-blok
                {block}{lang === "tr" ? "-blok" : "-block"}
              </button>
            );
          })}
        </div>

        {/* Phase / State of Matter Filters */}
        <div className="flex items-center gap-1 bg-[#0c1017]/80 p-1 rounded-xl border border-white/[0.07] shadow-subtle">
          <span className="text-[10px] text-slate-500 uppercase px-2 font-semibold">
            {t("stateFilterTitle")}
          </span>
          {[
            { id: "solid" as ElementPhase, label: lang === "tr" ? "Katı" : "Solid", count: 105 },
            { id: "liquid" as ElementPhase, label: lang === "tr" ? "Sıvı" : "Liquid", count: 2 },
            { id: "gas" as ElementPhase, label: lang === "tr" ? "Gaz" : "Gas", count: 11 },
          ].map((item) => {
            const isActive = activePhase === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPhase(isActive ? null : item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
                  isActive
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] opacity-60 tabular-nums">({item.count})</span>
              </button>
            );
          })}
        </div>

        {/* Special Property Filters */}
        <div className="flex items-center gap-1 bg-[#0c1017]/80 p-1 rounded-xl border border-white/[0.07] shadow-subtle">
          <span className="text-[10px] text-slate-500 uppercase px-2 font-semibold">
            {t("specialFilterTitle")}
          </span>
          <button
            onClick={() => onSelectSpecial(activeSpecial === "radioactive" ? null : "radioactive")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
              activeSpecial === "radioactive"
                ? "bg-rose-500/20 text-rose-200 border border-rose-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <Radio className="w-3 h-3 text-rose-400" />
            <span>{t("radioactiveOnly")}</span>
          </button>
          <button
            onClick={() => onSelectSpecial(activeSpecial === "magnetic" ? null : "magnetic")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
              activeSpecial === "magnetic"
                ? "bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <Magnet className="w-3 h-3 text-purple-400" />
            <span>{t("ferromagneticOnly")}</span>
          </button>
          <button
            onClick={() => onSelectSpecial(activeSpecial === "synthetic" ? null : "synthetic")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
              activeSpecial === "synthetic"
                ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <span>{lang === "tr" ? "Sentetik" : "Synthetic"}</span>
          </button>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>{t("clearFilters")}</span>
        </button>
      )}
    </div>
  );
}
