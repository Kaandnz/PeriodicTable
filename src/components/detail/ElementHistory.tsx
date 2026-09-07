"use client";

import React from "react";
import { ElementData } from "@/types/element";
import { Calendar, User, MapPin, History } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ElementHistoryProps {
  element: ElementData;
}

export function ElementHistory({ element }: ElementHistoryProps) {
  const { t, getElementStory } = useLanguage();

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] my-4">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-cyan-400" />
        <h4 className="text-sm font-semibold text-white">Discovery & Historical Chronicle</h4>
        <h4 className="text-sm font-semibold text-white">{t("historyTitle")}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3 text-xs">
        <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider">Year</span>
            <span className="text-[10px] uppercase tracking-wider">{t("year")}</span>
          </div>
          <span className="font-semibold text-white font-mono">{element.discoveryYear ?? "Prehistoric Antiquity"}</span>
          <span className="font-semibold text-white font-mono">{element.discoveryYear ?? t("prehistoricAntiquity")}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider">Discoverer</span>
            <span className="text-[10px] uppercase tracking-wider">{t("discoverer")}</span>
          </div>
          <span className="font-semibold text-white truncate block">{element.discoveredBy}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider">Location / Origin</span>
            <span className="text-[10px] uppercase tracking-wider">{t("locationOrigin")}</span>
          </div>
          <span className="font-semibold text-white truncate block">{element.discoveryLocation || "Global"}</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-black/20 border border-white/[0.04]">
        {element.discoveryStory}
        {getElementStory(element)}
      </p>
    </div>
  );
}
