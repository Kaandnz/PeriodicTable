"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { ElementData } from "@/types/element";

export type HoverStage = "idle" | "glow" | "ring" | "pulse" | "dimSurrounding" | "activePreview";

interface HoverIntentContextType {
  hoveredElement: ElementData | null;
  hoveredRect: DOMRect | null;
  hoverProgress: number; // 0.0 to 1.0
  hoverStage: HoverStage;
  isPreviewOpen: boolean;
  onElementPointerEnter: (element: ElementData, rect: DOMRect) => void;
  onElementPointerLeave: (element: ElementData) => void;
  closePreview: () => void;
}

const HoverIntentContext = createContext<HoverIntentContextType | undefined>(undefined);

export function HoverIntentProvider({ children }: { children: React.ReactNode }) {
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoverProgress, setHoverProgress] = useState(0);
  const [hoverStage, setHoverStage] = useState<HoverStage>("idle");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentElementRef = useRef<ElementData | null>(null);

  const HOVER_THRESHOLD_MS = 2000;

  const updateProgress = useCallback(() => {
    if (!startTimeRef.current || !currentElementRef.current) return;

    const elapsed = performance.now() - startTimeRef.current;
    const progress = Math.min(elapsed / HOVER_THRESHOLD_MS, 1);
    setHoverProgress(progress);

    if (elapsed < 300) {
      setHoverStage("idle");
    } else if (elapsed < 700) {
      setHoverStage("glow");
    } else if (elapsed < 1000) {
      setHoverStage("ring");
    } else if (elapsed < 1500) {
      setHoverStage("pulse");
    } else if (elapsed < HOVER_THRESHOLD_MS) {
      setHoverStage("dimSurrounding");
    } else {
      setHoverStage("activePreview");
      setIsPreviewOpen(true);
      return; // Stop animation loop once preview triggers
    }

    animFrameRef.current = requestAnimationFrame(updateProgress);
  }, []);

  const onElementPointerEnter = useCallback((element: ElementData, rect: DOMRect) => {
    // If already hovering this element and preview is open, keep it open
    if (currentElementRef.current?.atomicNumber === element.atomicNumber && isPreviewOpen) {
      return;
    }

    // Cancel existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    currentElementRef.current = element;
    setHoveredElement(element);
    setHoveredRect(rect);
    setIsPreviewOpen(false);
    setHoverProgress(0);
    setHoverStage("idle");

    startTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress, isPreviewOpen]);

  const onElementPointerLeave = useCallback((element: ElementData) => {
    // If preview is already open, keep it visible until closed or another element is targeted
    if (isPreviewOpen && currentElementRef.current?.atomicNumber === element.atomicNumber) {
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    startTimeRef.current = null;
    currentElementRef.current = null;
    setHoveredElement(null);
    setHoveredRect(null);
    setHoverProgress(0);
    setHoverStage("idle");
    setIsPreviewOpen(false);
  }, [isPreviewOpen]);

  const closePreview = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    startTimeRef.current = null;
    currentElementRef.current = null;
    setHoveredElement(null);
    setHoveredRect(null);
    setHoverProgress(0);
    setHoverStage("idle");
    setIsPreviewOpen(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <HoverIntentContext.Provider
      value={{
        hoveredElement,
        hoveredRect,
        hoverProgress,
        hoverStage,
        isPreviewOpen,
        onElementPointerEnter,
        onElementPointerLeave,
        closePreview,
      }}
    >
      {children}
    </HoverIntentContext.Provider>
  );
}

export function useHoverIntent() {
  const context = useContext(HoverIntentContext);
  if (!context) {
    throw new Error("useHoverIntent must be used within a HoverIntentProvider");
  }
  return context;
}
