"use client"

import React, { useState, useEffect } from "react";
import Chart from "./Chart";
import configData from "../config.json";
import { Paper } from "@mui/material";
import { routers, routes, zones } from '@prisma/client'

export default function Overview({ routes, routers, zones }: { routes: routes[], routers: routers[], zones: zones[] }) {
    const ip = configData["MQTT-IP"]
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
            id: r.from + "->" + r.to,
            source: r.from!.toString(),
            target: r.to!.toString(),
            label: (r.pump_microprocessor_port + "/" + r.pump_hub_port)!,
        };
    }).concat([{
        id: "base_station" + "->" + data['TO'],
        source: "base_station",
        target: data['TO'],
        label: "TO",
    }]);
    console.log(edges)

    return (

        <div>
            <Paper>
                <div className="App">
                    <Chart
                        nodes={zonesNodes.concat(routersNodes)}
                        edges={edges}
                    />
                </div>

            </Paper>
        </div>
    );
}
