"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ElementData } from "@/types/element";
import { ELEMENT_CATEGORIES } from "@/data/categories";
import { RotateCw, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

interface AtomicModel3DProps {
  element: ElementData;
}

const SHELL_NAMES = ["K", "L", "M", "N", "O", "P", "Q"];

export function AtomicModel3D({ element }: AtomicModel3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredShellIdx, setHoveredShellIdx] = useState<number | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoom, setZoom] = useState(1);

  // 3D rotation angles in radians
  const rotXRef = useRef(0.4);
  const rotYRef = useRef(0.6);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const category = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];
  const shells = element.shells || [element.atomicNumber];

  // Mouse drag handlers for 3D rotation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotYRef.current += dx * 0.01;
    rotXRef.current += dy * 0.01;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId: number;

    const dpr = window.devicePixelRatio || 1;
    const width = 440;
    const height = 440;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;
    const accentColor = category.color;

    // Radius scaling for shells
    const minRadius = 40;
    const maxRadius = 180;
    const radiusStep = shells.length > 1 ? (maxRadius - minRadius) / (shells.length - 1) : 0;

    // Electron orbital angles
    const angles = shells.map((count) => {
      const step = (Math.PI * 2) / count;
      return Array.from({ length: count }, (_, i) => i * step);
    });

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isAutoRotating && !prefersReducedMotion && !isDraggingRef.current) {
        rotYRef.current += 0.006;
      }

      const rx = rotXRef.current;
      const ry = rotYRef.current;

      // Projection helper: 3D (x, y, z) -> 2D (screenX, screenY)
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const x1 = x * Math.cos(ry) + z * Math.sin(ry);
        const z1 = -x * Math.sin(ry) + z * Math.cos(ry);

        // Rotate around X axis
        const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
        const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);

        const currentZoom = zoom;
        const scale = (400 / (400 + z2)) * currentZoom;
        return {
          px: centerX + x1 * scale,
          py: centerY + y2 * scale,
          depth: z2,
          scale,
        };
      };

      // 1. Draw central nucleus (protons and neutrons sphere)
      const nucleusRadius = 16 * zoom;
      const nucleusWobbleX = prefersReducedMotion ? 0 : Math.sin(time * 0.08) * 1.5;
      const nucleusWobbleY = prefersReducedMotion ? 0 : Math.cos(time * 0.06) * 1.5;

      const nProj = project(nucleusWobbleX, nucleusWobbleY, 0);

      // Nucleus radial glow
      const grad = ctx.createRadialGradient(
        nProj.px,
        nProj.py,
        2,
        nProj.px,
        nProj.py,
        nucleusRadius * 2
      );
      grad.addColorStop(0, accentColor);
      grad.addColorStop(0.5, "rgba(255,255,255,0.3)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nProj.px, nProj.py, nucleusRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core nucleus solid sphere
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(nProj.px, nProj.py, nucleusRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw electron shells
      shells.forEach((electronCount, sIdx) => {
        const r = minRadius + sIdx * radiusStep;
        const isHovered = hoveredShellIdx === sIdx;
        const ringSegments = 60;

        // Draw 3D orbital ring ellipse
        ctx.beginPath();
        for (let seg = 0; seg <= ringSegments; seg++) {
          const theta = (seg / ringSegments) * Math.PI * 2;
          const sx = Math.cos(theta) * r;
          const sz = Math.sin(theta) * r;
          const { px, py } = project(sx, 0, sz);

          if (seg === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = isHovered
          ? accentColor
          : "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Electrons along this ring
        const speed = prefersReducedMotion ? 0 : (0.02 / (sIdx + 1)) * (sIdx % 2 === 0 ? 1 : -1);
        const ringAngles = angles[sIdx];

        for (let i = 0; i < ringAngles.length; i++) {
          if (!prefersReducedMotion) {
            ringAngles[i] += speed;
          }
          const theta = ringAngles[i];
          const ex = Math.cos(theta) * r;
          const ez = Math.sin(theta) * r;
          const { px, py, depth } = project(ex, 0, ez);

          // Electron bead
          ctx.beginPath();
          ctx.arc(px, py, 3.5 * zoom, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? "#ffffff" : accentColor;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = isHovered ? 12 : 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      time += 1;
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [element, isAutoRotating, zoom, hoveredShellIdx, category]);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-[#07090e] border border-white/[0.08] shadow-subtle select-none w-full max-w-[420px]">
      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-grab active:cursor-grabbing w-full h-[320px] sm:h-[360px]"
        title="Click and drag to rotate 3D atom"
      />

      {/* Floating HUD: Active Shell Info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block">
          Quantum Architecture
        </span>
        <span className="text-xs font-semibold text-slate-200 font-sans">
          {hoveredShellIdx !== null
            ? `Shell ${SHELL_NAMES[hoveredShellIdx]} — ${shells[hoveredShellIdx]} Electrons`
            : `${element.shells.length} Orbitals • ${element.atomicNumber} Electrons`}
        </span>
      </div>

      {/* Interactive Shell Selector Pills (K through Q) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 z-10">
        {shells.map((count, idx) => (
          <button
            key={idx}
            onMouseEnter={() => setHoveredShellIdx(idx)}
            onMouseLeave={() => setHoveredShellIdx(null)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium transition-all border ${
              hoveredShellIdx === idx
                ? "bg-white/[0.14] text-white border-white/[0.3] shadow-subtle"
                : "bg-[#0c1017] text-slate-400 hover:text-slate-200 border-white/[0.07]"
            }`}
          >
            {SHELL_NAMES[idx]}: <span className="text-slate-200 font-bold">{count}e⁻</span>
          </button>
        ))}
      </div>

      {/* Controls: Zoom, Auto-rotate, Reset */}
      <div className="flex items-center gap-1.5 mt-3 z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))}
          className="p-1.5 rounded-lg bg-[#0c1017] text-slate-400 hover:text-white border border-white/[0.07] hover:bg-white/[0.04] transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
          className="p-1.5 rounded-lg bg-[#0c1017] text-slate-400 hover:text-white border border-white/[0.07] hover:bg-white/[0.04] transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
            isAutoRotating
              ? "bg-white/[0.08] text-slate-200 border-white/[0.15]"
              : "bg-[#0c1017] text-slate-400 hover:text-slate-200 border-white/[0.07]"
          }`}
        >
          <RotateCw className={`w-3 h-3 ${isAutoRotating ? "animate-spin" : ""}`} />
          <span>{isAutoRotating ? "Auto-Rotate" : "Paused"}</span>
        </button>
        <button
          onClick={() => {
            rotXRef.current = 0.4;
            rotYRef.current = 0.6;
            setZoom(1);
          }}
          className="p-1.5 rounded-lg bg-[#0c1017] text-slate-400 hover:text-white border border-white/[0.07] hover:bg-white/[0.04] transition-all"
          title="Reset Orientation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
