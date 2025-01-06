"use client"
import { irrigation } from "@prisma/client";
import React from "react";
import DailyActionsTable from "./dailyActionTable";
import EventsTimeLine from "./EventsTimeline";
interface scheduleStats {
    name: string
    zones: string[]
    todoCount: number;
    notTodoCount: number;
    minDate: Date | null;
    maxDate: Date | null;
    nextIrrigation: Date | null;
    schedule: {
        hour: number;
        minute: number,
        water_level: number,
        dose_1: number,
        dose_2: number,
        dose_3: number,
        dose_4: number,
        mixing_time: number,
        routing_time: number,
        compressing_time: number;
    }[];
}
export default function JobInfo({ irrigations, scheduleStats }: { irrigations: irrigation[], scheduleStats: scheduleStats }) {


    return (
        <div className="flex flex-col">
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Zones</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{scheduleStats.zones.toString()}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Start date</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{scheduleStats.minDate?.toDateString()}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">End date</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{scheduleStats.maxDate?.toDateString()}</dd>
                    </div>

                </dl>
            </div>
            <DailyActionsTable schedules={scheduleStats.schedule} />
            <EventsTimeLine irrigations={irrigations.filter(x => x.status != 'TODO')} />
        </div>
    )
}