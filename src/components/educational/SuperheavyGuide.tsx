"use client";

import React from "react";
import { Atom } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function SuperheavyGuide() {
  const { getSuperheavyData } = useLanguage();
  const data = getSuperheavyData();

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 mb-16" id="superheavy">
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/[0.1] relative overflow-hidden bg-[#0c1017] shadow-modal">
        {/* Top mineral hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CC3E67] via-[#646DC7] to-[#758398]" />

        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider mb-2 pt-1">
          <Atom className="w-4 h-4 text-slate-300" />
          <span>{data.tag}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-sans tracking-tight">
          {data.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 max-w-3xl font-sans">
          {data.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-6">
          {data.cards.map((card, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#07090e] border border-white/[0.06] shadow-subtle">
              <span className="font-bold text-white font-sans block mb-1">{card.title}</span>
              <p className="text-slate-400 font-sans leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
