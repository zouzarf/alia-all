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
        water_pump: number,
        routing_time: number
        warmup_pump: number
        warmup_compressor: number
        compressing_time: number
    }[];
}
export default function JobInfo({ irrigations, scheduleStats }: { irrigations: irrigation[], scheduleStats: scheduleStats }) {


    return (
        <div className="flex flex-col">


            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Zones
                            </th>
                            <td className="px-6 py-4">
                                {scheduleStats.zones.toString()}
                            </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Start Date
                            </th>
                            <td className="px-6 py-4">
                                {scheduleStats.minDate?.toDateString()}
                            </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                End Date
                            </th>
                            <td className="px-6 py-4">
                                {scheduleStats.maxDate?.toDateString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <DailyActionsTable schedules={scheduleStats.schedule} />
            <EventsTimeLine irrigations={irrigations.filter(x => x.status != 'TODO')} />
        </div>
    )
}