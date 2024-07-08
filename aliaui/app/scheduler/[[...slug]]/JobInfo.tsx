"use client"
import { Paper } from "@mui/material";
import { Button, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { actions, events_logs, jobs } from "@prisma/client";
import React, { Key } from "react";
import DailyActionsTable from "./dailyActionTable";
import EventsTimeLine from "./EventsTimeline";
import { deleteJob } from "@/lib/schedulerActions";
import DeleteIcon from '@mui/icons-material/Delete';

export default function JobInfo({ job, dailyActions, events }: { job: jobs, dailyActions: actions[], events: events_logs[] }) {



    return (
        <Paper>
            <div>
                <Button className="justify-self-start" isIconOnly variant="bordered" color="danger" onClick={() => { deleteJob(job.id); }}>
                    <DeleteIcon />
                </Button>
                <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Job</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.name}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Zone</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.zone}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Start date</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.start_date?.toUTCString()}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">End date</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.end_date?.toUTCString()}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Daily actions</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"><DailyActionsTable dailyActions={dailyActions} /></dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Past events</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"><EventsTimeLine events={events} /></dd>
                        </div>

                    </dl>
                </div>
            </div>
        </Paper>

    )
}