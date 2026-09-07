"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ElementData } from "@/types/element";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { ArrowRight, Scale, X, Atom } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MobileBottomSheetProps {
  element: ElementData | null;
  isOpen: boolean;
  onClose: () => void;
  onExplore: (atomicNumber: number) => void;
  onCompare: (atomicNumber: number) => void;
}

export function MobileBottomSheet({
  element,
  isOpen,
  onClose,
  onExplore,
  onCompare,
}: MobileBottomSheetProps) {
  const { t, getElementName, getCategoryShortName, getPhaseName } = useLanguage();
  if (!element || !isOpen) return null;

  const cat = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];
  const localizedName = getElementName(element.atomicNumber, element.name);
  const localizedCat = getCategoryShortName(element.category, cat.shortName);
  const localizedPhase = getPhaseName(element.phaseAt293K);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 md:hidden pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) onClose();
          }}
          className="absolute bottom-0 left-0 right-0 glass-panel-elevated rounded-t-3xl border-t border-white/[0.15] p-5 pb-8 shadow-2xl bg-[#0b0f16]"
        >
          {/* Pull Handle */}
          <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4" />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-4xl font-extrabold font-mono"
                style={{ color: cat.color }}
              >
                {element.symbol}
              </span>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {localizedName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 font-mono">
                    #{element.atomicNumber}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      color: cat.color,
                      borderColor: cat.borderColor,
                      backgroundColor: cat.bgGlow,
                    }}
                  >
                    {localizedCat}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/[0.06] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-black/40 border border-white/[0.05] text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">{t("atomicMass")}</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {typeof element.atomicMass === "number" ? element.atomicMass.toFixed(2) : element.atomicMass} u
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">{t("phase")}</span>
              <span className="capitalize text-slate-200 font-sans">{localizedPhase}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">{t("configuration")}</span>
              <span className="font-mono text-[11px] text-slate-200 truncate block">
                {element.electronConfiguration}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onExplore(element.atomicNumber);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              style={{
                backgroundColor: cat.color,
                color: "#05070a",
              }}
            >
              <span>{t("exploreElement")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onCompare(element.atomicNumber);
                onClose();
              }}
              className="py-3 px-4 rounded-xl font-medium text-xs text-slate-200 bg-white/[0.06] border border-white/10 flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
            >
              <Scale className="w-4 h-4 text-slate-400" />
              <span>{t("compare")}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
