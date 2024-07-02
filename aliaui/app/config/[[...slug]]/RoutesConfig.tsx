"use client"
import React from "react";
import AddRouterConfig from "./AddRouterConfig";
import { routes } from '@prisma/client'
import RouteDiv from "./routeDiv";


export default function RoutesConfig({ configRoutes }: { configRoutes: routes[] }) {
    const routersz = <RouteDiv routes={configRoutes} />

    return (
        <div>
            {routersz}
        </div>
    );
}
