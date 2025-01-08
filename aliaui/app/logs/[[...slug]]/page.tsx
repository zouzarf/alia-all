import prisma from "@/lib/db";
import React from "react";
import Logs from "./Logs";
export const dynamic = 'force-dynamic'
export default async function Page() {
    const a = await prisma.logs.findMany({
        orderBy: [
            {
                ts: 'desc',
            },
        ],
        take: 50
    })
    return (
        <Logs logs={a} />
    );
}