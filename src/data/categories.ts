import { ElementCategory } from "@/types/element";

export interface CategoryInfo {
  id: ElementCategory;
  name: string;
  shortName: string;
  description: string;
  color: string; // Tailwind or Hex
  accentColor: string;
  borderColor: string;
  bgGlow: string;
}

export const ELEMENT_CATEGORIES: Record<ElementCategory, CategoryInfo> = {
  "alkali-metal": {
    id: "alkali-metal",
    name: "Alkali Metals",
    shortName: "Alkali",
    description: "Highly reactive soft metals with a single valence electron, reacting vigorously with water.",
    color: "#DC4C4C",
    accentColor: "rgba(220, 76, 76, 1)",
    borderColor: "rgba(220, 76, 76, 0.32)",
    bgGlow: "rgba(220, 76, 76, 0.08)",
  },
  "alkaline-earth-metal": {
    id: "alkaline-earth-metal",
    name: "Alkaline Earth Metals",
    shortName: "Alkaline Earth",
    description: "Reactive metallic elements in Group 2 with two valence electrons, forming basic hydroxides.",
    color: "#D97736",
    accentColor: "rgba(217, 119, 54, 1)",
    borderColor: "rgba(217, 119, 54, 0.32)",
    bgGlow: "rgba(217, 119, 54, 0.08)",
  },
  "transition-metal": {
    id: "transition-metal",
    name: "Transition Metals",
    shortName: "Transition",
    description: "D-block metals characterized by multiple oxidation states, high density, and catalytic prowess.",
    color: "#3B82C4",
    accentColor: "rgba(59, 130, 196, 1)",
    borderColor: "rgba(59, 130, 196, 0.32)",
    bgGlow: "rgba(59, 130, 196, 0.08)",
  },
  "post-transition-metal": {
    id: "post-transition-metal",
    name: "Post-Transition Metals",
    shortName: "Post-Transition",
    description: "Metals located between transition metals and metalloids, typically softer with lower melting points.",
    color: "#2DA599",
    accentColor: "rgba(45, 165, 153, 1)",
    borderColor: "rgba(45, 165, 153, 0.32)",
    bgGlow: "rgba(45, 165, 153, 0.08)",
  },
  "metalloid": {
    id: "metalloid",
    name: "Metalloids",
    shortName: "Metalloids",
    description: "Elements with intermediate properties between metals and nonmetals, essential as semiconductors.",
    color: "#2CA779",
    accentColor: "rgba(44, 167, 121, 1)",
    borderColor: "rgba(44, 167, 121, 0.32)",
    bgGlow: "rgba(44, 167, 121, 0.08)",
  },
  "reactive-nonmetal": {
    id: "reactive-nonmetal",
    name: "Reactive Nonmetals",
    shortName: "Nonmetals",
    description: "Electronegative elements including life-essential CHNOPS and halogen oxidizers.",
    color: "#8461D4",
    accentColor: "rgba(132, 97, 212, 1)",
    borderColor: "rgba(132, 97, 212, 0.32)",
    bgGlow: "rgba(132, 97, 212, 0.08)",
  },
  "noble-gas": {
    id: "noble-gas",
    name: "Noble Gases",
    shortName: "Noble Gas",
    description: "Extremely inert, odorless gases with completely full valence electron shells.",
    color: "#D24792",
    accentColor: "rgba(210, 71, 146, 1)",
    borderColor: "rgba(210, 71, 146, 0.32)",
    bgGlow: "rgba(210, 71, 146, 0.08)",
  },
  "lanthanide": {
    id: "lanthanide",
    name: "Lanthanides",
    shortName: "Lanthanides",
    description: "Rare-earth f-block elements with bright luminescent, optical, and magnetic traits.",
    color: "#646DC7",
    accentColor: "rgba(100, 109, 199, 1)",
    borderColor: "rgba(100, 109, 199, 0.32)",
    bgGlow: "rgba(100, 109, 199, 0.08)",
  },
  "actinide": {
    id: "actinide",
    name: "Actinides",
    shortName: "Actinides",
    description: "Heavy, all-radioactive f-block metals essential in nuclear chemistry and synthesis.",
    color: "#CC3E67",
    accentColor: "rgba(204, 62, 103, 1)",
    borderColor: "rgba(204, 62, 103, 0.32)",
    bgGlow: "rgba(204, 62, 103, 0.08)",
  },
  "unknown-properties": {
    id: "unknown-properties",
    name: "Unknown Properties",
    shortName: "Superheavy",
    description: "Artificially synthesized superheavy elements whose relativistic properties remain under investigation.",
    color: "#758398",
    accentColor: "rgba(117, 131, 152, 1)",
    borderColor: "rgba(117, 131, 152, 0.32)",
    bgGlow: "rgba(117, 131, 152, 0.08)",
  },
};
