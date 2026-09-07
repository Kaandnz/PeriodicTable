"use client";

import React, { useState } from "react";
import { ElementData } from "@/types/element";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ElementPropertiesGridProps {
  element: ElementData;
}

interface PropertyItem {
  label: string;
  value: string | number | null;
  unit?: string;
  tooltip: string;
}

export function ElementPropertiesGrid({ element }: ElementPropertiesGridProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const { getPropertySections, getPhaseName } = useLanguage();
  const p = getPropertySections();

  const thermodynamicProps: PropertyItem[] = [
    {
      label: p.phaseAt293K,
      value: getPhaseName(element.phaseAt293K).toUpperCase(),
      tooltip: p.phaseTooltip,
    },
    {
      label: p.meltingPoint,
      value: element.meltingPoint ? `${element.meltingPoint} K (${(element.meltingPoint - 273.15).toFixed(1)} °C)` : p.predicted,
      tooltip: p.meltingTooltip,
    },
    {
      label: p.boilingPoint,
      value: element.boilingPoint ? `${element.boilingPoint} K (${(element.boilingPoint - 273.15).toFixed(1)} °C)` : p.predicted,
      tooltip: p.boilingTooltip,
    },
    {
      label: p.density,
      value: element.density ? `${element.density} g/cm³` : p.estimated,
      tooltip: p.densityTooltip,
    },
    {
      label: p.specificHeat,
      value: element.specificHeat ? `${element.specificHeat} J/(g·K)` : p.predicted,
      tooltip: p.specificHeatTooltip,
    },
    {
      label: p.thermalConductivity,
      value: element.thermalConductivity ? `${element.thermalConductivity} W/(m·K)` : p.notMeasured,
      tooltip: p.thermalConductivityTooltip,
    },
  ];

  const atomicProps: PropertyItem[] = [
    {
      label: p.electronegativity,
      value: element.electronegativity ?? p.notApplicable,
      unit: "Pauling",
      tooltip: p.electronegativityTooltip,
    },
    {
      label: p.ionizationEnergy,
      value: element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : p.predicted,
      tooltip: p.ionizationEnergyTooltip,
    },
    {
      label: p.electronAffinity,
      value: element.electronAffinity !== null ? `${element.electronAffinity} kJ/mol` : p.predicted,
      tooltip: p.electronAffinityTooltip,
    },
    {
      label: p.atomicRadius,
      value: element.atomicRadius ? `${element.atomicRadius} pm` : p.predicted,
      tooltip: p.atomicRadiusTooltip,
    },
    {
      label: p.covalentRadius,
      value: element.covalentRadius ? `${element.covalentRadius} pm` : p.estimated,
      tooltip: p.covalentRadiusTooltip,
    },
    {
      label: p.vanDerWaalsRadius,
      value: element.vanDerWaalsRadius ? `${element.vanDerWaalsRadius} pm` : p.estimated,
      tooltip: p.vanDerWaalsRadiusTooltip,
    },
  ];

  const structuralProps: PropertyItem[] = [
    {
      label: p.crystalStructure,
      value: element.crystalStructure,
      tooltip: p.crystalStructureTooltip,
    },
    {
      label: p.magneticOrdering,
      value: element.magneticOrdering,
      tooltip: p.magneticOrderingTooltip,
    },
    {
      label: p.oxidationStates,
      value: element.oxidationStates,
      tooltip: p.oxidationStatesTooltip,
    },
    {
      label: p.electricalConductivity,
      value: element.electricalConductivity ? `${element.electricalConductivity} MS/m` : p.insulator,
      tooltip: p.electricalConductivityTooltip,
    },
  ];

  const renderSection = (title: string, items: PropertyItem[]) => (
    <div className="mb-6">
      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-slate-400" />
        <span>{title}</span>
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="p-3 rounded-xl bg-[#07090e] hover:bg-[#07090e]/60 border border-white/[0.07] transition-all relative group shadow-subtle"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans mb-1">
              <span>{item.label}</span>
              <button
                type="button"
                onMouseEnter={() => setActiveTooltip(item.label)}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-slate-500 hover:text-slate-300"
                aria-label={`Info about ${item.label}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
              {item.value}
            </div>

            {/* Scientific Tooltip */}
            {activeTooltip === item.label && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 rounded-lg bg-[#121824] border border-white/[0.15] text-[11px] text-slate-200 shadow-modal z-30 pointer-events-none leading-tight backdrop-blur-md">
                {item.tooltip}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {renderSection(p.thermoTitle, thermodynamicProps)}
      {renderSection(p.atomicTitle, atomicProps)}
      {renderSection(p.structuralTitle, structuralProps)}
    </div>
  );
}
