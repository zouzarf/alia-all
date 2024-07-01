import React from "react";

import { GraphCanvas, GraphEdge, GraphNode } from "reagraph";
export default function Chart({ nodes, edges }: { nodes: GraphNode[], edges: GraphEdge[] }) {


  return (
    <div>
      <div
        style={{
          border: "solid 1px red",
          height: "500px",
          margin: "10px",
          position: "relative",
        }}
      >
        <GraphCanvas
          layoutType="hierarchicalLr"
          labelType="all"
          nodes={nodes.concat([
            {
              id: "base_station",
              label: "base_station",
              fill: "#3f3fff",
              icon: "/base-station.png",
            },
          ])}
          edges={edges}
        />
      </div>
    </div>
  );
}
