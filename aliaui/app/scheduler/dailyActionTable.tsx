"use client"
import React from "react";
interface schedule {
    hour: number;
    minute: number,
    water_pump: number,
    routing_time: number
    warmup_pump: number
    warmup_compressor: number
    compressing_time: number
}
export default function DailyActionsTable({ schedules }: { schedules: schedule[] }) {

    return (


        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Hour
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Water Pump
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Warm up time Pump
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Pumping Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Warm up time Compressor
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Compressing Time
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(sch => (
                        <tr key={sch.hour + ":" + sch.minute} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {sch.hour.toString().padStart(2, ('0'))} : {sch.minute.toString().padStart(2, ('0'))}
                            </th>
                            <td className="px-6 py-4">
                                {sch.water_pump}
                            </td>
                            <td className="px-6 py-4">
                                {sch.warmup_pump} (sec)
                            </td>
                            <td className="px-6 py-4">
                                {sch.routing_time} (sec)
                            </td>
                            <td className="px-6 py-4">
                                {sch.warmup_compressor} (sec)
                            </td>
                            <td className="px-6 py-4">
                                {sch.compressing_time} (sec)
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}