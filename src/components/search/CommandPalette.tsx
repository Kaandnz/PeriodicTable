"use client";

import React, { useState, useEffect, useRef } from "react";
import { ELEMENTS } from "@/data/elements";
import { ELEMENT_NAMES_TR } from "@/data/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { ElementCategory } from "@/types/element";
import {
  Search,
  Flame,
  Sparkles,
  Scale,
  RefreshCw,
  Radio,
  Droplets,
  Wind,
  Atom,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Filter";
  icon: any;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (atomicNumber: number) => void;
  onSelectMode: (mode: "standard" | "temperature" | "trends" | "compare") => void;
  onFilterCategory: (cat: ElementCategory) => void;
  onSearchSpecial: (term: string) => void;
  onReset: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectElement,
  onSelectMode,
  onFilterCategory,
  onSearchSpecial,
  onReset,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { lang, t, getElementName } = useLanguage();

  // Global Ctrl/Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Predefined palette commands
  const defaultCommands: CommandItem[] = [
    {
      id: "mode-temp",
      title: t("cmdTempSim"),
      category: "Action",
      icon: Flame,
      action: () => onSelectMode("temperature"),
    },
    {
      id: "mode-trends",
      title: t("cmdTrendsHeatmap"),
      category: "Action",
      icon: Sparkles,
      action: () => onSelectMode("trends"),
    },
    {
      id: "mode-compare",
      title: t("cmdCompareTool"),
      category: "Action",
      icon: Scale,
      action: () => onSelectMode("compare"),
    },
    {
      id: "filter-radioactive",
      title: t("cmdRadioactiveOnly"),
      category: "Filter",
      icon: Radio,
      action: () => onSearchSpecial("radioactive"),
    },
    {
      id: "filter-liquids",
      title: t("cmdLiquidsOnly"),
      category: "Filter",
      icon: Droplets,
      action: () => onSearchSpecial("liquid"),
    },
    {
      id: "filter-noble",
      title: t("cmdFilterNoble"),
      category: "Filter",
      icon: Wind,
      action: () => onFilterCategory("noble-gas"),
    },
    {
      id: "filter-alkali",
      title: t("cmdFilterAlkali"),
      category: "Filter",
      icon: Atom,
      action: () => onFilterCategory("alkali-metal"),
    },
    {
      id: "reset-table",
      title: t("cmdResetTable"),
      category: "Action",
      icon: RefreshCw,
      action: () => onReset(),
    },
  ];

  // Element direct matches
  const elementCommands: CommandItem[] = query.trim()
    ? ELEMENTS.filter((el) => {
        const trName = ELEMENT_NAMES_TR[el.atomicNumber]?.toLowerCase() || "";
        const q = query.toLowerCase();
        return (
          el.name.toLowerCase().includes(q) ||
          trName.includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          el.atomicNumber.toString() === query.trim()
        );
      })
        .slice(0, 8)
        .map((el) => {
          const locName = getElementName(el.atomicNumber, el.name);
          return {
            id: `el-${el.atomicNumber}`,
            title: `${el.symbol} — ${locName} (${el.name}) · #${el.atomicNumber}`,
            category: "Navigation",
            icon: Atom,
            action: () => onSelectElement(el.atomicNumber),
          };
        })
    : [];

  const filteredCommands = query.trim()
    ? [
        ...elementCommands,
        ...defaultCommands.filter((cmd) =>
          cmd.title.toLowerCase().includes(query.toLowerCase())
        ),
      ]
    : defaultCommands;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getCategoryLabel = (cat: "Navigation" | "Action" | "Filter") => {
    if (cat === "Navigation") return t("cmdCatNavigation");
    if (cat === "Action") return t("cmdCatAction");
    return t("cmdCatFilter");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl glass-panel-elevated rounded-2xl border border-white/[0.15] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-label="Command Palette"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.07] relative">
          <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t("cmdPalettePlaceholder")}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/[0.02]">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-sans">
              {t("cmdNoResults")}
            </div>
          ) : (
            filteredCommands.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-white/[0.08] text-white border border-white/[0.14] shadow-subtle"
                      : "text-slate-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <span className="font-medium font-sans">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-black/40 text-[10px] text-slate-400 font-mono">
          <span>{t("cmdNavHint")}</span>
          <span>{t("cmdEnterHint")}</span>
          <span>{t("cmdEscHint")}</span>
        </div>
      </div>
    </div>
  );
}
