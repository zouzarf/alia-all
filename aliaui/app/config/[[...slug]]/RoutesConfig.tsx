"use client"
import React from "react";
import AddRouterConfig from "./AddRouterConfig";
import { routes } from '@prisma/client'
import RouteDiv from "./routeDiv";


export default function RoutesConfig({ configRoutes }: { configRoutes: routes[] }) {
    const routersz = configRoutes.map((e) => (
        <RouteDiv routes={e} />
    ));

    return (
        <div
            style={{
                border: "2px solid red",
                background: "#92A8D1",
                margin: "left 3000px",
            }}
        >
            {routersz}
        </div>
    );
}
