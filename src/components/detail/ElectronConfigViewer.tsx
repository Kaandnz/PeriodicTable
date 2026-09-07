"use client";

import React, { useMemo } from "react";
import { ElementData } from "@/types/element";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { useLanguage } from "@/context/LanguageContext";

interface ElectronConfigViewerProps {
  element: ElementData;
}

export function ElectronConfigViewer({ element }: ElectronConfigViewerProps) {
  const { t } = useLanguage();
  const category = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];

  // Parse valence subshells roughly for orbital visualization
  const orbitals = useMemo(() => {
    // Generate standard subshell breakdown according to Aufbau principle
    const subshells = [
      { name: "1s", type: "s", capacity: 2, boxes: 1 },
      { name: "2s", type: "s", capacity: 2, boxes: 1 },
      { name: "2p", type: "p", capacity: 6, boxes: 3 },
      { name: "3s", type: "s", capacity: 2, boxes: 1 },
      { name: "3p", type: "p", capacity: 6, boxes: 3 },
      { name: "4s", type: "s", capacity: 2, boxes: 1 },
      { name: "3d", type: "d", capacity: 10, boxes: 5 },
      { name: "4p", type: "p", capacity: 6, boxes: 3 },
      { name: "5s", type: "s", capacity: 2, boxes: 1 },
      { name: "4d", type: "d", capacity: 10, boxes: 5 },
      { name: "5p", type: "p", capacity: 6, boxes: 3 },
      { name: "6s", type: "s", capacity: 2, boxes: 1 },
      { name: "4f", type: "f", capacity: 14, boxes: 7 },
      { name: "5d", type: "d", capacity: 10, boxes: 5 },
      { name: "6p", type: "p", capacity: 6, boxes: 3 },
      { name: "7s", type: "s", capacity: 2, boxes: 1 },
      { name: "5f", type: "f", capacity: 14, boxes: 7 },
      { name: "6d", type: "d", capacity: 10, boxes: 5 },
      { name: "7p", type: "p", capacity: 6, boxes: 3 },
    ];

    let remaining = element.atomicNumber;
    const filled = [];

    for (const sub of subshells) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, sub.capacity);
      filled.push({ ...sub, count });
      remaining -= count;
    }

    // Return the outermost subshells (up to last 6 for clarity)
    return filled.slice(-6);
  }, [element.atomicNumber]);

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] my-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
            Electron Configuration Notation
            {t("electronConfigNotation")}
          </span>
          <span
            className="text-base sm:text-lg font-mono font-bold tracking-tight"
            style={{ color: category.color }}
          >
            {element.electronConfiguration}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
            Block: <strong className="text-white uppercase">{element.block}</strong>
            {t("blockNotation")}: <strong className="text-white uppercase">{element.block}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
            Shells: <strong className="text-white">{element.shells.join(" • ")}</strong>
            {t("shellsNotation")}: <strong className="text-white">{element.shells.join(" • ")}</strong>
          </span>
        </div>
      </div>

      {/* Orbital Box Diagram (Hund's Rule & Pauli Exclusion Representation) */}
      <div>
        <span className="text-[11px] font-mono font-medium text-slate-400 block mb-2.5">
          Valence Quantum Orbital Diagram (s, p, d, f)
          {t("orbitalValenceTitle")}
        </span>

        <div className="flex flex-wrap items-end gap-3 sm:gap-4 overflow-x-auto pb-2">
          {orbitals.map((orb) => {
            // Distribute electrons into boxes according to Hund's rule
            const boxElectrons = Array.from({ length: orb.boxes }, () => 0);
            for (let i = 0; i < orb.count; i++) {
              boxElectrons[i % orb.boxes]++;
            }

            return (
              <div key={orb.name} className="flex flex-col items-center">
                {/* Boxes container */}
                <div className="flex border border-white/[0.2] rounded-lg overflow-hidden bg-black/40">
                  {boxElectrons.map((electronsInBox, bIdx) => (
                    <div
                      key={bIdx}
                      className="w-7 h-9 border-r last:border-r-0 border-white/[0.1] flex items-center justify-center gap-0.5 text-xs font-mono"
                    >
                      {electronsInBox >= 1 && (
                        <span className="text-emerald-400 font-bold" title={t("spinUp")}>↑</span>
                      )}
                      {electronsInBox === 2 && (
                        <span className="text-amber-400 font-bold" title={t("spinDown")}>↓</span>
                      )}
                      {electronsInBox === 0 && (
                        <span className="text-slate-700 select-none">•</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subshell Label */}
                <div className="mt-1 text-[11px] font-mono font-semibold text-slate-300">
                  {orb.name}
                  <sup className="text-[10px] text-emerald-400 ml-0.5 font-bold">{orb.count}</sup>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
