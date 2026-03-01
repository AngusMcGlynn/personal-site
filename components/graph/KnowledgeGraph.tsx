"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import type { GraphData, GraphNode, GraphLink } from "@/lib/graph-data";
import { GraphPreview } from "./GraphPreview";

interface SimNode extends GraphNode, d3.SimulationNodeDatum {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: SimNode;
  target: SimNode;
}

interface Props {
  data: GraphData;
}

export function KnowledgeGraph({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<GraphNode | null>(null);
  const [tooltip, setTooltip] = useState<{
    node: GraphNode;
    x: number;
    y: number;
  } | null>(null);
  const router = useRouter();

  const handleNodeClick = useCallback(
    (node: SimNode) => {
      if (node.type === "core" && node.permalink) {
        router.push(node.permalink);
      } else if (node.type === "entry") {
        setSelectedEntry(node);
      }
    },
    [router]
  );

  const handleBackgroundClick = useCallback(() => {
    setSelectedEntry(null);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Deep clone data for D3 mutation
    const nodes: SimNode[] = data.nodes.map((n) => ({ ...n }));
    const links: SimLink[] = data.links.map((l) => ({
      source: nodes.find((n) => n.id === l.source)!,
      target: nodes.find((n) => n.id === l.target)!,
    }));

    const d3Svg = d3
      .select(svg)
      .attr("viewBox", [-width / 2, -height / 2, width, height].join(" "));

    d3Svg.selectAll("*").remove();

    const g = d3Svg.append("g");

    // Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    d3Svg.call(zoom);

    // Background click to deselect
    d3Svg.on("click", (event) => {
      if (event.target === svg) {
        handleBackgroundClick();
      }
    });

    // Links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .attr("stroke-width", 1);

    // Nodes
    const node = g
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => (d.type === "core" ? 8 : 4))
      .attr("fill", (d) =>
        d.type === "core" ? "#A3B18A" : "rgba(255, 255, 255, 0.6)"
      )
      .attr("cursor", "pointer")
      .attr("stroke", "none");

    // Labels (always visible for core nodes)
    const label = g
      .append("g")
      .selectAll("text")
      .data(nodes.filter((n) => n.type === "core"))
      .join("text")
      .text((d) => d.label)
      .attr("fill", "rgba(255, 255, 255, 0.87)")
      .attr("font-size", "12px")
      .attr("font-family", "var(--font-geist-sans), sans-serif")
      .attr("text-anchor", "middle")
      .attr("dy", -16)
      .attr("pointer-events", "none");

    // Hover interactions
    node
      .on("mouseenter", (event, d) => {
        // Enlarge node
        d3.select(event.currentTarget)
          .transition()
          .duration(150)
          .attr("r", d.type === "core" ? 11 : 7);

        // Brighten connected edges
        link
          .transition()
          .duration(150)
          .attr("stroke", (l) =>
            l.source.id === d.id || l.target.id === d.id
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(255, 255, 255, 0.1)"
          )
          .attr("stroke-width", (l) =>
            l.source.id === d.id || l.target.id === d.id ? 1.5 : 1
          );

        // Show tooltip for entry nodes
        const svgRect = svg.getBoundingClientRect();
        const point = svg.createSVGPoint();
        point.x = d.x ?? 0;
        point.y = d.y ?? 0;
        const ctm = g.node()?.getCTM();
        const screenPoint = ctm ? point.matrixTransform(ctm) : point;
        setTooltip({
          node: d,
          x: screenPoint.x - svgRect.x + svgRect.left,
          y: screenPoint.y - svgRect.y + svgRect.top,
        });
      })
      .on("mouseleave", (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(150)
          .attr("r", d.type === "core" ? 8 : 4);

        link
          .transition()
          .duration(150)
          .attr("stroke", "rgba(255, 255, 255, 0.1)")
          .attr("stroke-width", 1);

        setTooltip(null);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        handleNodeClick(d);
      });

    // Drag
    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as unknown as (selection: typeof node) => void);

    // Force simulation
    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .alphaDecay(0.01)
      .velocityDecay(0.3)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((l) => {
            const src = l.source as SimNode;
            const tgt = l.target as SimNode;
            if (src.type === "core" || tgt.type === "core") return 120;
            return 180;
          })
          .strength(0.3)
      )
      .force(
        "charge",
        d3.forceManyBody<SimNode>().strength((d) => (d.type === "core" ? -400 : -150))
      )
      .force(
        "collision",
        d3.forceCollide<SimNode>().radius((d) => (d.type === "core" ? 40 : 20))
      )
      .force("center", d3.forceCenter(0, 0).strength(0.05))
      .on("tick", () => {
        link
          .attr("x1", (d) => d.source.x!)
          .attr("y1", (d) => d.source.y!)
          .attr("x2", (d) => d.target.x!)
          .attr("y2", (d) => d.target.y!);

        node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

        label.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
      });

    simulationRef.current = simulation;

    // Idle drift
    const driftInterval = setInterval(() => {
      if (simulation.alpha() < 0.01) {
        simulation.alpha(0.02).restart();
      }
    }, 5000);

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      d3Svg.attr("viewBox", [-w / 2, -h / 2, w, h].join(" "));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      simulation.stop();
      clearInterval(driftInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [data, handleNodeClick, handleBackgroundClick]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-bg">
      <svg ref={svgRef} className="h-full w-full" />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs -translate-x-1/2 -translate-y-full px-3 py-2"
          style={{ left: tooltip.x, top: tooltip.y - 20 }}
        >
          <div className="text-sm font-sans text-heading">{tooltip.node.label}</div>
          <div className="text-xs text-secondary mt-0.5">{tooltip.node.description}</div>
        </div>
      )}

      {/* Preview panel */}
      {selectedEntry && (
        <GraphPreview
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}
