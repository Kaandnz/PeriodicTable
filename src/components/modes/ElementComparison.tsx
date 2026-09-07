"use client";

import React, { useState } from "react";
import { ElementData } from "@/types/element";
import { ELEMENTS, ELEMENTS_BY_NUMBER } from "@/data/elements";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { ELEMENT_NAMES_TR } from "@/data/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { Scale, X, Plus, Search } from "lucide-react";

interface ElementComparisonProps {
  selectedNumbers: number[];
  onAddElement: (num: number) => void;
  onRemoveElement: (num: number) => void;
  onClearComparison: () => void;
  onOpenElementDetail: (num: number) => void;
}

export function ElementComparison({
  selectedNumbers,
  onAddElement,
  onRemoveElement,
  onClearComparison,
  onOpenElementDetail,
}: ElementComparisonProps) {
  const { t, lang, getElementName, getCategoryShortName } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const elements = selectedNumbers
    .map((num) => ELEMENTS_BY_NUMBER[num])
    .filter(Boolean) as ElementData[];

  // Candidate elements matching search bilingually
  const searchLower = searchQuery.toLowerCase().trim();
  const candidates = ELEMENTS.filter((el) => {
    if (selectedNumbers.includes(el.atomicNumber)) return false;
    if (!searchLower) return false;
    const trName = (ELEMENT_NAMES_TR[el.atomicNumber] || "").toLowerCase();
    return (
      el.name.toLowerCase().includes(searchLower) ||
      trName.includes(searchLower) ||
      el.symbol.toLowerCase().includes(searchLower) ||
      el.atomicNumber.toString() === searchLower
    );
  }).slice(0, 6);

  // Core properties to compare with units and labels
  const properties = [
    { key: "atomicNumber", label: t("propAtomicNumber"), unit: "", format: (v: any) => v },
    { key: "atomicMass", label: t("propAtomicMass"), unit: "u", format: (v: any) => typeof v === "number" ? v.toFixed(3) : v },
    { key: "electronegativity", label: t("propElectronegativity"), unit: "", format: (v: any) => v ?? "—" },
    { key: "atomicRadius", label: t("propAtomicRadius"), unit: "pm", format: (v: any) => v ? `${v} pm` : "—" },
    { key: "density", label: t("propDensity"), unit: "g/cm³", format: (v: any) => v ? `${v} g/cm³` : "—" },
    { key: "meltingPoint", label: t("propMeltingPoint"), unit: "K", format: (v: any) => v ? `${v} K` : "—" },
    { key: "boilingPoint", label: t("propBoilingPoint"), unit: "K", format: (v: any) => v ? `${v} K` : "—" },
    { key: "ionizationEnergy", label: t("propIonizationEnergy"), unit: "kJ/mol", format: (v: any) => v ? `${v} kJ/mol` : "—" },
    { key: "electronConfiguration", label: t("propElectronConfig"), unit: "", format: (v: any) => v },
    { key: "crystalStructure", label: t("propCrystalStructure"), unit: "", format: (v: any) => v },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel-elevated rounded-2xl p-4 sm:p-6 border border-white/[0.1] my-4 shadow-modal relative overflow-hidden" id="compare">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-cyan-400 shadow-subtle">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-sans">{t("compareMatrixTitle")}</h3>
            <p className="text-[11px] text-slate-400 font-sans">{t("compareMatrixSubtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedNumbers.length < 4 && (
            <button
              onClick={() => setIsSearching(!isSearching)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.08] text-slate-100 border border-white/[0.15] hover:bg-white/[0.12] transition-all shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("addElement")}</span>
            </button>
          )}

          {selectedNumbers.length > 0 && (
            <button
              onClick={onClearComparison}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] transition-all"
            >
              {t("clearAll")}
            </button>
          )}
        </div>
      </div>

      {/* Element Search Dropdown (if adding) */}
      {isSearching && (
        <div className="my-3 p-3 rounded-xl bg-[#07090e] border border-white/[0.1] shadow-subtle">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t("searchComparePlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c1017] border border-white/[0.1] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.3]"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {candidates.map((cand) => (
              <button
                key={cand.atomicNumber}
                onClick={() => {
                  onAddElement(cand.atomicNumber);
                  setSearchQuery("");
                  if (selectedNumbers.length >= 3) setIsSearching(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 border border-white/[0.08] transition-all"
              >
                <span className="font-mono font-bold text-white">{cand.symbol}</span>
                <span>{getElementName(cand.atomicNumber, cand.name)}</span>
                <span className="text-[10px] font-mono text-slate-500">#{cand.atomicNumber}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      {elements.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs font-sans">
          {lang === "tr"
            ? "Karşılaştırmaya başlamak için periyodik tablodan en az 2 element seçin veya yukarıdaki 'Element Ekle' butonuna tıklayın."
            : "Select at least 2 elements from the periodic table or click “Add Element” above to begin comparison."}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 text-slate-400 font-mono text-[11px] uppercase tracking-wider w-44">
                  {lang === "tr" ? "Özellik" : "Property"}
                </th>
                {elements.map((el) => {
                  const cat = ELEMENT_CATEGORIES[el.category] || ELEMENT_CATEGORIES["unknown-properties"];
                  return (
                    <th key={el.atomicNumber} className="py-3 px-3 min-w-[160px]">
                      <div className="flex items-center justify-between">
                        <div
                          className="cursor-pointer group"
                          onClick={() => onOpenElementDetail(el.atomicNumber)}
                        >
                          <span className="text-xl font-bold font-mono tracking-tight group-hover:underline" style={{ color: cat.color }}>
                            {el.symbol}
                          </span>
                          <span className="text-sm font-semibold text-slate-100 ml-2">
                            {getElementName(el.atomicNumber, el.name)}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveElement(el.atomicNumber)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-white/[0.05]"
                          title={`${lang === "tr" ? "Kaldır:" : "Remove"} ${getElementName(el.atomicNumber, el.name)}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span
                        className="inline-block mt-1 text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded border"
                        style={{
                          color: cat.color,
                          borderColor: cat.borderColor,
                          backgroundColor: cat.bgGlow,
                        }}
                      >
                        {getCategoryShortName(el.category, cat.shortName)}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {properties.map((prop) => (
                <tr key={prop.key} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 font-sans font-medium">{prop.label}</td>
                  {elements.map((el) => {
                    const rawVal = el[prop.key as keyof ElementData];
                    return (
                      <td key={`${el.atomicNumber}-${prop.key}`} className="py-2.5 px-3 font-mono text-slate-200 tabular-nums">
                        {prop.format(rawVal)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
