"use client"

import { irrigation } from "@prisma/client"
import { CheckCircle2, Clock, PlayCircle, StopCircle } from "lucide-react";
import { Chip } from "@nextui-org/react";

export default function EventsTimeline({ irrigations }: { irrigations: irrigation[] }) {
    // Sort irrigations by date descending so newest executions are at the top
    const sortedIrrigations = [...irrigations].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="p-2">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-default-200 before:to-transparent">
                {sortedIrrigations.map((e) => (
                    <Event key={e.id} irrigation={e} />
                ))}
                {sortedIrrigations.length === 0 && (
                    <p className="text-center text-default-400 text-sm italic py-4">
                        No execution records found.
                    </p>
                )}
            </div>
        </div>
    )
}

function Event({ irrigation }: { irrigation: irrigation }) {
    const durationInSeconds = irrigation.process_start && irrigation.process_end
        ? (irrigation.process_end.getTime() - irrigation.process_start.getTime()) / 1000
        : 0;

    return (
        <div className="relative flex items-start group">
            {/* Timeline Icon */}
            <div className="absolute left-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 z-10 shadow-sm transition-transform group-hover:scale-110">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
            </div>

            {/* Event Content */}
            <div className="ml-14 flex-1">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h4 className="font-black text-default-800 text-sm uppercase tracking-tight">
                            {new Date(irrigation.date).toLocaleDateString()}
                        </h4>
                        {/* Zone Name Badge */}
                        <Chip
                            size="sm"
                            variant="dot"
                            color="primary"
                            className="border-none h-6 font-bold text-[10px] uppercase"
                        >
                            {irrigation.zone_name}
                        </Chip>
                    </div>

                    <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        startContent={<Clock size={12} />}
                        className="font-bold px-2"
                    >
                        {formatTime(durationInSeconds)}
                    </Chip>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-default-50 border border-default-200 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-3 text-tiny font-bold uppercase text-default-500">
                        <PlayCircle size={14} className="text-blue-400" />
                        <div className="flex flex-col">
                            <span className="text-[9px] text-default-400 font-black">Started</span>
                            <span>{irrigation.process_start ? new Date(irrigation.process_start).toLocaleTimeString() : "N/A"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-tiny font-bold uppercase text-default-500">
                        <StopCircle size={14} className="text-orange-400" />
                        <div className="flex flex-col">
                            <span className="text-[9px] text-default-400 font-black">Ended</span>
                            <span>{irrigation.process_end ? new Date(irrigation.process_end).toLocaleTimeString() : "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function formatTime(seconds: number) {
    if (!seconds || seconds <= 0) return "0s";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(" ");
}