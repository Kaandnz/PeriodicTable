"use client";

import React from "react";
import { History, Sparkles, BookOpen, Atom } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function HistoryOfTable() {
  const { t, getMilestones } = useLanguage();
  const milestones = getMilestones();

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12" id="history">
      <div className="mb-10">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block mb-1">
          {t("historyLedger")}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
          {t("historyTitle")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
          {t("historySub")}
        </p>
      </div>

      <div className="relative border-l border-white/[0.08] ml-4 sm:ml-28 pl-6 sm:pl-8 space-y-6">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative group">
            {/* Minimalist Timeline node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-2.5 w-3 h-3 rounded-full bg-[#07090e] border border-white/40 group-hover:border-white group-hover:bg-white transition-colors" />

            {/* Year Tag */}
            <div className="sm:absolute sm:-left-28 sm:top-1.5 font-mono text-xs font-bold text-slate-300 mb-1 sm:mb-0 tabular-nums">
              {m.year}
            </div>

            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.07] hover:border-white/[0.14] transition-all bg-[#0c1017] shadow-subtle">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium block mb-1">
                {m.figure}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 font-sans">{m.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
