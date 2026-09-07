"use client";

import React from "react";
import Link from "next/link";
import { ElementData } from "@/types/element";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { Navbar } from "@/components/navbar/Navbar";
import { AtomicModel3D } from "@/components/detail/AtomicModel3D";
import { ElementPropertiesGrid } from "@/components/detail/ElementPropertiesGrid";
import { ElectronConfigViewer } from "@/components/detail/ElectronConfigViewer";
import { IsotopeTimeline } from "@/components/detail/IsotopeTimeline";
import { ElementHistory } from "@/components/detail/ElementHistory";
import { ElementApplications } from "@/components/detail/ElementApplications";
import { ElementAbundance } from "@/components/detail/ElementAbundance";
import { SafetyAndBio } from "@/components/detail/SafetyAndBio";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ElementClientPageProps {
  element: ElementData;
}

export function ElementClientPage({ element }: ElementClientPageProps) {
  const {
    t,
    lang,
    getElementName,
    getCategoryName,
    getPhaseName,
    getElementSummary,
  } = useLanguage();

  const category = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];
  const localizedName = getElementName(element.atomicNumber, element.name);
  const localizedCategory = getCategoryName(element.category, category.name);
  const localizedPhase = getPhaseName(element.phaseAt293K);
  const localizedSummary = getElementSummary(element);

  return (
    <div className="min-h-screen flex flex-col justify-between pt-20 px-4">
      <Navbar activeMode="standard" />

      <main className="max-w-5xl mx-auto w-full flex-1 py-4">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("backToTable")}</span>
          </Link>
        </div>

        <div className="glass-panel-elevated rounded-3xl border border-white/[0.12] p-6 sm:p-8 bg-[#0c1017] shadow-modal relative overflow-hidden">
          {/* Top mineral hairline accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: category.color }}
          />

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-4 border-b border-white/[0.07] relative z-10 items-center pt-2">
            <div className="lg:col-span-6">
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
                  {localizedCategory}
                </span>
              </div>

              <div className="my-2 select-none">
                <span
                  className="text-8xl sm:text-9xl font-bold font-mono tracking-tighter leading-none block"
                  style={{
                    color: category.color,
                  }}
                >
                  {element.symbol}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans -mt-1">
                  {localizedName}
                </h1>
                {lang === "tr" && element.name.toLowerCase() !== localizedName.toLowerCase() && (
                  <span className="text-xs text-slate-400 font-sans italic block mt-1">
                    {element.name}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mt-3">
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">{t("atomicWeight")}</span>
                  <span className="text-sm font-semibold text-white">{element.atomicMass} u</span>
                </div>
                <div className="h-6 w-px bg-white/[0.1]" />
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">{t("standardState")}</span>
                  <span className="text-sm font-semibold text-white capitalize">{localizedPhase}</span>
                </div>
                <div className="h-6 w-px bg-white/[0.1]" />
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">{t("periodGroup")}</span>
                  <span className="text-sm font-semibold text-white">
                    {lang === "tr"
                      ? `${element.period}. ${t("period")} ${element.group ? `• ${element.group}. ${t("group")}` : `• ${t("fBlockNotice")}`}`
                      : `${t("period")} ${element.period} ${element.group ? `• ${t("group")} ${element.group}` : `• ${t("fBlockNotice")}`}`}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-4">
                {localizedSummary}
              </p>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center">
              <AtomicModel3D element={element} />
            </div>
          </div>

          {/* Deep Sections */}
          <div className="py-6 space-y-6 relative z-10">
            <ElementPropertiesGrid element={element} />
            <ElectronConfigViewer element={element} />
            <IsotopeTimeline element={element} />
            <ElementApplications element={element} />
            <ElementAbundance element={element} />
            <ElementHistory element={element} />
            <SafetyAndBio element={element} />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 font-mono">
        <div className="flex items-center justify-center gap-2 mb-1 text-slate-400">
          <span className="font-semibold text-slate-300">Elementa Periodic Laboratory</span>
          <span>•</span>
          <span>{t("footerVerified")}</span>
        </div>
        <p className="text-[11px] text-slate-600">
          {t("footerDisclaimer")}
        </p>
      </footer>
    </div>
  );
}

