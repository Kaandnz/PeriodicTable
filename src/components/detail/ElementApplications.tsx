"use client";

import React from "react";
import { ElementData } from "@/types/element";
import {
  Zap,
  Battery,
  Shield,
  Plane,
  HeartPulse,
  Flame,
  Activity,
  Cpu,
  Sprout,
  Rocket,
  Compass,
  Wrench,
  Magnet,
  Eye,
  Camera,
  Sun,
  Lightbulb,
  Snowflake,
  ShieldCheck,
  Building,
  Car,
  Pill,
  Factory,
  Sparkles,
  RefreshCw,
  Box,
  HardDrive,
  Wifi,
  Smile,
  Disc,
  Clock,
  Gem,
  TreePine,
  Thermometer,
  Waves,
  Hammer,
  Printer,
  Music,
  Droplets,
  Building2,
  Atom,
  Bell,
  Scale,
  Palette,
  Crosshair,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Zap,
  Battery,
  Shield,
  Plane,
  HeartPulse,
  Flame,
  Activity,
  Cpu,
  Sprout,
  Rocket,
  Compass,
  Wrench,
  Magnet,
  Eye,
  Camera,
  Sun,
  Lightbulb,
  Snowflake,
  ShieldCheck,
  Building,
  Car,
  Pill,
  Factory,
  Sparkles,
  RefreshCw,
  Box,
  HardDrive,
  Wifi,
  Smile,
  Disc,
  Clock,
  Gem,
  TreePine,
  Thermometer,
  Waves,
  Hammer,
  Printer,
  Music,
  Droplets,
  Building2,
  Atom,
  Bell,
  Scale,
  Palette,
  Crosshair,
  ShieldAlert,
};

import { useLanguage } from "@/context/LanguageContext";

export function ElementApplications({ element }: { element: ElementData }) {
  const { t } = useLanguage();
  const apps = element.applications || [];

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] my-4">
      <div className="mb-3">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
          Technological Integration
          {t("techIntegrationTitle")}
        </span>
        <h4 className="text-sm font-semibold text-white">Real-World Everyday Applications</h4>
        <h4 className="text-sm font-semibold text-white">{t("techIntegrationSubtitle")}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {apps.map((app, idx) => {
          const Icon = ICON_MAP[app.iconName] || Zap;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2.5">
                  <Icon className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-white mb-1">{app.title}</h5>
                <p className="text-[11px] text-slate-300/90 leading-relaxed">{app.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
