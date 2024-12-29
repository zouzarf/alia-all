import prisma from "@/lib/db";
import React from "react";

export default async function SystemHealth() {
    const generalConfig = await prisma.general_config.findMany()
    const zones = await prisma.zones.findMany()
    const services = await prisma.services.findMany()
    const hardwares = await prisma.hardware.findMany()
    const mqttIp = process.env.RASP_SERVER || ""
    return (
        <div>

            <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Services health</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Component name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last heartbeat
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(x => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {x.name}
                                </th>
                                <td className="px-6 py-4">
                                    {x.heartbeat!.getTime() + 5 * 60 * 100 >= new Date().getTime() ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>}
                                </td>
                                <td className="px-6 py-4">
                                    {x.heartbeat?.toISOString().toString()}
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">Hardware Health</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Component name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last heartbeat
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {hardwares.map(x => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {x.name}
                                </th>
                                <td className="px-6 py-4">
                                    {x.heartbeat!.getTime() + 5 * 60 * 100 >= new Date().getTime() ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>}
                                </td>
                                <td className="px-6 py-4">
                                    {x.heartbeat?.toISOString().toString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}