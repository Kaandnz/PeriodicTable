"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { ElementComparison } from "@/components/modes/ElementComparison";
import { ElementDetailModal } from "@/components/detail/ElementDetailModal";
import { ArrowLeft, Scale } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function ComparePage() {
  const { t } = useLanguage();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([6, 14, 32]); // Carbon, Silicon, Germanium
  const [detailNumber, setDetailNumber] = useState<number | null>(null);

  const handleAddElement = (num: number) => {
    setSelectedNumbers((prev) => (prev.includes(num) ? prev : [...prev.slice(0, 3), num]));
  };

  const handleRemoveElement = (num: number) => {
    setSelectedNumbers((prev) => prev.filter((n) => n !== num));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-20 px-4">
      <Navbar activeMode="compare" />

      <main className="max-w-5xl mx-auto w-full flex-1">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Periodic Table</span>
            <span>{t("backToTable")}</span>
          </Link>
        </div>

        <ElementComparison
          selectedNumbers={selectedNumbers}
          onAddElement={handleAddElement}
          onRemoveElement={handleRemoveElement}
          onClearComparison={() => setSelectedNumbers([])}
          onOpenElementDetail={(num) => setDetailNumber(num)}
        />

        <ElementDetailModal
          elementNumber={detailNumber}
          onClose={() => setDetailNumber(null)}
          onSelectElement={(num) => setDetailNumber(num)}
        />
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 font-mono">
        Elementa Periodic Laboratory • Multi-Element Scientific Comparison
        <div className="flex items-center justify-center gap-2 mb-1 text-slate-400">
          <span className="font-semibold text-slate-300">Elementa Periodic Laboratory</span>
          <span>•</span>
          <span>{t("compareMatrixTitle")}</span>
        </div>
        <p className="text-[11px] text-slate-600">{t("footerDisclaimer")}</p>
      </footer>
    </div>
  );
}
