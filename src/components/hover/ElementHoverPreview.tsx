"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHoverIntent } from "./HoverIntentContext";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { MiniAtomicModel } from "./MiniAtomicModel";
import { ArrowRight, X, Radio, Layers, Orbit } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ElementHoverPreviewProps {
  onSelectElement: (atomicNumber: number) => void;
}

export function ElementHoverPreview({ onSelectElement }: ElementHoverPreviewProps) {
  const { hoveredElement, hoveredRect, isPreviewOpen, closePreview } = useHoverIntent();
  const { lang, t, getElementName, getCategoryShortName, getPhaseName, getElementSummary } = useLanguage();

  // Compute collision-aware coordinates with generous margins
  const position = useMemo(() => {
    if (!hoveredRect || typeof window === "undefined") {
      return { top: 0, left: 0, width: 460, placement: "right" as const };
    }

    const CARD_WIDTH = Math.min(460, window.innerWidth - 32);
    const CARD_HEIGHT = 520;
    const OFFSET = 24; // Generous margin away from hovered element wafer
    const PADDING = 24; // Generous viewport margin

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = hoveredRect.right + OFFSET;
    let top = hoveredRect.top + hoveredRect.height / 2 - CARD_HEIGHT / 2;
    let placement: "right" | "left" | "top" | "bottom" = "right";

    // If overflows right, try left
    if (left + CARD_WIDTH > viewportWidth - PADDING) {
      left = hoveredRect.left - CARD_WIDTH - OFFSET;
      placement = "left";
    }

    // If still overflows left (narrow screens), place top or bottom
    if (left < PADDING) {
      left = Math.max(PADDING, Math.min(hoveredRect.left, viewportWidth - CARD_WIDTH - PADDING));
      if (hoveredRect.bottom + CARD_HEIGHT + OFFSET < viewportHeight - PADDING) {
        top = hoveredRect.bottom + OFFSET;
        placement = "bottom";
      } else {
        top = Math.max(PADDING, hoveredRect.top - CARD_HEIGHT - OFFSET);
        placement = "top";
      }
    }

    // Constrain top & bottom bounds so card never clips off screen
    if (top < PADDING) {
      top = PADDING;
    } else if (top + CARD_HEIGHT > viewportHeight - PADDING) {
      top = viewportHeight - CARD_HEIGHT - PADDING;
    }

    return { top, left, width: CARD_WIDTH, placement };
  }, [hoveredRect]);

  if (!hoveredElement || !isPreviewOpen) return null;

  const categoryInfo =
    ELEMENT_CATEGORIES[hoveredElement.category] || ELEMENT_CATEGORIES["unknown-properties"];

  const localizedName = getElementName(hoveredElement.atomicNumber, hoveredElement.name);
  const localizedCategory = getCategoryShortName(hoveredElement.category, categoryInfo.shortName);
  const localizedPhase = getPhaseName(hoveredElement.phaseAt293K);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)", y: 12 }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)", y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          position: "fixed",
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          zIndex: 60,
        }}
        className="glass-panel-elevated rounded-3xl p-6 sm:p-7 border border-white/[0.14] text-slate-100 shadow-modal backdrop-blur-2xl overflow-hidden bg-[#0c1017]/95"
        role="dialog"
        aria-label={`Preview of ${localizedName}`}
      >
        {/* Top mineral hairline accent with gentle glow */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            backgroundColor: categoryInfo.color,
            boxShadow: `0 2px 12px ${categoryInfo.color}66`,
          }}
        />

        {/* Ambient mineral corner glow inside card */}
        <div
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: categoryInfo.color }}
        />

        {/* Header: Atomic Number, Category Tag, Block Tag, Close Button */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] relative z-10 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.12] text-slate-200 tabular-nums">
              #{hoveredElement.atomicNumber}
            </span>
            <span
              className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-lg border font-semibold"
              style={{
                color: categoryInfo.color,
                borderColor: categoryInfo.borderColor,
                backgroundColor: categoryInfo.bgGlow,
              }}
            >
              {localizedCategory}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
              {hoveredElement.block}-blok
              {hoveredElement.block}{lang === "tr" ? "-blok" : "-block"}
            </span>
            {hoveredElement.isRadioactive && (
              <span
                title={t("radioactiveOnly")}
                className="flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
              >
                <Radio className="w-3 h-3" />
                <span>{t("radioactiveOnly")}</span>
              </span>
            )}
          </div>

          <button
            onClick={closePreview}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title={t("close")}
            aria-label={t("close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Section: Giant Symbol, Name, Mini Bohr Atom Canvas */}
        <div className="flex items-center justify-between py-4 relative z-10">
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-5xl sm:text-6xl font-black font-mono tracking-tight leading-none"
                style={{ color: categoryInfo.color }}
              >
                {hoveredElement.symbol}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mt-2 font-sans">
              {localizedName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span className="tabular-nums font-semibold text-slate-300">
                {typeof hoveredElement.atomicMass === "number"
                  ? `${hoveredElement.atomicMass.toFixed(3)} u`
                  : hoveredElement.atomicMass}
              </span>
              {lang === "tr" && hoveredElement.name.toLowerCase() !== localizedName.toLowerCase() && (
                <>
                  <span>•</span>
                  <span className="text-slate-400 font-sans italic">{hoveredElement.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="relative shrink-0 flex items-center justify-center p-2 rounded-2xl bg-black/40 border border-white/[0.06]">
            <MiniAtomicModel element={hoveredElement} size={130} />
          </div>
        </div>

        {/* Electron Shell Sequence Indicator */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-3 relative z-10 font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Orbit className="w-3.5 h-3.5 text-slate-400" />
            <span>{t("shells")}:</span>
          </div>
          <div className="flex items-center gap-1 text-slate-200 font-semibold text-[11px] tracking-wider">
            {hoveredElement.shells.map((count, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]"
              >
                {count}
              </span>
            ))}
          </div>
        </div>

        {/* Key Scientific Properties 3-Column Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-xs bg-[#07090e]/90 rounded-2xl p-3.5 border border-white/[0.06] relative z-10 shadow-inner">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
              {t("phase")}
            </span>
            <span className="font-semibold text-slate-200 capitalize font-sans text-[13px] mt-0.5 block">
              {localizedPhase}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
              {t("electronegativity")}
            </span>
            <span className="font-mono text-slate-200 tabular-nums text-[13px] mt-0.5 block font-semibold">
              {hoveredElement.electronegativity ?? "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
              {t("density")}
            </span>
            <span className="font-mono text-slate-200 tabular-nums text-[12px] mt-0.5 block truncate">
              {hoveredElement.density ? `${hoveredElement.density} g/cm³` : "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
              {t("meltingPoint")}
            </span>
            <span className="font-mono text-slate-200 tabular-nums text-[12px] mt-0.5 block truncate">
              {hoveredElement.meltingPoint ? `${hoveredElement.meltingPoint} K` : "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
              {t("boilingPoint")}
            </span>
            <span className="font-mono text-slate-200 tabular-nums text-[12px] mt-0.5 block truncate">
              {hoveredElement.boilingPoint ? `${hoveredElement.boilingPoint} K` : "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
              {t("discovered")}
            </span>
            <span className="text-slate-200 font-sans truncate text-[12px] mt-0.5 block">
              {hoveredElement.discoveryYear ?? "Antik"}
              {hoveredElement.discoveryYear ?? (lang === "tr" ? "Antik" : "Ancient")}
            </span>
          </div>
          <div className="col-span-3 pt-1 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              {t("configuration")}
            </span>
            <span
              className="font-mono text-xs font-bold tracking-tight"
              style={{ color: categoryInfo.color }}
            >
              {hoveredElement.electronConfiguration}
            </span>
          </div>
        </div>

        {/* Short Summary Description */}
        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed my-3.5 line-clamp-2 relative z-10 font-sans">
          {hoveredElement.shortDescription}
          {getElementSummary(hoveredElement)}
        </p>

        {/* CTA Button: Explore Full Element Experience */}
        <button
          onClick={() => {
            closePreview();
            onSelectElement(hoveredElement.atomicNumber);
          }}
          className="w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all group relative z-10 shadow-card bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.16] hover:border-white/[0.3]"
        >
          <span>{t("openFullAnalysis")}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-300 group-hover:text-white" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
