import prisma from "@/lib/db";
import React from "react";
import Body from "./body";

export default async function Home() {
    const generalConfig = await prisma.general_config.findMany()
    const zones = await prisma.zones.findMany()
    const mqttIp = process.env.RASP_SERVER || ""
    return (
        <Body zones={zones} general_config={generalConfig} mqttIp={mqttIp} />
    );
}