"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { PeriodicTable } from "@/components/table/PeriodicTable";
import { CategoryLegend } from "@/components/table/CategoryLegend";
import { ElementFilterBar, SpecialFilter } from "@/components/table/ElementFilterBar";
import { LabTelemetryBar } from "@/components/table/LabTelemetryBar";
import { HoverIntentProvider } from "@/components/hover/HoverIntentContext";
import { ElementHoverPreview } from "@/components/hover/ElementHoverPreview";
import { ElementDetailModal } from "@/components/detail/ElementDetailModal";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import { TemperatureSlider } from "@/components/modes/TemperatureSlider";
import { TrendVisualizer, getTrendColor } from "@/components/modes/TrendVisualizer";
import { ElementComparison } from "@/components/modes/ElementComparison";
import { SearchBar } from "@/components/search/SearchBar";
import { CommandPalette } from "@/components/search/CommandPalette";
import { HistoryOfTable } from "@/components/educational/HistoryOfTable";
import { PeriodicTrendsGuide } from "@/components/educational/PeriodicTrendsGuide";
import { SuperheavyGuide } from "@/components/educational/SuperheavyGuide";
import { ElementSpotlight } from "@/components/educational/ElementSpotlight";
import { AbundanceMatrix } from "@/components/educational/AbundanceMatrix";
import { ElementCategory, ElementBlock, ElementPhase, PeriodicTrendId } from "@/types/element";
import { ELEMENTS, ELEMENTS_BY_NUMBER } from "@/data/elements";
import { ELEMENT_NAMES_TR } from "@/data/i18n";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

function MainContent() {
  const { t } = useLanguage();
  // Main view modes
  const [activeMode, setActiveMode] = useState<"standard" | "temperature" | "trends" | "compare">("standard");

  // Temperature Simulation state
  const [temperatureK, setTemperatureK] = useState(293.15); // 20°C
  const [tempUnit, setTempUnit] = useState<"K" | "C" | "F">("K");

  // Periodic Trends state
  const [activeTrend, setActiveTrend] = useState<PeriodicTrendId | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ElementCategory[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<ElementCategory | null>(null);

  // New Block, State, and Special Filters
  const [activeBlock, setActiveBlock] = useState<ElementBlock | null>(null);
  const [activePhase, setActivePhase] = useState<ElementPhase | null>(null);
  const [activeSpecial, setActiveSpecial] = useState<SpecialFilter | null>(null);

  // Element Selection & Detail Modal state
  const [selectedElementNumber, setSelectedElementNumber] = useState<number | null>(null);

  // Mobile Bottom Sheet state
  const [mobileSelectedElementNumber, setMobileSelectedElementNumber] = useState<number | null>(null);

  // Comparison State
  const [comparisonNumbers, setComparisonNumbers] = useState<number[]>([6, 14, 32]); // Default Carbon, Silicon, Germanium

  // Command Palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "c" || e.key === "C") {
        if (selectedElementNumber) {
          e.preventDefault();
          handleAddComparison(selectedElementNumber);
        }
      } else if (e.key === "Escape") {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        if (selectedElementNumber) setSelectedElementNumber(null);
        if (mobileSelectedElementNumber) setMobileSelectedElementNumber(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementNumber, isCommandPaletteOpen, mobileSelectedElementNumber]);

  // Compute trend color map across all 118 elements when activeTrend is set
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

  // Handler for element click (Desktop opens detail, Mobile opens bottom sheet)
  const handleSelectElement = useCallback((atomicNumber: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      setMobileSelectedElementNumber(atomicNumber);
    } else {
      setSelectedElementNumber(atomicNumber);
    }
  }, []);

  const handleToggleCategory = useCallback((cat: ElementCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const handleAddComparison = useCallback((num: number) => {
    setComparisonNumbers((prev) => {
      if (prev.includes(num)) return prev;
      if (prev.length >= 4) return [...prev.slice(1), num];
      return [...prev, num];
    });
    setActiveMode("compare");
  }, []);

  const handleRemoveComparison = useCallback((num: number) => {
    setComparisonNumbers((prev) => prev.filter((n) => n !== num));
  }, []);

  const handleResetAll = useCallback(() => {
    setActiveMode("standard");
    setActiveTrend(null);
    setSearchQuery("");
    setSelectedCategories([]);
    setActiveBlock(null);
    setActivePhase(null);
    setActiveSpecial(null);
    setTemperatureK(293.15);
    setComparisonNumbers([6, 14, 32]);
  }, []);

  return (
    <HoverIntentProvider>
      <div className="min-h-screen flex flex-col justify-between">
        {/* Navbar */}
        <Navbar
          activeMode={activeMode}
          onSelectMode={(m) => {
            setActiveMode(m);
            if (m === "trends" && !activeTrend) setActiveTrend("electronegativity");
          }}
          onOpenSearch={() => {
            const el = document.querySelector("input[aria-label='Filter elements by symbol, name, atomic number, or phase...'], input[type='text']") as HTMLInputElement;
            el?.focus();
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-16 sm:pt-20 px-2 sm:px-4 flex flex-col items-center">
          {/* Top Controls Bar: Search, Category Legend & Filter Bar */}
          <div className="w-full max-w-[1720px] mx-auto flex flex-col items-center gap-2 mb-2">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPressEnter={() => {
                const q = searchQuery.trim().toLowerCase();
                const matches = ELEMENTS.filter((el) => {
                  const trName = ELEMENT_NAMES_TR[el.atomicNumber]?.toLowerCase() || "";
                  return (
                    el.name.toLowerCase().includes(q) ||
                    trName.includes(q) ||
                    el.symbol.toLowerCase() === q
                  );
                });
                if (matches.length > 0) {
                  handleSelectElement(matches[0].atomicNumber);
                }
              }}
            />

            {/* Category Legend Chips */}
            <CategoryLegend
              selectedCategories={selectedCategories}
              hoveredCategory={hoveredCategory}
              onToggleCategory={handleToggleCategory}
              onHoverCategory={setHoveredCategory}
              onClearCategories={() => setSelectedCategories([])}
            />

            {/* Quantum Block & State Filter Bar */}
            <ElementFilterBar
              activeBlock={activeBlock}
              onSelectBlock={setActiveBlock}
              activePhase={activePhase}
              onSelectPhase={setActivePhase}
              activeSpecial={activeSpecial}
              onSelectSpecial={setActiveSpecial}
              onClearAll={() => {
                setActiveBlock(null);
                setActivePhase(null);
                setActiveSpecial(null);
              }}
            />

            {/* Live Laboratory Telemetry Bar */}
            <LabTelemetryBar onSelectElement={handleSelectElement} />
          </div>

          {/* Interactive Mode Panels */}
          {activeMode === "temperature" && (
            <TemperatureSlider
              temperatureK={temperatureK}
              unit={tempUnit}
              onChangeTemperature={setTemperatureK}
              onChangeUnit={setTempUnit}
              onReset={() => setTemperatureK(293.15)}
            />
          )}

          {activeMode === "trends" && (
            <TrendVisualizer
              activeTrend={activeTrend}
              onSelectTrend={setActiveTrend}
            />
          )}

          {activeMode === "compare" && (
            <ElementComparison
              selectedNumbers={comparisonNumbers}
              onAddElement={handleAddComparison}
              onRemoveElement={handleRemoveComparison}
              onClearComparison={() => setComparisonNumbers([])}
              onOpenElementDetail={(num) => setSelectedElementNumber(num)}
            />
          )}

          {/* The Hero Periodic Table */}
          <PeriodicTable
            activeTrend={activeTrend}
            trendColorMap={trendColorMap}
            temperatureK={activeMode === "temperature" ? temperatureK : null}
            selectedCategories={selectedCategories}
            hoveredCategory={hoveredCategory}
            activeBlock={activeBlock}
            activePhase={activePhase}
            activeSpecial={activeSpecial}
            searchQuery={searchQuery}
            selectedElementNumber={selectedElementNumber}
            onSelectElement={handleSelectElement}
          />

          {/* Large Floating Preview Card (Desktop Hover Intent) */}
          <ElementHoverPreview onSelectElement={(num) => setSelectedElementNumber(num)} />

          {/* Mobile Bottom Sheet Preview */}
          <MobileBottomSheet
            element={mobileSelectedElementNumber ? ELEMENTS_BY_NUMBER[mobileSelectedElementNumber] : null}
            isOpen={mobileSelectedElementNumber !== null}
            onClose={() => setMobileSelectedElementNumber(null)}
            onExplore={(num) => setSelectedElementNumber(num)}
            onCompare={(num) => handleAddComparison(num)}
          />

          {/* Full Screen Element Detail Experience */}
          <ElementDetailModal
            elementNumber={selectedElementNumber}
            onClose={() => setSelectedElementNumber(null)}
            onSelectElement={(num) => setSelectedElementNumber(num)}
            onCompareElement={(num) => handleAddComparison(num)}
          />

          {/* Command Palette (Cmd+K) */}
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectElement={(num) => {
              setSelectedElementNumber(num);
              setIsCommandPaletteOpen(false);
            }}
            onSelectMode={(m) => {
              setActiveMode(m);
              if (m === "trends" && !activeTrend) setActiveTrend("electronegativity");
              setIsCommandPaletteOpen(false);
            }}
            onFilterCategory={(cat) => {
              setSelectedCategories([cat]);
              setIsCommandPaletteOpen(false);
            }}
            onSearchSpecial={(term) => {
              setSearchQuery(term);
              setIsCommandPaletteOpen(false);
            }}
            onReset={handleResetAll}
          />

          {/* Featured Laboratory Element Spotlight */}
          <ElementSpotlight
            onSelectElement={handleSelectElement}
            onCompareElement={handleAddComparison}
          />

          {/* Cosmic & Planetary Abundance Matrix */}
          <AbundanceMatrix onSelectElement={handleSelectElement} />

          {/* Educational Modules Below Table */}
          <div className="w-full max-w-[1720px] mx-auto mt-12 pt-8 border-t border-white/[0.08]" id="learn">
            <PeriodicTrendsGuide />
            <HistoryOfTable />
            <SuperheavyGuide />
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="w-full border-t border-white/[0.06] py-6 px-4 text-center text-xs text-slate-500 font-mono">
          <div className="flex items-center justify-center gap-2 mb-1 text-slate-400">
            <span className="font-semibold text-slate-300">Elementa Periodic Laboratory</span>
            <span>•</span>
            <span>All 118 Elements IUPAC Validated</span>
            <span>{t("footerVerified")}</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Scientific data sourced from standard IUPAC tables, NIST atomic reference data, and peer-reviewed journals.
            {t("footerDisclaimer")}
          </p>
        </footer>
      </div>
    </HoverIntentProvider>
  );
}

export default function HomePage() {
  return <MainContent />;
}
