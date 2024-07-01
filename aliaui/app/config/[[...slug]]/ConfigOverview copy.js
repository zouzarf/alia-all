import React, { useState } from "react";

import { GraphCanvas } from "reagraph";
import base_station_img from "../t.png";

export default function ConfigOverview(props) {
  const masterEvent = props.master_event;
  const zonesNodes=props.zonesNodes
  const routersNodes=props.routersNodes
  const edges=props.edges

  return (
    <div>
      <h1>Configuration overview </h1>

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
          nodes={routersNodes.concat(zonesNodes).concat([
            {
              id: "base_station",
              label: "base_station",
              fill: "#3f3fff",
              icon: base_station_img,
            },
          ])}
          edges={edges}
        />
      </div>
    </div>
  );
}
