"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function PeriodicTrendsGuide() {
  const { getTrendsGuideData } = useLanguage();
  const guideData = getTrendsGuideData();

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12" id="trends-guide">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        <div className="lg:col-span-5">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block mb-1">
            {guideData.sectionTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            {guideData.sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed font-sans">
            {guideData.sectionDesc}
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guideData.items.map((t, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-4 border border-white/[0.08] hover:border-white/[0.18] transition-all bg-[#0c1017] shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-semibold text-slate-200">{t.direction}</span>
                  <span className="text-slate-500">{t.benchmark}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 font-sans">{t.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {t.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
