import prisma from "@/lib/db";
import React from "react";
import Body from "./body";

export default async function Home() {
    const router = await prisma.routers.findMany()
    const bs_config = await prisma.base_station_ports.findMany()
    const routings = await prisma.routes.findMany()
    const mqttIp = process.env.RASP_SERVER || ""
    const generalConfig = await prisma.general_config.findMany()
    return (
        <Body bs_config={bs_config} router={router} routings={routings} mqttIp={mqttIp} general_config={generalConfig} />
    );
}