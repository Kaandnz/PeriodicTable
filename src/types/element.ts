export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "reactive-nonmetal"
  | "noble-gas"
  | "lanthanide"
  | "actinide"
  | "unknown-properties";

export type ElementPhase = "solid" | "liquid" | "gas" | "unknown";

export type ElementBlock = "s" | "p" | "d" | "f";

export type BiologicalStatus = "essential" | "trace" | "toxic" | "inert" | "unknown";

export type SafetyHazard =
  | "radioactive"
  | "toxic"
  | "corrosive"
  | "flammable"
  | "reactive"
  | "inert"
  | "oxidizer";

export interface ElementApplication {
  title: string;
  description: string;
  iconName: string;
}

export interface ElementAbundance {
  crust?: string;
  ocean?: string;
  atmosphere?: string;
  universe?: string;
  humanBody?: string;
}

export interface ElementIsotope {
  massNumber: number;
  symbol: string;
  abundance: number | null; // percentage e.g. 98.93, null for unstable synthetic
  halfLife: string; // e.g. "Stable", "5730 years", "0.69 ms"
  isStable: boolean;
  decayMode?: string; // e.g. "Beta-", "Alpha", "EC", "None"
}

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number | string; // e.g. 1.008 or "[294]"
  category: ElementCategory;
  group: number | null; // 1 to 18 (null for f-block)
  period: number; // 1 to 7
  block: ElementBlock;
  phaseAt293K: ElementPhase;
  electronConfiguration: string;
  electronConfigurationFull?: string;
  shells: number[]; // K, L, M, N, O, P, Q counts
  electronegativity: number | null; // Pauling
  density: number | null; // g/cm³ at 293K
  meltingPoint: number | null; // Kelvin
  boilingPoint: number | null; // Kelvin
  discoveredBy: string;
  discoveryYear: number | string | null;
  discoveryLocation?: string;
  discoveryStory: string;
  atomicRadius: number | null; // pm
  covalentRadius: number | null; // pm
  vanDerWaalsRadius: number | null; // pm
  ionizationEnergy: number | null; // kJ/mol
  electronAffinity: number | null; // kJ/mol
  thermalConductivity: number | null; // W/(m·K)
  electricalConductivity: number | null; // MS/m
  specificHeat: number | null; // J/(g·K)
  oxidationStates: string;
  magneticOrdering: string;
  crystalStructure: string;
  shortDescription: string;
  summary: string;
  applications: ElementApplication[];
  abundance: ElementAbundance;
  biologicalRole: string;
  biologicalStatus: BiologicalStatus;
  safetyHazards: SafetyHazard[];
  isotopes: ElementIsotope[];
  funFact: string;
  isRadioactive: boolean;
  isSynthetic: boolean;
  isPredicted: boolean;
}

export type PeriodicTrendId =
  | "atomicRadius"
  | "electronegativity"
  | "ionizationEnergy"
  | "electronAffinity"
  | "meltingPoint"
  | "boilingPoint"
  | "density";

export interface PeriodicTrendDefinition {
  id: PeriodicTrendId;
  name: string;
  unit: string;
  description: string;
  higherIsBetterLabel?: string;
  lowerIsBetterLabel?: string;
  colorScheme: "cyan-to-amber" | "violet-to-rose" | "blue-to-emerald" | "amber-to-red";
}
