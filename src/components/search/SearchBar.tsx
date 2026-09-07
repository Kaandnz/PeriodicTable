"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPressEnter?: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onPressEnter }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useLanguage();

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is already typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative flex items-center shadow-subtle rounded-xl overflow-hidden group">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none transition-colors group-focus-within:text-slate-200" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onPressEnter) {
              onPressEnter();
            }
            if (e.key === "Escape") {
              onSearchChange("");
              inputRef.current?.blur();
            }
          }}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-[#0c1017] border border-white/[0.08] rounded-xl pl-9 pr-14 py-2 text-xs font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:border-white/[0.25] focus:ring-1 focus:ring-white/[0.1] transition-all"
          aria-label={t("searchPlaceholder")}
        />

        {searchQuery ? (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 p-1 text-slate-400 hover:text-white rounded transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded pointer-events-none">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
