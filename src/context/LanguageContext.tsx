"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  Language,
  ELEMENT_NAMES_TR,
  CATEGORIES_TR,
  PHASES_TR,
  UI_STRINGS,
  TRENDS_I18N,
  HISTORY_MILESTONES_I18N,
  TRENDS_GUIDE_I18N,
  SUPERHEAVY_I18N,
  TEMPERATURE_PRESETS_I18N,
  PROPERTY_SECTIONS_I18N,
  BIO_STATUS_I18N,
  HAZARDS_I18N,
} from "@/data/i18n";
import { ElementCategory, ElementPhase, ElementData } from "@/types/element";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: keyof typeof UI_STRINGS["tr"]) => string;
  getElementName: (atomicNumber: number, defaultName: string) => string;
  getCategoryName: (cat: ElementCategory, defaultName?: string) => string;
  getCategoryShortName: (cat: ElementCategory, defaultShortName?: string) => string;
  getCategoryDescription: (cat: ElementCategory, defaultDescription?: string) => string;
  getPhaseName: (phase: ElementPhase, defaultName?: string) => string;
  getTrendInfo: (trendId: string) => {
    name: string;
    unit?: string;
    description: string;
    higherIsBetterLabel: string;
    lowerIsBetterLabel: string;
  };
  getMilestones: () => typeof HISTORY_MILESTONES_I18N["tr"];
  getTrendsGuideData: () => typeof TRENDS_GUIDE_I18N["tr"];
  getSuperheavyData: () => typeof SUPERHEAVY_I18N["tr"];
  getPropertySections: () => typeof PROPERTY_SECTIONS_I18N["tr"];
  getTemperaturePresets: () => typeof TEMPERATURE_PRESETS_I18N["tr"];
  getBioStatus: (status: string) => string;
  getHazardLabel: (hazard: string) => string;
  getElementSummary: (element: ElementData) => string;
  getElementStory: (element: ElementData) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const defaultValue: LanguageContextValue = {
  lang: "tr",
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => UI_STRINGS.tr[key] || key,
  getElementName: (num, def) => ELEMENT_NAMES_TR[num] || def,
  getCategoryName: (cat, def) => CATEGORIES_TR[cat]?.name || def || cat,
  getCategoryShortName: (cat, def) => CATEGORIES_TR[cat]?.shortName || def || cat,
  getCategoryDescription: (cat, def) => CATEGORIES_TR[cat]?.description || def || "",
  getPhaseName: (phase, def) => PHASES_TR[phase] || def || phase,
  getTrendInfo: (trendId) =>
    (TRENDS_I18N.tr as any)[trendId] || {
      name: trendId,
      unit: "",
      description: "",
      higherIsBetterLabel: "Yüksek",
      lowerIsBetterLabel: "Düşük",
    },
  getMilestones: () => HISTORY_MILESTONES_I18N.tr,
  getTrendsGuideData: () => TRENDS_GUIDE_I18N.tr,
  getSuperheavyData: () => SUPERHEAVY_I18N.tr,
  getPropertySections: () => PROPERTY_SECTIONS_I18N.tr,
  getTemperaturePresets: () => TEMPERATURE_PRESETS_I18N.tr,
  getBioStatus: (status) => (BIO_STATUS_I18N.tr as any)[status] || status,
  getHazardLabel: (hazard) => (HAZARDS_I18N.tr as any)[hazard] || hazard,
  getElementSummary: (el) => el.summary,
  getElementStory: (el) => el.discoveryStory,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("tr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("elementa_lang") as Language | null;
      if (saved === "tr" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("elementa_lang", newLang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "tr" ? "en" : "tr");
  }, [lang, setLang]);

  const t = useCallback(
    (key: keyof typeof UI_STRINGS["tr"]) => {
      const strings = UI_STRINGS[lang] || UI_STRINGS.tr;
      return strings[key] || UI_STRINGS.tr[key] || key;
    },
    [lang]
  );

  const getElementName = useCallback(
    (atomicNumber: number, defaultName: string) => {
      if (lang === "tr") {
        return ELEMENT_NAMES_TR[atomicNumber] || defaultName;
      }
      return defaultName;
    },
    [lang]
  );

  const getCategoryName = useCallback(
    (cat: ElementCategory, defaultName?: string) => {
      if (lang === "tr" && CATEGORIES_TR[cat]) {
        return CATEGORIES_TR[cat].name;
      }
      return defaultName || cat;
    },
    [lang]
  );

  const getCategoryShortName = useCallback(
    (cat: ElementCategory, defaultShortName?: string) => {
      if (lang === "tr" && CATEGORIES_TR[cat]) {
        return CATEGORIES_TR[cat].shortName;
      }
      return defaultShortName || cat;
    },
    [lang]
  );

  const getCategoryDescription = useCallback(
    (cat: ElementCategory, defaultDescription?: string) => {
      if (lang === "tr" && CATEGORIES_TR[cat]) {
        return CATEGORIES_TR[cat].description;
      }
      return defaultDescription || "";
    },
    [lang]
  );

  const getPhaseName = useCallback(
    (phase: ElementPhase, defaultName?: string) => {
      if (lang === "tr" && PHASES_TR[phase]) {
        return PHASES_TR[phase];
      }
      return defaultName || phase;
    },
    [lang]
  );

  const getTrendInfo = useCallback(
    (trendId: string) => {
      const set = TRENDS_I18N[lang] || TRENDS_I18N.tr;
      return (
        (set as any)[trendId] || {
          name: trendId,
          unit: "",
          description: "",
          higherIsBetterLabel: lang === "tr" ? "Yüksek" : "High",
          lowerIsBetterLabel: lang === "tr" ? "Düşük" : "Low",
        }
      );
    },
    [lang]
  );

  const getMilestones = useCallback(() => {
    return HISTORY_MILESTONES_I18N[lang] || HISTORY_MILESTONES_I18N.tr;
  }, [lang]);

  const getTrendsGuideData = useCallback(() => {
    return TRENDS_GUIDE_I18N[lang] || TRENDS_GUIDE_I18N.tr;
  }, [lang]);

  const getSuperheavyData = useCallback(() => {
    return SUPERHEAVY_I18N[lang] || SUPERHEAVY_I18N.tr;
  }, [lang]);

  const getPropertySections = useCallback(() => {
    return PROPERTY_SECTIONS_I18N[lang] || PROPERTY_SECTIONS_I18N.tr;
  }, [lang]);

  const getTemperaturePresets = useCallback(() => {
    return TEMPERATURE_PRESETS_I18N[lang] || TEMPERATURE_PRESETS_I18N.tr;
  }, [lang]);

  const getBioStatus = useCallback(
    (status: string) => {
      const set = BIO_STATUS_I18N[lang] || BIO_STATUS_I18N.tr;
      return (set as any)[status] || status;
    },
    [lang]
  );

  const getHazardLabel = useCallback(
    (hazard: string) => {
      const set = HAZARDS_I18N[lang] || HAZARDS_I18N.tr;
      return (set as any)[hazard] || hazard;
    },
    [lang]
  );

  const getElementSummary = useCallback(
    (el: ElementData) => {
      if (lang === "tr") {
        const trName = ELEMENT_NAMES_TR[el.atomicNumber] || el.name;
        const catName = CATEGORIES_TR[el.category]?.name || el.category;
        return `${trName} (${el.symbol}), periyodik tablonun ${el.period}. periyodunda yer alan, ${el.electronConfiguration} elektron dizilimine ve ${el.atomicMass} u atomik kütleye sahip bir ${catName.toLowerCase()} elementidir.`;
      }
      return el.summary;
    },
    [lang]
  );

  const getElementStory = useCallback(
    (el: ElementData) => {
      if (lang === "tr") {
        const trName = ELEMENT_NAMES_TR[el.atomicNumber] || el.name;
        const yearText = el.discoveryYear ? `${el.discoveryYear} yılında ` : "Antik çağlarda ";
        const discText = el.discoveredBy ? `${el.discoveredBy} tarafından ` : "";
        const locText = el.discoveryLocation ? ` (${el.discoveryLocation})` : "";
        return `${trName}, ${yearText}${discText}keşfedilmiştir${locText}. Periyodik tablonun ${el.period}. periyodunda ve ${el.block} blokunda yer alır.`;
      }
      return el.discoveryStory;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        getElementName,
        getCategoryName,
        getCategoryShortName,
        getCategoryDescription,
        getPhaseName,
        getTrendInfo,
        getMilestones,
        getTrendsGuideData,
        getSuperheavyData,
        getPropertySections,
        getTemperaturePresets,
        getBioStatus,
        getHazardLabel,
        getElementSummary,
        getElementStory,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return defaultValue;
  }
  return context;
}

