"use client";

import React, { useRef, useState, useCallback, memo } from "react";
import { ElementData, ElementPhase, PeriodicTrendId } from "@/types/element";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { useHoverIntent } from "../hover/HoverIntentContext";
import { useLanguage } from "@/context/LanguageContext";
import { Radio } from "lucide-react";

interface ElementCellProps {
  element: ElementData;
  activeTrend?: PeriodicTrendId | null;
  trendColor?: string | null; // Precalculated hex/rgba from TrendVisualizer
  temperatureK?: number | null; // Current simulated temperature
  isCategoryHighlighted?: boolean;
  isCategoryDimmed?: boolean;
  isGroupPeriodHighlighted?: boolean;
  isGroupPeriodDimmed?: boolean;
  isSearchMatch?: boolean;
  isSearchActive?: boolean;
  isFilterDimmed?: boolean;
  isSelected?: boolean;
  onSelect: (atomicNumber: number) => void;
}

export const ElementCell = memo(function ElementCell({
  element,
  activeTrend,
  trendColor,
  temperatureK,
  isCategoryHighlighted,
  isCategoryDimmed,
  isGroupPeriodHighlighted,
  isGroupPeriodDimmed,
  isSearchMatch = true,
  isSearchActive = false,
  isFilterDimmed = false,
  isSelected = false,
  onSelect,
}: ElementCellProps) {
  const cellRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const { hoveredElement, hoverProgress, hoverStage, onElementPointerEnter, onElementPointerLeave } = useHoverIntent();
  const { getElementName } = useLanguage();

  const isCurrentHovered = hoveredElement?.atomicNumber === element.atomicNumber;
  const category = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];
  const localizedName = getElementName(element.atomicNumber, element.name);

  // Determine current phase based on simulated temperature if active
  let currentPhase: ElementPhase = element.phaseAt293K;
  if (temperatureK !== null && temperatureK !== undefined) {
    if (element.meltingPoint !== null && temperatureK < element.meltingPoint) {
      currentPhase = "solid";
    } else if (
      element.meltingPoint !== null &&
      element.boilingPoint !== null &&
      temperatureK >= element.meltingPoint &&
      temperatureK < element.boilingPoint
    ) {
      currentPhase = "liquid";
    } else if (element.boilingPoint !== null && temperatureK >= element.boilingPoint) {
      currentPhase = "gas";
    } else if (element.meltingPoint === null && element.boilingPoint === null) {
      currentPhase = "unknown";
    }
  }

  // Handle pointer tracking for subtle internal illumination (Section 57)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    onElementPointerEnter(element, rect);
  }, [element, onElementPointerEnter]);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
    onElementPointerLeave(element);
  }, [element, onElementPointerLeave]);

  // Determine opacity / dimming states (Section 59)
  const isDimmed =
    (isSearchActive && !isSearchMatch) ||
    isCategoryDimmed ||
    isGroupPeriodDimmed ||
    isFilterDimmed ||
    (hoverStage === "dimSurrounding" && !isCurrentHovered);

  // SVG Progress Ring calculations (Section 8: 700ms - 2000ms hover intent ring)
  const showRing = isCurrentHovered && hoverProgress > 0.35; // Starts drawing after 700ms (700/2000 = 0.35)
  const ringProgress = showRing ? (hoverProgress - 0.35) / 0.65 : 0;
  const strokeDashoffset = 100 - ringProgress * 100;

  return (
    <div
      ref={cellRef}
      role="button"
      tabIndex={0}
      aria-label={`${element.name}, atomic number ${element.atomicNumber}, symbol ${element.symbol}`}
      onClick={() => onSelect(element.atomicNumber)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(element.atomicNumber);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        borderColor: isSelected
          ? category.color
          : isCurrentHovered
          ? category.color
          : isCategoryHighlighted
          ? category.color
          : "rgba(255, 255, 255, 0.08)",
        backgroundColor: trendColor ? trendColor : undefined,
        opacity: isDimmed ? 0.3 : 1,
        transform: isCurrentHovered ? "translateY(-3px)" : undefined,
      }}
      className={`relative select-none cursor-pointer rounded-lg p-1 sm:p-1.5 flex flex-col justify-between transition-all duration-150 border shadow-subtle ${
        trendColor ? "" : "bg-[#0c1017] hover:bg-[#121824]"
      } ${
        currentPhase === "liquid"
          ? "phase-liquid-shimmer"
          : currentPhase === "gas"
          ? "phase-gas-aura"
          : ""
      } ${
        isSelected
          ? "ring-1 ring-white/40 shadow-card-hover"
          : isCurrentHovered
          ? "shadow-card-hover z-10"
          : ""
      }`}
    >
      {/* Top mineral indicator accent line */}
      <div
        className="absolute top-0 left-1 right-1 h-[2px] rounded-full transition-opacity"
        style={{
          backgroundColor: category.color,
          opacity: isCurrentHovered || isSelected || isCategoryHighlighted ? 1 : 0.6,
        }}
      />

      {/* Pointer-reactive subtle spotlight highlight */}
      {mousePos && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle 50px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.08), transparent 80%)`,
          }}
        />
      )}

      {/* 2-Second Hover Progress Halo around card */}
      {showRing && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none rounded-lg z-20"
          style={{ overflow: "visible" }}
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="7"
            fill="none"
            stroke={category.color}
            strokeWidth="1.5"
            strokeDasharray="100"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>
      )}

      {/* Top row: Atomic number & radioactive micro-indicator */}
      <div className="flex items-center justify-between w-full text-[9px] sm:text-[10px] leading-none font-mono text-slate-400 pt-0.5">
        <span className="tabular-nums font-semibold text-slate-300">{element.atomicNumber}</span>
        {element.isRadioactive && (
          <span title="Radioactive Element" className="text-amber-400/90">
            <Radio className="w-2.5 h-2.5" />
          </span>
        )}
      </div>

      {/* Center: Chemical Symbol */}
      <div className="my-auto text-center py-0.5">
        <span
          className="text-base sm:text-lg md:text-xl font-bold tracking-tight font-mono leading-none block"
          style={{
            color: isCurrentHovered ? "#ffffff" : trendColor ? "#ffffff" : category.color,
          }}
        >
          {element.symbol}
        </span>
      </div>

      {/* Bottom row: Element Name & Atomic Mass */}
      <div className="w-full text-center overflow-hidden pb-0.5">
        <span className="text-[9px] sm:text-[10px] font-medium text-slate-200 truncate block leading-tight">
          {localizedName}
        </span>
        <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono tabular-nums truncate block leading-none mt-0.5">
          {typeof element.atomicMass === "number"
            ? element.atomicMass.toFixed(element.atomicMass < 10 ? 3 : 2)
            : element.atomicMass}
        </span>
      </div>
    </div>
  );
});
