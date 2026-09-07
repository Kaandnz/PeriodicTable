import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ELEMENTS, getElement } from "@/data/elements";
import { ElementClientPage } from "./ElementClientPage";

interface ElementPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const el of ELEMENTS) {
    params.push({ slug: el.name.toLowerCase() });
    params.push({ slug: el.symbol.toLowerCase() });
    params.push({ slug: el.atomicNumber.toString() });
  }
  return params;
}

export async function generateMetadata({ params }: ElementPageProps): Promise<Metadata> {
  const { slug } = await params;
  const element = getElement(slug);
  if (!element) return { title: "Element Not Found — Elementa" };

  return {
    title: `${element.name} (${element.symbol}) — Atomic Number ${element.atomicNumber} | Elementa`,
    description: `Comprehensive scientific analysis of ${element.name} (${element.symbol}). Atomic mass: ${element.atomicMass} u. Electron config: ${element.electronConfiguration}. Discoverer: ${element.discoveredBy}.`,
  };
}

export default async function ElementPage({ params }: ElementPageProps) {
  const { slug } = await params;
  const element = getElement(slug);

  if (!element) {
    notFound();
  }

  return <ElementClientPage element={element} />;
}
