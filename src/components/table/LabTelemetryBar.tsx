"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Activity, ShieldCheck, Thermometer, Droplet, Sparkles, Scale } from "lucide-react";

interface LabTelemetryBarProps {
  onSelectElement?: (atomicNumber: number) => void;
}

export function LabTelemetryBar({ onSelectElement }: LabTelemetryBarProps) {
  const { t, lang, getElementName } = useLanguage();

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 py-2">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs font-mono scrollbar-thin">
        {/* Metric 1: Total Elements */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] shrink-0 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">{t("telemetryTotal")}:</span>
          <span className="text-white font-bold tabular-nums">118</span>
          <span className="text-[10px] text-slate-500">(94 {lang === "tr" ? "Doğal" : "Natural"} · 24 {lang === "tr" ? "Sentetik" : "Synthetic"})</span>
        </div>

        {/* Metric 2: Room Temp Liquids */}
        <div
          onClick={() => onSelectElement?.(80)} // Mercury
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] shrink-0 text-slate-300 cursor-pointer transition-colors"
          title={lang === "tr" ? "Cıva (#80) & Brom (#35)" : "Mercury (#80) & Bromine (#35)"}
        >
          <Droplet className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">{t("telemetryLiquids")}:</span>
          <span className="text-amber-200 font-bold">2</span>
          <span className="text-[10px] text-slate-400">({getElementName(80, "Mercury")} · {getElementName(35, "Bromine")})</span>
        </div>

        {/* Metric 3: Highest Melting Point */}
        <div
          onClick={() => onSelectElement?.(74)} // Tungsten
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] shrink-0 text-slate-300 cursor-pointer transition-colors"
          title={lang === "tr" ? "Volfram (#74) - 3695 K" : "Tungsten (#74) - 3695 K"}
        >
          <Thermometer className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-400">{t("telemetryHighestMelting")}:</span>
          <span className="text-rose-200 font-bold">{getElementName(74, "Tungsten")}</span>
          <span className="text-[10px] text-slate-500 tabular-nums">3695 K</span>
        </div>

        {/* Metric 4: Highest Density */}
        <div
          onClick={() => onSelectElement?.(76)} // Osmium
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] shrink-0 text-slate-300 cursor-pointer transition-colors"
          title={lang === "tr" ? "Osmiyum (#76) - 22.59 g/cm³" : "Osmium (#76) - 22.59 g/cm³"}
        >
          <Scale className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">{t("telemetryHighestDensity")}:</span>
          <span className="text-indigo-200 font-bold">{getElementName(76, "Osmium")}</span>
          <span className="text-[10px] text-slate-500 tabular-nums">22.59 g/cm³</span>
        </div>

        {/* Metric 5: Highest Electronegativity */}
        <div
          onClick={() => onSelectElement?.(9)} // Fluorine
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] shrink-0 text-slate-300 cursor-pointer transition-colors"
          title={lang === "tr" ? "Flor (#9) - 3.98 Pauling" : "Fluorine (#9) - 3.98 Pauling"}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">{lang === "tr" ? "En Elektronegatif" : "Most Electronegative"}:</span>
          <span className="text-emerald-200 font-bold">{getElementName(9, "Fluorine")}</span>
          <span className="text-[10px] text-slate-500 tabular-nums">3.98</span>
        </div>
      </div>
    </div>
  );
}
