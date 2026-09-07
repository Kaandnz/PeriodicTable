"use client";

import React from "react";
import { ElementData } from "@/types/element";
import { Radio, AlertTriangle, ShieldCheck, Flame, Skull, Sparkles, Lightbulb } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function SafetyAndBio({ element }: { element: ElementData }) {
  const { t, getBioStatus, getHazardLabel } = useLanguage();
  const hazards = element.safetyHazards || [];

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Biological Role */}
        <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.05]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white">Biological Function</span>
            <span className="text-xs font-semibold text-white">{t("bioFunctionTitle")}</span>
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                element.biologicalStatus === "essential"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : element.biologicalStatus === "toxic"
                  ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                  : "bg-slate-500/15 text-slate-300 border-slate-500/30"
              }`}
            >
              {element.biologicalStatus}
              {getBioStatus(element.biologicalStatus)}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {element.biologicalRole}
          </p>
        </div>

        {/* Safety Hazards */}
        <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.05]">
          <span className="text-xs font-semibold text-white block mb-2">
            Safety & Handling Precautions
            {t("safetyPrecautionsTitle")}
          </span>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {hazards.length === 0 ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>No severe acute hazards under standard conditions</span>
                <span>{t("noAcuteHazards")}</span>
              </span>
            ) : (
              hazards.map((h) => (
                <span
                  key={h}
                  className="flex items-center gap-1 text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{h}</span>
                  <span>{getHazardLabel(h)}</span>
                </span>
              ))
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            For academic laboratory guidance. Always consult official Material Safety Data Sheets (MSDS).
            {t("msdsNotice")}
          </p>
        </div>
      </div>

      {/* Verified Scientific Fun Fact (Section 46) */}
      <div className="p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/25 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide block">
            Did You Know?
            {t("didYouKnow")}
          </span>
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans">
            {element.funFact}
          </p>
        </div>
      </div>
    </div>
  );
}
