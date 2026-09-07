"use client";

import React, { useMemo } from "react";
import { PeriodicTrendId } from "@/types/element";
import { PERIODIC_TRENDS } from "@/data/trends";
import { ELEMENTS } from "@/data/elements";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, X, Info } from "lucide-react";

interface TrendVisualizerProps {
  activeTrend: PeriodicTrendId | null;
  onSelectTrend: (trend: PeriodicTrendId | null) => void;
  onColorMapChange?: (map: Record<number, string>) => void;
}

export function TrendVisualizer({
  activeTrend,
  onSelectTrend,
}: TrendVisualizerProps) {
  const { t, getTrendInfo } = useLanguage();
  const currentTrendDef = useMemo(() => {
    return PERIODIC_TRENDS.find((t) => t.id === activeTrend) || null;
  }, [activeTrend]);

  const activeTrendInfo = useMemo(() => {
    if (!activeTrend) return null;
    return getTrendInfo(activeTrend);
  }, [activeTrend, getTrendInfo]);

  // Compute min, max, and value range for active trend
  const { minVal, maxVal } = useMemo(() => {
    if (!activeTrend) return { minVal: 0, maxVal: 1 };
    let min = Infinity;
    let max = -Infinity;

    for (const el of ELEMENTS) {
      const val = el[activeTrend as keyof typeof el];
      if (typeof val === "number" && !isNaN(val)) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }
    return {
      minVal: min === Infinity ? 0 : min,
      maxVal: max === -Infinity ? 100 : max,
    };
  }, [activeTrend]);

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel-elevated rounded-2xl p-4 sm:p-5 border border-white/[0.1] my-3 shadow-modal relative overflow-hidden" id="trends-console">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-purple-400 shadow-subtle">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-sans">Periodic Trends Continuous Heatmap</h3>
            <p className="text-[11px] text-slate-400 font-sans">Empirical metric graduation across periodic periods and groups</p>
            <h3 className="text-sm font-semibold text-slate-100 font-sans">{t("trendsHeatmapTitle")}</h3>
            <p className="text-[11px] text-slate-400 font-sans">{t("trendsHeatmapSubtitle")}</p>
          </div>
        </div>

        {activeTrend && (
          <button
            onClick={() => onSelectTrend(null)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
          >
            <X className="w-3 h-3" />
            <span>Clear Trend</span>
            <X className="w-3.5 h-3.5" />
            <span>{t("clearTrend")}</span>
          </button>
        )}
      </div>

      {/* Trend Selector Pills */}
      <div className="flex flex-wrap items-center gap-1.5 py-3">
        {PERIODIC_TRENDS.map((trendDef) => {
          const isSelected = activeTrend === trendDef.id;
          const info = getTrendInfo(trendDef.id);
          return (
            <button
              key={trendDef.id}
              onClick={() => onSelectTrend(isSelected ? null : trendDef.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all border shadow-subtle ${
                isSelected
                  ? "bg-white/[0.12] text-white border-white/[0.3] ring-1 ring-white/20"
                  : "bg-[#07090e] text-slate-400 hover:text-slate-200 border-white/[0.07] hover:bg-white/[0.04]"
              }`}
            >
              {info.name}
            </button>
          );
        })}
      </div>

      {/* Active Trend Legend & Information */}
      {activeTrendInfo && (
        <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 max-w-lg">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <span className="font-semibold text-white">{activeTrendInfo.name}:</span>{" "}
              {activeTrendInfo.description}
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex flex-col items-end w-full sm:w-auto">
            <div className="flex items-center justify-between w-48 text-[10px] font-mono text-slate-400 mb-1">
              <span>{minVal} {activeTrendInfo.unit || currentTrendDef?.unit}</span>
              <span>{maxVal} {activeTrendInfo.unit || currentTrendDef?.unit}</span>
            </div>
            <div className="w-48 h-2 rounded-full bg-gradient-to-r from-[#1d2440] via-[#2ca779] to-[#e5a93c] border border-white/[0.1] shadow-inner" />
            <div className="flex items-center justify-between w-48 text-[9px] font-mono text-slate-500 mt-1">
              <span>{activeTrendInfo.lowerIsBetterLabel}</span>
              <span>{activeTrendInfo.higherIsBetterLabel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Scientifically calibrated perceptual continuous color ramp
export function getTrendColor(val: number | null | undefined, min: number, max: number): string | null {
  if (val === null || val === undefined || isNaN(val)) return null;
  const clamped = Math.max(min, Math.min(val, max));
  const t = max > min ? (clamped - min) / (max - min) : 0.5;

  // Continuous ramp from deep indigo-navy (#1d2440) -> mineral jade (#2ca779) -> gold amber (#e5a93c)
  if (t < 0.5) {
    const factor = t * 2;
    const r = Math.round(29 + factor * (44 - 29));
    const g = Math.round(36 + factor * (167 - 36));
    const b = Math.round(64 + factor * (121 - 64));
    return `rgba(${r}, ${g}, ${b}, 0.85)`;
  } else {
    const factor = (t - 0.5) * 2;
    const r = Math.round(44 + factor * (229 - 44));
    const g = Math.round(167 + factor * (169 - 167));
    const b = Math.round(121 + factor * (60 - 121));
    return `rgba(${r}, ${g}, ${b}, 0.88)`;
  }
}
