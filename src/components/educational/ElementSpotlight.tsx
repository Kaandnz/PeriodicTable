"use client";

import React, { useState, useTransition } from "react";
import { ELEMENTS } from "@/data/elements";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Dices, ArrowRight, Atom, Compass, Globe, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ElementSpotlightProps {
  onSelectElement: (atomicNumber: number) => void;
  onCompareElement?: (atomicNumber: number) => void;
}

export function ElementSpotlight({ onSelectElement, onCompareElement }: ElementSpotlightProps) {
  const { t, lang, getElementName, getCategoryName, getPhaseName, getElementSummary } = useLanguage();
  const [currentNumber, setCurrentNumber] = useState<number>(22); // Default Titanium
  const [isPending, startTransition] = useTransition();

  const element = ELEMENTS.find((el) => el.atomicNumber === currentNumber) || ELEMENTS[0];
  const category = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];

  const handleRandomElement = () => {
    startTransition(() => {
      let nextNum = Math.floor(Math.random() * 118) + 1;
      while (nextNum === currentNumber) {
        nextNum = Math.floor(Math.random() * 118) + 1;
      }
      setCurrentNumber(nextNum);
    });
  };

  const localizedName = getElementName(element.atomicNumber, element.name);
  const localizedCat = getCategoryName(element.category, category.name);
  const localizedPhase = getPhaseName(element.phaseAt293K);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 my-8">
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0c1017]/90 border border-white/[0.12] shadow-modal overflow-hidden">
        {/* Mineral hairline & ambient glow */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: category.color }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: category.color }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left Column: Title & Controls */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                {t("spotlightTitle")}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans flex items-center gap-3">
              <span>{localizedName}</span>
              <span
                className="font-mono text-xl sm:text-2xl font-black px-2.5 py-0.5 rounded-lg border"
                style={{
                  color: category.color,
                  borderColor: category.borderColor,
                  backgroundColor: category.bgGlow,
                }}
              >
                {element.symbol}
              </span>
            </h3>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed font-sans">
              {element.shortDescription}
              {getElementSummary(element)}
            </p>

            {element.funFact && (
              <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-slate-300 flex items-start gap-2.5">
                <span className="font-bold text-amber-400 shrink-0 font-mono">
                  {lang === "tr" ? "BİLİYOR MUYDUNUZ?" : "DID YOU KNOW?"}
                </span>
                <span className="leading-relaxed">{element.funFact}</span>
              </div>
            )}
          </div>

          {/* Center / Right: Specimen Placard & Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Quick Metrics Badge Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">{t("categoryName" as any) || "Kategori"}</span>
                <span className="text-[10px] text-slate-500 uppercase block">{lang === "tr" ? "Kategori" : "Category"}</span>
                <span className="font-semibold text-slate-200 truncate block mt-0.5">
                  {localizedCat}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">{t("phase")}</span>
                <span className="font-semibold text-slate-200 capitalize block mt-0.5">
                  {localizedPhase}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">{t("atomicMass")}</span>
                <span className="text-slate-200 tabular-nums block mt-0.5">
                  {element.atomicMass} u
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">{t("discovered")}</span>
                <span className="text-slate-200 block mt-0.5 truncate">
                  {element.discoveryYear ?? "Antik"}
                  {element.discoveryYear ?? (lang === "tr" ? "Antik" : "Ancient")}
                </span>
              </div>
            </div>

            {/* Actions Stack */}
            <div className="flex flex-col gap-2.5 shrink-0">
              <button
                onClick={() => onSelectElement(element.atomicNumber)}
                className="py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 text-white bg-white/[0.1] hover:bg-white/[0.18] border border-white/[0.2] transition-all shadow-subtle group"
              >
                <span>{t("viewElementAnalysis")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleRandomElement}
                className="py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
              >
                <Dices className="w-4 h-4 text-cyan-400" />
                <span>{t("randomElement")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
