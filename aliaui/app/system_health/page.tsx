"use client"

import React, { useState, useEffect } from "react";
import { checkStatusHub, checkStatusDriver, checkStatusScheduler } from "@/lib/checkStatus";
import { Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import { Activity, Database, Clock, Server } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SystemHealth() {
    // 1. Change initial state to null to distinguish between "Down" and "Loading"
    const [status, setStatus] = useState<{
        hub: boolean | null,
        driver: boolean | null,
        scheduler: boolean | null
    }>({
        hub: null,
        driver: null,
        scheduler: null
    });

    useEffect(() => {
        const pollStatus = async () => {
            const [hub, driver, scheduler] = await Promise.all([
                checkStatusHub(),
                checkStatusDriver(),
                checkStatusScheduler()
            ]);
            setStatus({ hub, driver, scheduler });
        };

        pollStatus();
        const interval = setInterval(pollStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const services = [
        { id: "driver", name: "Valve Driver", state: status.driver, icon: <Server size={20} /> },
        { id: "hub", name: "Central Hub", state: status.hub, icon: <Database size={20} /> },
        { id: "scheduler", name: "Flow Scheduler", state: status.scheduler, icon: <Clock size={20} /> },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white flex items-center justify-center gap-3">
                    <Activity className="text-blue-500" />
                    System Live Monitor
                </h1>
                <p className="text-default-500 text-sm italic">Service verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => {
                    // Determine visual style based on three states: Loading, OK, or Down
                    const isLoading = service.state === null;
                    const isUp = service.state === true;

                    let borderColor = "border-default-200";
                    if (!isLoading) borderColor = isUp ? "border-success" : "border-danger";

                    return (
                        <Card key={service.id} shadow="sm" className={`border-b-4 transition-colors duration-500 ${borderColor}`}>
                            <CardBody className="flex flex-col items-center py-8 gap-4">
                                <div className={`p-4 rounded-full ${isLoading ? "bg-default-100 text-default-400" :
                                    isUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                                    }`}>
                                    {service.icon}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold uppercase tracking-widest text-default-600">{service.name}</p>
                                    <div className="mt-2 h-7 flex items-center justify-center">
                                        {isLoading ? (
                                            <Chip variant="flat" size="sm" startContent={<Spinner size="sm" color="current" />}>
                                                CHECKING...
                                            </Chip>
                                        ) : isUp ? (
                                            <Chip color="success" variant="flat" size="sm" className="font-bold uppercase">
                                                Operational
                                            </Chip>
                                        ) : (
                                            <Chip color="danger" variant="solid" size="sm" className="font-bold animate-pulse uppercase">
                                                Offline
                                            </Chip>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>

            <div className="bg-default-100 p-4 rounded-xl flex items-center justify-between border border-default-200">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-xs font-mono text-default-500 uppercase tracking-widest">Live Sync Active</span>
                </div>
                <span className="text-xs text-default-400 font-mono italic">Refresh Rate: 5000ms</span>
            </div>
        </div>
    );
}