import prisma from "@/lib/db";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key } from "react";
import { logs } from "@prisma/client";
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