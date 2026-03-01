import { KnowledgeGraph } from "@/components/graph/KnowledgeGraph";
import { HomepageOverlay } from "@/components/graph/HomepageOverlay";
import { buildGraphData } from "@/lib/graph-data";

export default function Home() {
  const graphData = buildGraphData();

  return (
    <>
      <KnowledgeGraph data={graphData} />
      <HomepageOverlay />
    </>
  );
}
