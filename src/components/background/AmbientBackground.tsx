"use client";

import React, { useEffect, useState } from "react";

export function AmbientBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 }); // Default center-ish in percentage

  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const x = Math.round((e.clientX / window.innerWidth) * 100);
        const y = Math.round((e.clientY / window.innerHeight) * 100);
        setMousePos({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Midnight Base Tint */}
      <div className="absolute inset-0 bg-[#07090e]" />

      {/* 2. Living Multi-Tier Chromatic Laboratory Nebulae */}
      {/* Top Left Sapphire / Cobalt Nebula */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[900px] h-[750px] rounded-full blur-[140px] opacity-40 transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(37, 72, 160, 0.45) 0%, rgba(20, 36, 85, 0.2) 60%, transparent 80%)",
          transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)`,
        }}
      />

      {/* Top Right Royal Amethyst Nebula */}
      <div
        className="absolute -top-[10%] -right-[10%] w-[850px] h-[700px] rounded-full blur-[140px] opacity-35 transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(120, 50, 180, 0.38) 0%, rgba(55, 20, 95, 0.18) 60%, transparent 80%)",
          transform: `translate(${-mousePos.x * 0.04}px, ${mousePos.y * 0.04}px)`,
        }}
      />

      {/* Center / Bottom Emerald Verdigris Field */}
      <div
        className="absolute top-[40%] left-[25%] w-[1000px] h-[650px] rounded-full blur-[160px] opacity-25 transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(20, 120, 100, 0.35) 0%, rgba(10, 55, 50, 0.15) 55%, transparent 80%)",
          transform: `translate(${mousePos.x * 0.03}px, ${-mousePos.y * 0.03}px)`,
        }}
      />

      {/* 3. Smooth Cursor-Reactive Ambient Spotlight Beam */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(99, 102, 241, 0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* 4. Astronomical & Quantum Coordinate Geometry (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.14] stroke-slate-400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="quantum-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="0.8" fill="rgba(255,255,255,0.4)" />
            <line x1="36" y1="40" x2="44" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <line x1="40" y1="36" x2="40" y2="44" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Coordinate Crosshairs Grid */}
        <rect width="100%" height="100%" fill="url(#quantum-grid)" />

        {/* Large Concentric Quantum Orbital Rings (Centered on Table) */}
        <g transform="translate(960, 520)" fill="none" strokeWidth="0.6">
          {/* Main Orbital Shells */}
          <circle r="180" stroke="rgba(255,255,255,0.18)" strokeDasharray="3 6" />
          <circle r="340" stroke="rgba(255,255,255,0.22)" />
          <circle r="520" stroke="rgba(255,255,255,0.15)" strokeDasharray="8 12" />
          <circle r="720" stroke="rgba(255,255,255,0.12)" />
          <circle r="960" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 10" />

          {/* Elliptical Bohr Orbit Trajectories */}
          <ellipse rx="680" ry="260" transform="rotate(-25)" stroke="rgba(99, 179, 237, 0.18)" strokeDasharray="5 8" />
          <ellipse rx="740" ry="240" transform="rotate(35)" stroke="rgba(167, 139, 250, 0.16)" strokeDasharray="4 10" />

          {/* Precision Degree Coordinate Ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = Math.cos(rad) * 332;
            const y1 = Math.sin(rad) * 332;
            const x2 = Math.cos(rad) * 348;
            const y2 = Math.sin(rad) * 348;
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.8"
              />
            );
          })}
        </g>
      </svg>

      {/* 5. Analog Film Grain Texture Overlay */}
      <div className="absolute inset-0 film-grain opacity-85" />

      {/* 6. Precision Laboratory Reticle Coordinate Markings */}
      <div className="hidden xl:flex absolute top-6 left-8 items-center gap-2 text-[10px] font-mono text-slate-500/80 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
        <span>SYS.Q-118 // REF.IUPAC-2024</span>
      </div>

      <div className="hidden xl:flex absolute top-6 right-8 items-center gap-2 text-[10px] font-mono text-slate-500/80 tracking-widest uppercase">
        <span>SPECTRAL RES. 0.01 pm // BLOCKS S-P-D-F</span>
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/70" />
      </div>

      <div className="hidden 2xl:flex absolute bottom-6 left-8 items-center gap-2 text-[10px] font-mono text-slate-600/70 tracking-widest uppercase">
        <span>QUANTUM HARMONIC DYNAMICS</span>
      </div>

      <div className="hidden 2xl:flex absolute bottom-6 right-8 items-center gap-2 text-[10px] font-mono text-slate-600/70 tracking-widest uppercase">
        <span>COORDINATE MESH [18 × 7]</span>
      </div>
    </div>
  );
}
