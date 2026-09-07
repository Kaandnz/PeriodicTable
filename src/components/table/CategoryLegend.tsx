"use client";

import React, { useMemo } from "react";
import { ElementCategory } from "@/types/element";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { ELEMENTS } from "@/data/elements";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryLegendProps {
  selectedCategories: ElementCategory[];
  hoveredCategory: ElementCategory | null;
  onToggleCategory: (cat: ElementCategory) => void;
  onHoverCategory: (cat: ElementCategory | null) => void;
  onClearCategories: () => void;
}

export function CategoryLegend({
  selectedCategories,
  hoveredCategory,
  onToggleCategory,
  onHoverCategory,
  onClearCategories,
}: CategoryLegendProps) {
  const { getCategoryName, t } = useLanguage();
  const categoriesList = Object.values(ELEMENT_CATEGORIES);

  // Compute live element counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const el of ELEMENTS) {
      counts[el.category] = (counts[el.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-3 pb-1 px-2" aria-label="Element Categories Legend">
      {categoriesList.map((cat) => {
        const isSelected = selectedCategories.includes(cat.id);
        const isHovered = hoveredCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;

        const localizedName = getCategoryName(cat.id, cat.name);

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onToggleCategory(cat.id)}
            onMouseEnter={() => onHoverCategory(cat.id)}
            onMouseLeave={() => onHoverCategory(null)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-sans transition-all border shadow-subtle ${
              isSelected
                ? "bg-white/[0.12] text-white border-white/[0.3] ring-1 ring-white/20"
                : isHovered
                ? "bg-white/[0.06] text-slate-200 border-white/[0.2]"
                : "bg-[#0c1017]/80 text-slate-400 hover:text-slate-200 border-white/[0.07]"
            }`}
            title={`${localizedName} (${count})`}
          >
            {/* Color accent chip */}
            <span
              className="w-2 h-2 rounded-[2px] transition-transform"
              style={{
                backgroundColor: cat.color,
              }}
            />
            <span className="font-medium">{localizedName}</span>
            <span className="text-[10px] font-mono text-slate-500 tabular-nums">
              {count}
            </span>
          </button>
        );
      })}

      {selectedCategories.length > 0 && (
        <button
          type="button"
          onClick={onClearCategories}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all ml-1 font-sans"
        >
          {t("clearFilters")} ({selectedCategories.length})
        </button>
      )}
    </div>
  );
}
