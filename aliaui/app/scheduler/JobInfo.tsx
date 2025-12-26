"use client"

import { irrigation } from "@prisma/client";
import React from "react";
import DailyActionsTable from "./dailyActionTable";
import EventsTimeLine from "./EventsTimeline";
import { Card, CardBody, Chip, Divider } from "@nextui-org/react";
import { Calendar, MapPin, Activity, ListOrdered, History } from "lucide-react";

interface scheduleStats {
    name: string;
    zones: string[];
    todoCount: number;
    notTodoCount: number;
    minDate: Date | null;
    maxDate: Date | null;
    nextIrrigation: Date | null;
    schedule: {
        hour: number;
        minute: number;
        water_pump: number;
        routing_time: number;
        warmup_pump: number;
        warmup_compressor: number;
        compressing_time: number;
    }[];
}

export default function JobInfo({ irrigations, scheduleStats }: { irrigations: irrigation[], scheduleStats: scheduleStats }) {
    return (
        <div className="flex flex-col gap-8">
            {/* 1. Summary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card shadow="none" className="bg-default-50 border border-default-200">
                    <CardBody className="flex flex-row items-center gap-4 p-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                            <MapPin size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-default-400">Target Zones</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {scheduleStats.zones.map(z => (
                                    <Chip key={z} size="sm" variant="flat" color="primary" className="font-bold h-5 text-[10px]">
                                        {z}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card shadow="none" className="bg-default-50 border border-default-200">
                    <CardBody className="flex flex-row items-center gap-4 p-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-600">
                            <Calendar size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-default-400">Schedule Window</span>
                            <span className="text-xs font-bold text-default-700">
                                {scheduleStats.minDate ? new Date(scheduleStats.minDate).toLocaleDateString() : 'N/A'}
                                <span className="mx-2 text-default-300">→</span>
                                {scheduleStats.maxDate ? new Date(scheduleStats.maxDate).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </CardBody>
                </Card>

                <Card shadow="none" className="bg-default-50 border border-default-200">
                    <CardBody className="flex flex-row items-center gap-4 p-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-600">
                            <Activity size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-default-400">Progress</span>
                            <span className="text-xs font-bold text-default-700 uppercase">
                                {scheduleStats.notTodoCount} Executed / {scheduleStats.todoCount} Pending
                            </span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Divider />

            {/* 2. Defined Daily Logic */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <ListOrdered size={18} className="text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-default-800">Daily Plan</h3>
                </div>
                <div className="border border-default-200 rounded-2xl overflow-hidden bg-white">
                    <DailyActionsTable schedules={scheduleStats.schedule} />
                </div>
            </section>

            {/* 3. Execution History */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <History size={18} className="text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-default-800">Execution History</h3>
                </div>
                <div className="bg-default-50/50 p-4 rounded-2xl border border-default-200">
                    <EventsTimeLine irrigations={irrigations.filter(x => x.status !== 'TODO')} />
                </div>
            </section>
        </div>
    );
}