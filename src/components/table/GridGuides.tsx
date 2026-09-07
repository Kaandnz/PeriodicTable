"use client";

import React from "react";

interface GridGuidesProps {
  hoveredGroup: number | null;
  hoveredPeriod: number | null;
  onSelectGroup?: (group: number) => void;
  onSelectPeriod?: (period: number) => void;
}

export function GroupHeaders({ hoveredGroup, onSelectGroup }: { hoveredGroup: number | null; onSelectGroup?: (g: number) => void }) {
  const groups = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-18 gap-1 sm:gap-1.5 w-full mb-1 text-center select-none" aria-hidden="true">
      {groups.map((g) => {
        const isHovered = hoveredGroup === g;
        return (
          <div
            key={g}
            onClick={() => onSelectGroup?.(g)}
            className={`text-[10px] sm:text-[11px] font-mono font-medium transition-colors py-0.5 rounded cursor-pointer ${
              isHovered
                ? "text-slate-100 bg-white/[0.08] font-bold border border-white/[0.12]"
                : "text-slate-500 hover:text-slate-300"
            }`}
            title={`Group ${g} — Click to highlight column`}
          >
            {g}
          </div>
        );
      })}
    </div>
  );
}

export function PeriodHeaders({ hoveredPeriod, onSelectPeriod }: { hoveredPeriod: number | null; onSelectPeriod?: (p: number) => void }) {
  const periods = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-1 sm:gap-1.5 select-none mr-1.5" aria-hidden="true">
      {periods.map((p) => {
        const isHovered = hoveredPeriod === p;
        return (
          <div
            key={p}
            onClick={() => onSelectPeriod?.(p)}
            className={`w-4 h-14 sm:h-16 flex items-center justify-center text-[10px] sm:text-[11px] font-mono font-medium transition-colors rounded cursor-pointer ${
              isHovered
                ? "text-slate-100 bg-white/[0.08] font-bold border border-white/[0.12]"
                : "text-slate-500 hover:text-slate-300"
            }`}
            title={`Period ${p} — Click to highlight row`}
          >
            {p}
          </div>
        );
      })}
    </div>
  );
}
