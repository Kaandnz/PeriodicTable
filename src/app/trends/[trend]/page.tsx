import { PERIODIC_TRENDS } from "@/data/trends";
import TrendClientPage from "./TrendClientPage";

export async function generateStaticParams() {
  return PERIODIC_TRENDS.map((t) => ({ trend: t.id }));
}

export default async function TrendPage({
  params,
}: {
  params: Promise<{ trend: string }>;
}) {
  const { trend } = await params;
  return <TrendClientPage trend={trend} />;
}
