"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { PeriodicTable } from "@/components/table/PeriodicTable";
import { TrendVisualizer, getTrendColor } from "@/components/modes/TrendVisualizer";
import { ElementDetailModal } from "@/components/detail/ElementDetailModal";
import { HoverIntentProvider } from "@/components/hover/HoverIntentContext";
import { ElementHoverPreview } from "@/components/hover/ElementHoverPreview";
import { PeriodicTrendId } from "@/types/element";
import { PERIODIC_TRENDS } from "@/data/trends";
import { ELEMENTS } from "@/data/elements";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";

interface TrendClientPageProps {
  trend: string;
}

export default function TrendClientPage({ trend }: TrendClientPageProps) {
  const { t } = useLanguage();
  const validTrend = PERIODIC_TRENDS.some((t) => t.id === trend)
    ? (trend as PeriodicTrendId)
    : "electronegativity";

  const [activeTrend, setActiveTrend] = useState<PeriodicTrendId | null>(validTrend);
  const [selectedElementNumber, setSelectedElementNumber] = useState<number | null>(null);

  // Compute trend color map across all 118 elements
  const trendColorMap = useMemo(() => {
    if (!activeTrend) return {};

    let min = Infinity;
    let max = -Infinity;
    for (const el of ELEMENTS) {
      const val = el[activeTrend as keyof typeof el];
      if (typeof val === "number" && !isNaN(val)) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }

    const map: Record<number, string> = {};
    for (const el of ELEMENTS) {
      const val = el[activeTrend as keyof typeof el];
      if (typeof val === "number" && !isNaN(val)) {
        const c = getTrendColor(val, min, max);
        if (c) map[el.atomicNumber] = c;
      }
    }
    return map;
  }, [activeTrend]);

  return (
    <HoverIntentProvider>
      <div className="min-h-screen flex flex-col justify-between pt-20 px-2 sm:px-4">
        <Navbar activeMode="trends" />

        <main className="max-w-[1720px] mx-auto w-full flex-1 flex flex-col items-center">
          <div className="w-full max-w-4xl mb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Periodic Table</span>
              <span>{t("backToTable")}</span>
            </Link>
          </div>

          <TrendVisualizer
            activeTrend={activeTrend}
            onSelectTrend={setActiveTrend}
          />

          <PeriodicTable
            activeTrend={activeTrend}
            trendColorMap={trendColorMap}
            onSelectElement={(num) => setSelectedElementNumber(num)}
          />

          <ElementHoverPreview onSelectElement={(num) => setSelectedElementNumber(num)} />

          <ElementDetailModal
            elementNumber={selectedElementNumber}
            onClose={() => setSelectedElementNumber(null)}
            onSelectElement={(num) => setSelectedElementNumber(num)}
          />
        </main>

        <footer className="py-6 text-center text-xs text-slate-500 font-mono">
          Elementa Periodic Laboratory • Periodic Trends Visualization
          <div className="flex items-center justify-center gap-2 mb-1 text-slate-400">
            <span className="font-semibold text-slate-300">Elementa Periodic Laboratory</span>
            <span>•</span>
            <span>{t("navTrends")}</span>
          </div>
          <p className="text-[11px] text-slate-600">{t("footerDisclaimer")}</p>
        </footer>
      </div>
    </HoverIntentProvider>
  );
}
