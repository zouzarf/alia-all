"use client"

import React, { useState, useEffect } from "react";
import Chart from "./Chart";
import { Paper } from "@mui/material";
import { routers, routes, zones } from '@prisma/client'

export default function Overview({ routes, routers, zones }: { routes: routes[], routers: routers[], zones: zones[] }) {
    const [data, setData] = useState({ "TO": "test", "pump": "E" });

    const zonesNodes = zones.map(l => {
        return {
            id: l.name,
            label: l.name,
            fill: "#4fce7e",
            icon: "/zone.png",
        };
    });
    const routersNodes = routers.map(l => {
        return {
            id: l.name,
            label: l.name,
            fill: "black",
            icon: "/router.png",
        };
    });
    console.log(routersNodes)
    const edges = routes.map(r => {
        return {
            id: r.src + "->" + r.dst,
            source: r.src!.toString(),
            target: r.dst!.toString(),
            label: (r.valve_microprocessor_port + "/" + r.valve_hub_port)!,
        };
    }).concat([{
        id: "base_station" + "->" + (((routers.filter(x => x.linked_to_base_station).length) > 0) ? routers.filter(x => x.linked_to_base_station)[0].name : ""),
        source: "base_station",
        target: routers.filter(x => x.linked_to_base_station).length > 0 ? routers.filter(x => x.linked_to_base_station)[0].name : "",
        label: "TO",
    }]);
    console.log(edges)

    return (

        <Chart
            nodes={zonesNodes.concat(routersNodes)}
            edges={edges}
        />
    );
}
