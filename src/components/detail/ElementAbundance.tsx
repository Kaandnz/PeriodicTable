"use client";

import React from "react";
import { ElementData } from "@/types/element";
import { Globe2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ElementAbundance({ element }: { element: ElementData }) {
  const { t, lang } = useLanguage();
  const ab = element.abundance || {};

  const items = [
    { label: "Earth's Crust", value: ab.crust || "Trace / Not determined" },
    { label: "Oceans", value: ab.ocean || "Trace / Negligible" },
    { label: "Atmosphere", value: ab.atmosphere || "None / Zero" },
    { label: "Human Body", value: ab.humanBody || "Negligible / Trace" },
    { label: "Cosmic Universe", value: ab.universe || "Stellar Nucleosynthesis" },
    { label: t("crust"), value: ab.crust || (lang === "tr" ? "Eser / Belirlenmedi" : "Trace / Not determined") },
    { label: t("ocean"), value: ab.ocean || (lang === "tr" ? "Eser / İhmal edilebilir" : "Trace / Negligible") },
    { label: t("atmosphere"), value: ab.atmosphere || (lang === "tr" ? "Yok / Sıfır" : "None / Zero") },
    { label: t("humanBody"), value: ab.humanBody || (lang === "tr" ? "İhmal edilebilir / Eser" : "Negligible / Trace") },
    { label: t("universe"), value: ab.universe || (lang === "tr" ? "Yıldız Nükleosentezi" : "Stellar Nucleosynthesis") },
  ];

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] my-4">
      <div className="flex items-center gap-2 mb-3">
        <Globe2 className="w-4 h-4 text-cyan-400" />
        <h4 className="text-sm font-semibold text-white">Occurrence & Terrestrial Abundance</h4>
        <h4 className="text-sm font-semibold text-white">{t("abundanceSectionTitle")}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
        {items.map((item) => (
          <div key={item.label} className="p-2.5 rounded-xl bg-black/30 border border-white/[0.05]">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
              {item.label}
            </span>
            <span className="font-semibold text-slate-200 font-mono">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
