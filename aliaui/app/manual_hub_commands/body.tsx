"use client"
import { CircularProgress, Paper } from "@mui/material";
import React from "react";
import Routing from "./routing";
import { zones } from "@prisma/client";

export default function Body({ zones }: { zones: zones[] }) {
    const [hubEvent, setHubEvent] = React.useState<string | null>(null);
    return (
        <Paper>


            <div className="flex flex-row w-full gap-10 p-2">


                <div className='flex flex-col gap-10 w-full'>


                    <div className="relative overflow-x-auto">
                        <Routing zones={zones} hubEvent={hubEvent!} />
                    </div>


                </div>

            </div>
        </Paper>
    )
}