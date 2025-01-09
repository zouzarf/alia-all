import prisma from "@/lib/db";
import React from "react";
import { DateTime } from "luxon";
export const dynamic = 'force-dynamic'
export default async function SystemHealth() {
    const generalConfig = await prisma.general_config.findMany()
    const zones = await prisma.zones.findMany()
    const routers = await prisma.routers.findMany()
    const services = await prisma.services.findMany()
    const hardwares = await prisma.hardware.findMany()
    const mqttIp = process.env.RASP_SERVER || ""
    return (
        <div className="gap-15" >
            <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Hardware health</h1>
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
                        {routers.map(x => {
                            return (
                                <tr key={x.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {x.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {hardwares.filter(h => h.name == x.name).length > 0 ? (DateTime.now().diff(DateTime.fromJSDate(hardwares.filter(h => h.name == x.name)[0].heartbeat!), ["seconds"]).seconds <= 30 ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>) : <p className="text-red-600 font-bold">NOT OK</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {hardwares.filter(h => h.name == x.name).length > 0 ? DateTime.fromJSDate(hardwares.filter(h => h.name == x.name)[0].heartbeat!).toHTTP() : "Na"}
                                    </td>
                                </tr>
                            )
                        })}
                        <tr key={"base_station"} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Base Station
                            </th>
                            <td className="px-6 py-4">
                                {hardwares.filter(h => h.name == "base_station").length > 0 ? (DateTime.now().diff(DateTime.fromJSDate(hardwares.filter(h => h.name == "base_station")[0].heartbeat!), ["seconds"]).seconds <= 30 ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>) : <p className="text-red-600 font-bold">NOT OK</p>}
                            </td>
                            <td className="px-6 py-4">
                                {hardwares.filter(h => h.name == "base_station").length > 0 ? DateTime.fromJSDate(hardwares.filter(h => h.name == "base_station")[0].heartbeat!).toHTTP() : "Na"}
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">Services Health</h1>
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
                        <tr key={"hub"} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Hub
                            </th>
                            <td className="px-6 py-4">
                                {services.filter(h => h.name == "hub").length > 0 ? (DateTime.now().diff(DateTime.fromJSDate(services.filter(h => h.name == "hub")[0].heartbeat!), ["seconds"]).seconds <= 30 ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>) : <p className="text-red-600 font-bold">NOT OK</p>}
                            </td>
                            <td className="px-6 py-4">
                                {services.filter(h => h.name == "hub").length > 0 ? DateTime.fromJSDate(services.filter(h => h.name == "hub")[0].heartbeat!).toHTTP() : "Na"}
                            </td>
                        </tr>
                        <tr key={"scheduler"} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Scheduler
                            </th>
                            <td className="px-6 py-4">
                                {services.filter(h => h.name == "scheduler").length > 0 ? (DateTime.now().diff(DateTime.fromJSDate(services.filter(h => h.name == "scheduler")[0].heartbeat!), ["seconds"]).seconds <= 30 ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>) : <p className="text-red-600 font-bold">NOT OK</p>}
                            </td>
                            <td className="px-6 py-4">
                                {services.filter(h => h.name == "scheduler").length > 0 ? DateTime.fromJSDate(services.filter(h => h.name == "scheduler")[0].heartbeat!).toHTTP() : "Na"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div >
    );
}