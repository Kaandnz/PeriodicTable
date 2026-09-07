"use client";

import React from "react";
import { ElementData } from "@/types/element";
import { ShieldCheck, Radio, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IsotopeTimelineProps {
  element: ElementData;
}

export function IsotopeTimeline({ element }: IsotopeTimelineProps) {
  const { t, lang } = useLanguage();
  const isotopes = element.isotopes || [];

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] my-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
            Nuclear Stability & Isotopes
            {t("isotopeTitle")}
          </span>
          <h4 className="text-sm font-semibold text-white">
            Primary Natural & Synthetic Isotopes
            {t("isotopeSubtitle")}
          </h4>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {element.isRadioactive ? "Radioactive Element" : "Has Stable Isotopes"}
          {element.isRadioactive ? t("radioactiveElement") : t("hasStableIsotopes")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {isotopes.map((iso) => (
          <div
            key={iso.massNumber}
            className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
              iso.isStable
                ? "bg-emerald-950/15 border-emerald-500/25 hover:border-emerald-500/40"
                : "bg-rose-950/15 border-rose-500/25 hover:border-rose-500/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-bold font-mono text-white">
                {iso.symbol}
              </span>
              <span
                className={`flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                  iso.isStable
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/30"
                }`}
              >
                {iso.isStable ? (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>Stable</span>
                    <span>{t("stable")}</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-3 h-3" />
                    <span>Radioactive</span>
                    <span>{t("radioactive")}</span>
                  </>
                )}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Natural Abundance:</span>
                <span>{t("naturalAbundance")}:</span>
                <span className="font-mono text-slate-200">
                  {iso.abundance !== null ? `${iso.abundance}%` : "Synthetic / Trace"}
                  {iso.abundance !== null ? `${iso.abundance}%` : t("syntheticTrace")}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Half-Life:</span>
                <span>{t("halfLife")}:</span>
                <span className="font-mono text-slate-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{iso.halfLife}</span>
                  <span>{iso.halfLife === "Stable" ? (lang === "tr" ? "Kararlı" : "Stable") : iso.halfLife}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
