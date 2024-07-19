import prisma from "@/lib/db";
import React from "react";
import Logs from "./Logs";

export default async function Page() {
    const a = await prisma.logs.findMany({
        orderBy: [
            {
                ts: 'desc',
            },
        ],
        take: 10
    })
    return (<Logs logs={a} />)
}