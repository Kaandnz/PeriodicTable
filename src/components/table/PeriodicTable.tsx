"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ElementData, ElementCategory, PeriodicTrendId, ElementBlock, ElementPhase } from "@/types/element";
import { ELEMENTS, ELEMENTS_BY_NUMBER } from "@/data/elements";
import { ELEMENT_NAMES_TR } from "@/data/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { ElementCell } from "./ElementCell";
import { GroupHeaders, PeriodHeaders } from "./GridGuides";
import { useHoverIntent } from "../hover/HoverIntentContext";
import { SpecialFilter } from "./ElementFilterBar";

interface PeriodicTableProps {
  activeTrend?: PeriodicTrendId | null;
  trendColorMap?: Record<number, string>;
  temperatureK?: number | null;
  selectedCategories?: ElementCategory[];
  hoveredCategory?: ElementCategory | null;
  activeBlock?: ElementBlock | null;
  activePhase?: ElementPhase | null;
  activeSpecial?: SpecialFilter | null;
  searchQuery?: string;
  selectedElementNumber?: number | null;
  onSelectElement: (atomicNumber: number) => void;
}

export function PeriodicTable({
  activeTrend,
  trendColorMap = {},
  temperatureK,
  selectedCategories = [],
  hoveredCategory,
  activeBlock,
  activePhase,
  activeSpecial,
  searchQuery = "",
  selectedElementNumber,
  onSelectElement,
}: PeriodicTableProps) {
  const { hoveredElement } = useHoverIntent();
  const { lang, getCategoryName } = useLanguage();
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [hoveredPeriod, setHoveredPeriod] = useState<number | null>(null);

  // Derive active group and period from hovered element
  const activeGroup = hoveredGroup ?? hoveredElement?.group ?? null;
  const activePeriod = hoveredPeriod ?? hoveredElement?.period ?? null;

  // Search filter matching with bilingual support (Turkish & English)
  const searchNormalized = searchQuery.trim().toLowerCase();
  const isSearchActive = searchNormalized.length > 0;

  const matchesSearch = useCallback(
    (el: ElementData) => {
      if (!isSearchActive) return true;
      const turkishName = ELEMENT_NAMES_TR[el.atomicNumber]?.toLowerCase() || "";
      return (
        el.name.toLowerCase().includes(searchNormalized) ||
        turkishName.includes(searchNormalized) ||
        el.symbol.toLowerCase() === searchNormalized ||
        el.atomicNumber.toString() === searchNormalized ||
        el.category.toLowerCase().includes(searchNormalized) ||
        el.phaseAt293K.toLowerCase().includes(searchNormalized) ||
        el.block.toLowerCase() === searchNormalized ||
        (searchNormalized === "radioactive" && el.isRadioactive) ||
        (searchNormalized === "radyoaktif" && el.isRadioactive) ||
        (searchNormalized === "liquid" && el.phaseAt293K === "liquid") ||
        (searchNormalized === "sıvı" && el.phaseAt293K === "liquid") ||
        (searchNormalized === "sivi" && el.phaseAt293K === "liquid") ||
        (searchNormalized === "gas" && el.phaseAt293K === "gas") ||
        (searchNormalized === "gaz" && el.phaseAt293K === "gas") ||
        (searchNormalized === "solid" && el.phaseAt293K === "solid") ||
        (searchNormalized === "katı" && el.phaseAt293K === "solid") ||
        (searchNormalized === "kati" && el.phaseAt293K === "solid")
      );
    },
    [searchNormalized, isSearchActive]
  );

  const checkFilterDimmed = useCallback(
    (el: ElementData) => {
      if (!activeBlock && !activePhase && !activeSpecial) return false;

      const isBlockMatch = !activeBlock || el.block === activeBlock;
      const isPhaseMatch = !activePhase || el.phaseAt293K === activePhase;
      const isSpecialMatch =
        !activeSpecial ||
        (activeSpecial === "radioactive"
          ? el.isRadioactive
          : activeSpecial === "magnetic"
          ? ["Fe", "Co", "Ni", "Gd"].includes(el.symbol)
          : activeSpecial === "synthetic"
          ? el.isSynthetic
          : true);

      return !(isBlockMatch && isPhaseMatch && isSpecialMatch);
    },
    [activeBlock, activePhase, activeSpecial]
  );

  // Group elements by period and group coordinates
  // Periods 1 to 7 main table:
  const mainGridCells = useMemo(() => {
    const cells: Array<{ period: number; group: number; element?: ElementData; isLanthanidePlaceholder?: boolean; isActinidePlaceholder?: boolean }> = [];

    for (let p = 1; p <= 7; p++) {
      for (let g = 1; g <= 18; g++) {
        // Check for placeholder markers in Period 6 & 7 Group 3
        if (p === 6 && g === 3) {
          cells.push({ period: p, group: g, isLanthanidePlaceholder: true });
          continue;
        }
        if (p === 7 && g === 3) {
          cells.push({ period: p, group: g, isActinidePlaceholder: true });
          continue;
        }

        // Find standard element matching this period & group
        const el = ELEMENTS.find((item) => item.period === p && item.group === g);
        cells.push({ period: p, group: g, element: el });
      }
    }
    return cells;
  }, []);

  // Lanthanides (57-71) & Actinides (89-103)
  const lanthanides = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ELEMENTS_BY_NUMBER[57 + i]).filter(Boolean);
  }, []);

  const actinides = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ELEMENTS_BY_NUMBER[89 + i]).filter(Boolean);
  }, []);

  return (
    <section className="relative w-full max-w-[1720px] mx-auto px-2 sm:px-4 py-4" id="table" aria-label="Interactive Periodic Table of Elements">
      {/* Scrollable table container for smaller viewports */}
      <div className="w-full overflow-x-auto pb-4 pt-1">
        <div className="min-w-[1100px] xl:min-w-[1280px]">
          {/* Group 1-18 Headers */}
          <div className="flex">
            <div className="w-4 mr-1.5" /> {/* Period spacer */}
            <div className="flex-1">
              <GroupHeaders hoveredGroup={activeGroup} onSelectGroup={setHoveredGroup} />
            </div>
          </div>

          {/* Main 18x7 Periodic Grid */}
          <div className="flex items-start">
            {/* Period 1-7 Left Headers */}
            <PeriodHeaders hoveredPeriod={activePeriod} onSelectPeriod={setHoveredPeriod} />

            {/* 18-Column Grid */}
            <div className="grid grid-cols-18 gap-1 sm:gap-1.5 flex-1">
              {mainGridCells.map((cell, idx) => {
                if (cell.isLanthanidePlaceholder) {
                  return (
                    <div
                      key={`placeholder-lanthanide`}
                      className="rounded-lg border border-[#646DC7]/30 bg-[#646DC7]/[0.04] p-1 flex flex-col items-center justify-center text-center select-none shadow-subtle"
                    >
                      <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#8b93ea]">57–71</span>
                      <span className="text-[8px] sm:text-[9px] text-[#646DC7] uppercase font-medium mt-0.5">La–Lu</span>
                    </div>
                  );
                }

                if (cell.isActinidePlaceholder) {
                  return (
                    <div
                      key={`placeholder-actinide`}
                      className="rounded-lg border border-[#CC3E67]/30 bg-[#CC3E67]/[0.04] p-1 flex flex-col items-center justify-center text-center select-none shadow-subtle"
                    >
                      <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#ea6b90]">89–103</span>
                      <span className="text-[8px] sm:text-[9px] text-[#CC3E67] uppercase font-medium mt-0.5">Ac–Lr</span>
                    </div>
                  );
                }

                if (!cell.element) {
                  // Faint grid guide for empty slots
                  return (
                    <div
                      key={`empty-${cell.period}-${cell.group}`}
                      className="rounded-lg border border-white/[0.015] bg-transparent pointer-events-none"
                    />
                  );
                }

                const el = cell.element;
                const isMatch = matchesSearch(el);
                const isCatHighlighted =
                  selectedCategories.includes(el.category) || hoveredCategory === el.category;
                const isCatDimmed =
                  (selectedCategories.length > 0 || hoveredCategory !== null) && !isCatHighlighted;
                const isGPSelected =
                  (hoveredGroup !== null && el.group === hoveredGroup) ||
                  (hoveredPeriod !== null && el.period === hoveredPeriod);
                const isGPDimmed =
                  (hoveredGroup !== null || hoveredPeriod !== null) && !isGPSelected;

                const isFilterDimmed = checkFilterDimmed(el);

                return (
                  <ElementCell
                    key={el.atomicNumber}
                    element={el}
                    activeTrend={activeTrend}
                    trendColor={trendColorMap[el.atomicNumber] || null}
                    temperatureK={temperatureK}
                    isCategoryHighlighted={isCatHighlighted}
                    isCategoryDimmed={isCatDimmed}
                    isGroupPeriodHighlighted={isGPSelected}
                    isGroupPeriodDimmed={isGPDimmed}
                    isSearchMatch={isMatch}
                    isSearchActive={isSearchActive}
                    isFilterDimmed={isFilterDimmed}
                    isSelected={selectedElementNumber === el.atomicNumber}
                    onSelect={onSelectElement}
                  />
                );
              })}
            </div>
          </div>

          {/* Spacer between main table and f-block */}
          <div className="h-4 sm:h-6" />

          {/* Lanthanide & Actinide Series (f-block rows) */}
          <div className="flex items-start">
            <div className="w-4 mr-1.5" />
            <div className="flex-1 grid grid-cols-18 gap-1 sm:gap-1.5">
              {/* Row 1: Lanthanides label + 15 elements (columns 3-17) */}
              <div className="col-span-2 flex items-center justify-end pr-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#8b93ea] font-semibold">
                  {getCategoryName("lanthanide", "Lanthanides")}
                </span>
              </div>
              {lanthanides.map((el) => {
                const isMatch = matchesSearch(el);
                const isCatHighlighted =
                  selectedCategories.includes(el.category) || hoveredCategory === el.category;
                const isCatDimmed =
                  (selectedCategories.length > 0 || hoveredCategory !== null) && !isCatHighlighted;
                const isFilterDimmed = checkFilterDimmed(el);

                return (
                  <ElementCell
                    key={el.atomicNumber}
                    element={el}
                    activeTrend={activeTrend}
                    trendColor={trendColorMap[el.atomicNumber] || null}
                    temperatureK={temperatureK}
                    isCategoryHighlighted={isCatHighlighted}
                    isCategoryDimmed={isCatDimmed}
                    isSearchMatch={isMatch}
                    isSearchActive={isSearchActive}
                    isFilterDimmed={isFilterDimmed}
                    isSelected={selectedElementNumber === el.atomicNumber}
                    onSelect={onSelectElement}
                  />
                );
              })}
              <div className="col-span-1" /> {/* Col 18 empty */}

              {/* Row 2: Actinides label + 15 elements (columns 3-17) */}
              <div className="col-span-2 flex items-center justify-end pr-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#ea6b90] font-semibold">
                  {getCategoryName("actinide", "Actinides")}
                </span>
              </div>
              {actinides.map((el) => {
                const isMatch = matchesSearch(el);
                const isCatHighlighted =
                  selectedCategories.includes(el.category) || hoveredCategory === el.category;
                const isCatDimmed =
                  (selectedCategories.length > 0 || hoveredCategory !== null) && !isCatHighlighted;
                const isFilterDimmed = checkFilterDimmed(el);

                return (
                  <ElementCell
                    key={el.atomicNumber}
                    element={el}
                    activeTrend={activeTrend}
                    trendColor={trendColorMap[el.atomicNumber] || null}
                    temperatureK={temperatureK}
                    isCategoryHighlighted={isCatHighlighted}
                    isCategoryDimmed={isCatDimmed}
                    isSearchMatch={isMatch}
                    isSearchActive={isSearchActive}
                    isFilterDimmed={isFilterDimmed}
                    isSelected={selectedElementNumber === el.atomicNumber}
                    onSelect={onSelectElement}
                  />
                );
              })}
              <div className="col-span-1" /> {/* Col 18 empty */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
