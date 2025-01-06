"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React from "react";
interface schedule {
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
                            Water Level
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Doses
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Mixing Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Routing Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Compressing Time
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(sch => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {sch.hour.toString().padStart(2, ('0'))} : {sch.minute.toString().padStart(2, ('0'))}
                            </th>
                            <td className="px-6 py-4">
                                {sch.water_level} L
                            </td>
                            <td className="px-6 py-4">
                                <p>Dose1: {sch.water_level} ml</p>
                                <p>Dose2: {sch.water_level} ml</p>
                                <p>Dose3: {sch.water_level} ml</p>
                                <p>Dose4: {sch.water_level} ml</p>
                            </td>
                            <td className="px-6 py-4">
                                {sch.mixing_time} (min)
                            </td>
                            <td className="px-6 py-4">
                                {sch.routing_time} (min)
                            </td>
                            <td className="px-6 py-4">
                                {sch.compressing_time} (min)
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}