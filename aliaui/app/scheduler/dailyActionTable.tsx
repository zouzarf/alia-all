"use client"

import React from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip
} from "@nextui-org/react";
import { Clock, Zap, Waves, Wind, ArrowRight } from "lucide-react";

interface schedule {
    hour: number;
    minute: number;
    water_pump: number;
    routing_time: number;
    warmup_pump: number;
    warmup_compressor: number;
    compressing_time: number;
}

export default function DailyActionsTable({ schedules }: { schedules: schedule[] }) {
    return (
        <Table
            aria-label="Daily Irrigation Schedule"
            removeWrapper
            classNames={{
                th: "bg-default-100 text-default-800 font-black text-[10px] uppercase tracking-widest",
                td: "py-4 font-medium text-small border-b border-default-100 last:border-none",
            }}
        >
            <TableHeader>
                <TableColumn width={120}>TIME</TableColumn>
                <TableColumn>HARDWARE</TableColumn>
                <TableColumn>WATER FLOW SEQUENCE</TableColumn>
                <TableColumn>AIR PURGE SEQUENCE</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No daily actions defined for this job."}>
                {schedules.map((sch, idx) => (
                    <TableRow key={`${sch.hour}-${sch.minute}-${idx}`}>
                        {/* Time Cell */}
                        <TableCell>
                            <div className="flex items-center gap-2 text-primary font-mono font-bold text-base">
                                <Clock size={14} className="text-default-400" />
                                {sch.hour.toString().padStart(2, '0')}:{sch.minute.toString().padStart(2, '0')}
                            </div>
                        </TableCell>

                        {/* Pump ID Cell */}
                        <TableCell>
                            <Chip size="sm" color="primary" variant="flat" className="font-bold uppercase text-[10px]">
                                Pump Unit {sch.water_pump}
                            </Chip>
                        </TableCell>

                        {/* Water Sequence Cell */}
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-default-500">
                                    <Zap size={14} className="text-amber-500" />
                                    <span>{sch.warmup_pump}s</span>
                                </div>
                                <ArrowRight size={12} className="text-default-300" />
                                <div className="flex items-center gap-1 text-blue-600 font-bold">
                                    <Waves size={14} />
                                    <span>{sch.routing_time}s</span>
                                </div>
                            </div>
                        </TableCell>

                        {/* Air Sequence Cell */}
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-default-500">
                                    <Zap size={14} className="text-amber-500" />
                                    <span>{sch.warmup_compressor}s</span>
                                </div>
                                <ArrowRight size={12} className="text-default-300" />
                                <div className="flex items-center gap-1 text-sky-600 font-bold">
                                    <Wind size={14} />
                                    <span>{sch.compressing_time}s</span>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}