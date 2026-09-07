"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ElementData } from "@/types/element";
import { ELEMENTS_BY_NUMBER, ELEMENTS } from "@/data/elements";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { AtomicModel3D } from "./AtomicModel3D";
import { ElementPropertiesGrid } from "./ElementPropertiesGrid";
import { ElectronConfigViewer } from "./ElectronConfigViewer";
import { IsotopeTimeline } from "./IsotopeTimeline";
import { ElementHistory } from "./ElementHistory";
import { ElementApplications } from "./ElementApplications";
import { ElementAbundance } from "./ElementAbundance";
import { SafetyAndBio } from "./SafetyAndBio";
import {
  X,
  Star,
  Scale,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  Atom,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ElementDetailModalProps {
  elementNumber: number | null;
  onClose: () => void;
  onSelectElement: (num: number) => void;
  onCompareElement?: (num: number) => void;
}

export function ElementDetailModal({
  elementNumber,
  onClose,
  onSelectElement,
  onCompareElement,
}: ElementDetailModalProps) {
  const {
    t,
    lang,
    getElementName,
    getCategoryName,
    getPhaseName,
    getElementSummary,
  } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const element = elementNumber ? ELEMENTS_BY_NUMBER[elementNumber] : null;

  // Local storage favorites
  useEffect(() => {
    if (!element) return;
    try {
      const favs = JSON.parse(localStorage.getItem("elementa_favorites") || "[]");
      setIsFavorite(favs.includes(element.atomicNumber));
    } catch {
      // ignore
    }
  }, [element]);

  const toggleFavorite = () => {
    if (!element) return;
    try {
      const favs = JSON.parse(localStorage.getItem("elementa_favorites") || "[]");
      let nextFavs: number[];
      if (favs.includes(element.atomicNumber)) {
        nextFavs = favs.filter((n: number) => n !== element.atomicNumber);
        setIsFavorite(false);
      } else {
        nextFavs = [...favs, element.atomicNumber];
        setIsFavorite(true);
      }
      localStorage.setItem("elementa_favorites", JSON.stringify(nextFavs));
    } catch {
      // ignore
    }
  };

  const copyShareLink = () => {
    if (!element) return;
    navigator.clipboard.writeText(`${window.location.origin}/elements/${element.name.toLowerCase()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard navigation inside modal (Escape closes, Left/Right navigates)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && element && element.atomicNumber > 1) {
        onSelectElement(element.atomicNumber - 1);
      }
      if (e.key === "ArrowRight" && element && element.atomicNumber < 118) {
        onSelectElement(element.atomicNumber + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [element, onClose, onSelectElement]);

  // Periodic relations (Section 44)
  const groupElements = useMemo(() => {
    if (!element || element.group === null) return [];
    return ELEMENTS.filter(
      (el) => el.group === element.group && el.atomicNumber !== element.atomicNumber
    );
  }, [element]);

  const periodNeighbors = useMemo(() => {
    if (!element) return [];
    return [
      ELEMENTS_BY_NUMBER[element.atomicNumber - 1],
      ELEMENTS_BY_NUMBER[element.atomicNumber + 1],
    ].filter(Boolean);
  }, [element]);

  if (!element) return null;

  const category = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex justify-center p-2 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-5xl glass-panel-elevated rounded-3xl border border-white/[0.12] p-5 sm:p-8 my-auto text-slate-100 shadow-modal overflow-hidden bg-[#0c1017]"
          role="dialog"
          aria-modal="true"
          aria-label={`Detailed analysis of ${element.name}`}
        >
          {/* Top mineral hairline accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: category.color }}
          />

          {/* Top Bar: Back button, prev/next arrows, action buttons */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.07] relative z-10 pt-1">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("backToTable")}</span>
            </button>

            {/* Element Pagination */}
            <div className="flex items-center gap-1">
              <button
                disabled={element.atomicNumber <= 1}
                onClick={() => onSelectElement(element.atomicNumber - 1)}
                className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white disabled:opacity-30 border border-white/[0.06] transition-colors"
                title={t("prevElement")}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400 px-2 tabular-nums">
                {element.atomicNumber} / 118
              </span>
              <button
                disabled={element.atomicNumber >= 118}
                onClick={() => onSelectElement(element.atomicNumber + 1)}
                className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white disabled:opacity-30 border border-white/[0.06] transition-colors"
                title={t("nextElement")}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Action buttons: Favorite, Compare, Share, Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-xl border transition-all ${
                  isFavorite
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                    : "bg-white/[0.04] text-slate-400 hover:text-white border-white/[0.08]"
                }`}
                title={isFavorite ? t("removeFromFavorites") : t("addToFavorites")}
              >
                <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>

              {onCompareElement && (
                <button
                  onClick={() => {
                    onCompareElement(element.atomicNumber);
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                  title={t("compareThisElement")}
                >
                  <Scale className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={copyShareLink}
                className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08] transition-all"
                title={t("copyShareLink")}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08] hover:bg-white/[0.08] transition-all ml-1"
                title={t("close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Section: Giant Symbol Typography & 3D Interactive Model */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 border-b border-white/[0.07] relative z-10 items-center">
            {/* Left Col: Giant Typography */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.1] tabular-nums">
                  Z = {element.atomicNumber}
                </span>
                <span
                  className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded border"
                  style={{
                    color: category.color,
                    borderColor: category.borderColor,
                    backgroundColor: category.bgGlow,
                  }}
                >
                  {category.name}
                  {getCategoryName(element.category, category.name)}
                </span>
              </div>

              {/* Massive Chemical Symbol with Crisp Mineral Typography */}
              <div className="relative my-2 select-none">
                <span
                  className="text-8xl sm:text-9xl md:text-[130px] font-bold font-mono tracking-tighter leading-none block"
                  style={{
                    color: category.color,
                  }}
                >
                  {element.symbol}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans -mt-1">
                  {element.name}
                  {getElementName(element.atomicNumber, element.name)}
                </h2>
                {lang === "tr" && element.name.toLowerCase() !== getElementName(element.atomicNumber, element.name).toLowerCase() && (
                  <span className="text-xs text-slate-400 font-sans italic block mt-1">
                    {element.name}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mt-2">
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Atomic Weight</span>
                  <span className="text-slate-500 uppercase block text-[10px]">{t("atomicWeight")}</span>
                  <span className="text-sm font-semibold text-white">{element.atomicMass} u</span>
                </div>
                <div className="h-6 w-px bg-white/[0.1]" />
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Standard State</span>
                  <span className="text-sm font-semibold text-white capitalize">{element.phaseAt293K}</span>
                  <span className="text-slate-500 uppercase block text-[10px]">{t("standardState")}</span>
                  <span className="text-sm font-semibold text-white capitalize">{getPhaseName(element.phaseAt293K)}</span>
                </div>
                <div className="h-6 w-px bg-white/[0.1]" />
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Period • Group</span>
                  <span className="text-slate-500 uppercase block text-[10px]">{t("periodGroup")}</span>
                  <span className="text-sm font-semibold text-white">
                    Period {element.period} {element.group ? `• Group ${element.group}` : "• f-Block"}
                    {lang === "tr"
                      ? `${element.period}. ${t("period")} ${element.group ? `• ${element.group}. ${t("group")}` : `• ${t("fBlockNotice")}`}`
                      : `${t("period")} ${element.period} ${element.group ? `• ${t("group")} ${element.group}` : `• ${t("fBlockNotice")}`}`}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-4">
                {element.summary}
                {getElementSummary(element)}
              </p>
            </div>

            {/* Right Col: Interactive 3D Bohr-Sommerfeld Atomic Model (Section 13) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <AtomicModel3D element={element} />
            </div>
          </div>

          {/* Scientific Sections Container */}
          <div className="py-6 space-y-6 relative z-10">
            {/* Core Scientific Properties Grid (Section 14) */}
            <ElementPropertiesGrid element={element} />

            {/* Electron Configuration & Orbital Filling Diagram (Section 15) */}
            <ElectronConfigViewer element={element} />

            {/* Isotopes Timeline (Section 16) */}
            <IsotopeTimeline element={element} />

            {/* Real-World Everyday Applications (Section 18) */}
            <ElementApplications element={element} />

            {/* Occurrence & Terrestrial Abundance (Section 19) */}
            <ElementAbundance element={element} />

            {/* Discovery History & Timeline (Section 17) */}
            <ElementHistory element={element} />

            {/* Biological Role, Safety Hazards & Fun Fact (Section 20, 21, 46) */}
            <SafetyAndBio element={element} />

            {/* Interactive Periodic Relationships (Section 44) */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">
                Periodic Network
                {t("periodicNetworkTitle")}
              </span>
              <h4 className="text-sm font-semibold text-white mb-3">Chemically & Periodically Related Elements</h4>
              <h4 className="text-sm font-semibold text-white mb-3">{t("relatedElementsTitle")}</h4>

              <div className="space-y-3">
                {groupElements.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1.5">
                      Same Group (Group {element.group} Congeners):
                      {lang === "tr" ? `${element.group}. Grup Benzerleri (${t("sameGroupCongeners")}):` : `${t("sameGroupCongeners")} (Group ${element.group}):`}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {groupElements.map((rel) => {
                        const rCat = ELEMENT_CATEGORIES[rel.category] || ELEMENT_CATEGORIES["unknown-properties"];
                        return (
                          <button
                            key={rel.atomicNumber}
                            onClick={() => onSelectElement(rel.atomicNumber)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs transition-colors"
                          >
                            <span className="font-mono font-bold" style={{ color: rCat.color }}>
                              {rel.symbol}
                            </span>
                            <span className="text-slate-300">{rel.name}</span>
                            <span className="text-slate-300">{getElementName(rel.atomicNumber, rel.name)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-slate-400 block mb-1.5">Adjacent Atomic Neighbors:</span>
                  <span className="text-xs text-slate-400 block mb-1.5">{t("adjacentNeighbors")}:</span>
                  <div className="flex flex-wrap gap-2">
                    {periodNeighbors.map((nb) => {
                      const nbCat = ELEMENT_CATEGORIES[nb.category] || ELEMENT_CATEGORIES["unknown-properties"];
                      return (
                        <button
                          key={nb.atomicNumber}
                          onClick={() => onSelectElement(nb.atomicNumber)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs transition-colors"
                        >
                          <span className="font-mono font-bold" style={{ color: nbCat.color }}>
                            {nb.symbol}
                          </span>
                          <span className="text-slate-300">{nb.name} (#{nb.atomicNumber})</span>
                          <span className="text-slate-300">{getElementName(nb.atomicNumber, nb.name)} (#{nb.atomicNumber})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
