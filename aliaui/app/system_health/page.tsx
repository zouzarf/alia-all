"use client"
import React, { useState, useEffect } from "react";
import { checkStatusHub, checkStatusDriver, checkStatusScheduler } from "@/lib/checkStatus";
export const dynamic = 'force-dynamic'
export default function SystemHealth() {
    const [isHubUp, setIsHubUp] = useState(false)
    const [isDriverHub, setIsDriverUp] = useState(false)
    const [isSchedulerUp, setIsSchedulerUp] = useState(false)

    useEffect(() => {
        const pollStatus = async () => {
            setIsHubUp(await checkStatusHub())
            setIsDriverUp(await checkStatusDriver())
            setIsSchedulerUp(await checkStatusScheduler())
        }

        // Initial check
        pollStatus()

        // Poll every 1 second
        const interval = setInterval(pollStatus, 5000)

        return () => clearInterval(interval)
    }, [])
    return (
        <div className="gap-15" >
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={"scheduler"} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Driver
                            </th>
                            <td className="px-6 py-4">
                                {isDriverHub ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>}
                            </td>
                        </tr>
                        <tr key={"hub"} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Hub
                            </th>
                            <td className="px-6 py-4">
                                {isHubUp ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>}
                            </td>
                        </tr>
                        <tr key={"hub"} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Scheduler
                            </th>
                            <td className="px-6 py-4">
                                {isSchedulerUp ? <p className="text-green-600 font-bold">OK</p> : <p className="text-red-600 font-bold">NOT OK</p>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div >
    );
}