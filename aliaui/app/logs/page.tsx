import { Paper } from "@mui/material";
import prisma from "@/lib/db";

export default async function Logs() {
    const a = await prisma.logs.findMany({
        orderBy: [
            {
                ts: 'desc',
            },
        ],
        take: 10
    })
    console.log(a)
    return
    <>
        <div>
            <Paper>
                {a.map(x => x.ts?.toLocaleString() + "  -   " + x.producer + "  -  " + x.log_message)}
            </Paper>
        </div>
    </>
}