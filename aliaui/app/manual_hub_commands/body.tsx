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
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Command
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Parameters
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Start
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <Routing zones={zones} hubEvent={hubEvent!} />
                            </tbody>
                        </table>
                    </div>


                </div>

            </div>
        </Paper>
    )
}