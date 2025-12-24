import prisma from "@/lib/db";
import React from "react";
import Body from "./body";
export const dynamic = 'force-dynamic'
export default async function Home() {
    const zones = await prisma.zones.findMany()
    return (
        <Body zones={zones} />
    );
}