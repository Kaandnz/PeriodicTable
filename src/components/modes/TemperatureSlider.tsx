"use client";

import React, { useMemo } from "react";
import { ELEMENTS } from "@/data/elements";
import { Flame, Snowflake, Sun, Droplet, Wind, Box } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TemperatureSliderProps {
  temperatureK: number;
  unit: "K" | "C" | "F";
  onChangeTemperature: (k: number) => void;
  onChangeUnit: (unit: "K" | "C" | "F") => void;
  onReset: () => void;
}

export function TemperatureSlider({
  temperatureK,
  unit,
  onChangeTemperature,
  onChangeUnit,
  onReset,
}: TemperatureSliderProps) {
  const { lang, t, getTemperaturePresets } = useLanguage();

  // Convert current temperature to active unit display
  const displayValue = useMemo(() => {
    if (unit === "C") return (temperatureK - 273.15).toFixed(1) + " °C";
    if (unit === "F") return (((temperatureK - 273.15) * 9) / 5 + 32).toFixed(1) + " °F";
    return temperatureK.toFixed(0) + " K";
  }, [temperatureK, unit]);

  // Compute live state counts across all 118 elements
  const stateCounts = useMemo(() => {
    let solids = 0;
    let liquids = 0;
    let gases = 0;
    let unknowns = 0;

    for (const el of ELEMENTS) {
      if (el.meltingPoint !== null && temperatureK < el.meltingPoint) {
        solids++;
      } else if (
        el.meltingPoint !== null &&
        el.boilingPoint !== null &&
        temperatureK >= el.meltingPoint &&
        temperatureK < el.boilingPoint
      ) {
        liquids++;
      } else if (el.boilingPoint !== null && temperatureK >= el.boilingPoint) {
        gases++;
      } else {
        unknowns++;
      }
    }
    return { solids, liquids, gases, unknowns };
  }, [temperatureK]);

  // Scientific preset icon map
  const presetIcons = [Snowflake, Snowflake, Droplet, Box, Wind, Flame, Sun];
  const presets = useMemo(() => {
    const raw = getTemperaturePresets();
    return raw.map((p, idx) => ({
      ...p,
      icon: presetIcons[idx] || Snowflake,
    }));
  }, [getTemperaturePresets]);

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel-elevated rounded-2xl p-4 sm:p-5 border border-white/[0.1] my-3 shadow-modal relative overflow-hidden" id="thermo-console">
      {/* Header with Title, Live Display, Unit Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-amber-400 shadow-subtle">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-sans">{t("thermoSimTitle")}</h3>
            <p className="text-[11px] text-slate-400 font-sans">{t("thermoSimSubtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Temperature Readout */}
          <span className="font-mono text-base font-bold text-amber-300 tabular-nums px-3 py-1 rounded-lg bg-[#07090e] border border-amber-500/30 shadow-subtle">
            {displayValue}
          </span>

          {/* Unit Toggle */}
          <div className="flex items-center bg-[#07090e] p-0.5 rounded-lg border border-white/[0.08]">
            {(["K", "C", "F"] as const).map((u) => (
              <button
                key={u}
                onClick={() => onChangeUnit(u)}
                className={`px-2 py-0.5 text-xs font-mono font-medium rounded transition-all ${
                  unit === u ? "bg-white/[0.15] text-white font-bold shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                °{u === "K" ? "K" : u}
              </button>
            ))}
          </div>

          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-white/[0.04] transition-colors"
          >
            {t("resetTemp")}
          </button>
        </div>
      </div>

      {/* Main Range Slider with Calibration Notches */}
      <div className="py-4">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={6000}
            step={5}
            value={temperatureK}
            onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
            aria-label="Thermodynamic temperature slider"
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5 px-0.5">
          <span>0 K ({lang === "tr" ? "Mutlak Sıfır" : "Abs Zero"})</span>
          <span>77 K (LN₂)</span>
          <span>273 K ({lang === "tr" ? "H₂O Donma" : "H₂O Freeze"})</span>
          <span>373 K ({lang === "tr" ? "H₂O Kaynama" : "H₂O Boil"})</span>
          <span>1337 K ({lang === "tr" ? "Au Erime" : "Au Melt"})</span>
          <span>6000 K ({lang === "tr" ? "Güneş" : "Solar"})</span>
        </div>
      </div>

      {/* Quick Scientific Jump Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-3">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-1">{t("criticalPoints")}</span>
        {presets.map((p) => {
          const Icon = p.icon;
          const isActive = Math.abs(temperatureK - p.tempK) < 5;
          return (
            <button
              key={p.label}
              onClick={() => onChangeTemperature(p.tempK)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans transition-all border shadow-subtle ${
                isActive
                  ? "bg-amber-500/15 text-amber-200 border-amber-500/40 ring-1 ring-amber-500/20"
                  : "bg-white/[0.03] text-slate-400 hover:text-slate-200 border-white/[0.06] hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="w-3 h-3 text-slate-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Phase Breakdown Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/[0.06]">
        <div className="bg-[#07090e]/80 rounded-xl p-2.5 border border-white/[0.05] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">{t("solids")}</span>
            <span className="text-xs text-slate-500 font-mono">
              {((stateCounts.solids / 118) * 100).toFixed(0)}%
            </span>
          </div>
          <span className="text-base font-bold text-slate-200 font-mono tabular-nums">{stateCounts.solids}</span>
        </div>
        <div className="bg-[#07090e]/80 rounded-xl p-2.5 border border-white/[0.05] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] text-cyan-400/90 uppercase font-mono tracking-wider block">{t("liquids")}</span>
            <span className="text-xs text-slate-500 font-mono">
              {((stateCounts.liquids / 118) * 100).toFixed(0)}%
            </span>
          </div>
          <span className="text-base font-bold text-cyan-300 font-mono tabular-nums">{stateCounts.liquids}</span>
        </div>
        <div className="bg-[#07090e]/80 rounded-xl p-2.5 border border-white/[0.05] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-400/90 uppercase font-mono tracking-wider block">{t("gases")}</span>
            <span className="text-xs text-slate-500 font-mono">
              {((stateCounts.gases / 118) * 100).toFixed(0)}%
            </span>
          </div>
          <span className="text-base font-bold text-rose-300 font-mono tabular-nums">{stateCounts.gases}</span>
        </div>
        <div className="bg-[#07090e]/80 rounded-xl p-2.5 border border-white/[0.05] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">{t("unknownState")}</span>
            <span className="text-xs text-slate-600 font-mono">{t("syntheticState")}</span>
          </div>
          <span className="text-base font-bold text-slate-400 font-mono tabular-nums">{stateCounts.unknowns}</span>
        </div>
      </div>
    </div>
  );
}
