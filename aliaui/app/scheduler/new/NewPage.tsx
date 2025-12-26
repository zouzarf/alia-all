"use client"

import React, { useState } from "react";
import { insertScheduler } from "@/lib/schedulerActions";
import { zones } from '@prisma/client';
import {
    Input, Select, SelectItem, TimeInput, Button, DatePicker,
    CheckboxGroup, Checkbox, RadioGroup, Radio, Card, CardBody,
    Divider, Chip
} from "@nextui-org/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { Plus, Trash2, Clock, Wind, Waves, Zap, ListChecks, Settings2, Droplets, ArrowRight } from "lucide-react";

interface irrigation {
    time: Date;
    water_pump: number;
    routing_time: number;
    warmup_pump: number;
    warmup_compressor: number;
    compressing_time: number;
}

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function NewJob({ zones }: { zones: zones[] }) {
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [scheduleName, setScheduleName] = useState("");
    const [startingDate, setStartingDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [irrigationsTimeDriven, setIrrigationsTimeDriven] = useState<irrigation[]>([]);
    const [irrigationType, setIrrigationType] = useState("time-driven");

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await insertScheduler(
                {
                    name: scheduleName,
                    zones: selectedZones,
                    startDate: startingDate,
                    endDate: endDate
                },
                irrigationsTimeDriven
            );
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 relative">
            {loading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <div className="text-white text-xl font-bold tracking-widest uppercase">Adding...</div>
                </div>
            )}

            <header className="flex flex-col gap-2 border-b border-divider pb-6">
                <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Droplets size={32} className="text-blue-500" />
                    Irrigation Plan Builder
                </h1>
                <p className="text-default-500 font-medium text-sm">Define hardware timing and sequence for multi-zone water routing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card shadow="sm" className="border border-default-100">
                        <CardBody className="p-6 space-y-8">
                            {/* Header Section */}
                            <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest border-b border-default-100 pb-3">
                                <Settings2 size={16} /> Schedule Metadata
                            </div>

                            {/* Input Group - Added top margin to separate from metadata header */}
                            <div className="space-y-6">
                                <Input
                                    label="Schedule Title"
                                    placeholder="Tomato zones - A"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={scheduleName}
                                    onChange={(e) => setScheduleName(e.target.value)}
                                    classNames={{
                                        label: "text-default-700 font-bold text-xs uppercase"
                                    }}
                                />

                                <div className="grid grid-cols-1 gap-6">
                                    <DatePicker
                                        label="Cycle Start Date"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        onChange={(e) => setStartingDate(`${e!.year}-${e!.month.toString().padStart(2, "0")}-${e!.day.toString().padStart(2, "0")}`)}
                                        classNames={{ label: "text-default-700 font-bold text-xs uppercase" }}
                                    />
                                    <DatePicker
                                        label="Cycle Expiry Date"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        onChange={(e) => setEndDate(`${e!.year}-${e!.month.toString().padStart(2, "0")}-${e!.day.toString().padStart(2, "0")}`)}
                                        classNames={{ label: "text-default-700 font-bold text-xs uppercase" }}
                                    />
                                </div>
                            </div>

                            <Divider />

                            {/* Zones Section with Plan/Map Icon */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-default-800 font-bold text-xs uppercase tracking-tight">
                                    <ListChecks size={16} className="text-blue-500" /> Target Zones Plan
                                </div>
                                <CheckboxGroup
                                    value={selectedZones}
                                    onValueChange={setSelectedZones}
                                    aria-label="Select target zones"
                                >
                                    <div className="grid grid-cols-2 gap-3 pl-1">
                                        {zones.map(z => (
                                            <Checkbox key={z.name} value={z.name} classNames={{ label: "text-small font-medium" }}>
                                                {z.name}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </CheckboxGroup>
                            </div>

                            <Divider />

                            {/* Control Mode Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-default-800 font-bold text-xs uppercase tracking-tight">
                                    <Clock size={16} className="text-orange-500" /> Trigger Mode
                                </div>
                                <RadioGroup
                                    value={irrigationType}
                                    onValueChange={setIrrigationType}
                                >
                                    <Radio value="time-driven" classNames={{ label: "text-small" }}>Time-Triggered</Radio>
                                    <Radio
                                        value="event-driven"
                                        isDisabled
                                        description="Sensor feedback required"
                                        classNames={{ label: "text-small" }}
                                    >
                                        Event-Triggered
                                    </Radio>
                                </RadioGroup>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <TimeDrivenIrrigationTable
                        irrigationsList={irrigationsTimeDriven}
                        irrigationsSetter={setIrrigationsTimeDriven}
                    />

                    <Button
                        className="w-full h-16 font-black uppercase tracking-widest text-lg shadow-xl"
                        color="success"
                        onPress={handleSubmit}
                        isDisabled={irrigationsTimeDriven.length === 0 || !scheduleName}
                    >
                        Push Schedule
                    </Button>
                </div>
            </div>
        </div>
    );
}

function TimeDrivenIrrigationTable({ irrigationsList, irrigationsSetter }: { irrigationsList: irrigation[], irrigationsSetter: React.Dispatch<React.SetStateAction<irrigation[]>> }) {
    const [time, setTime] = useState<Date>(new Date());
    const [waterPump, setWaterPump] = useState(1);
    const [warmupPump, setWarmupPump] = useState("0");
    const [routingTime, setRoutingTime] = useState("0");
    const [warmupComp, setWarmupComp] = useState("0");
    const [compTimer, setCompTimer] = useState("0");

    const addEvent = () => {
        irrigationsSetter(oldArray => [...oldArray, {
            time: new Date(time),
            water_pump: waterPump,
            routing_time: parseFloat(routingTime),
            warmup_pump: parseFloat(warmupPump),
            warmup_compressor: parseFloat(warmupComp),
            compressing_time: parseFloat(compTimer)
        }].sort((a, b) => a.time.getTime() - b.time.getTime()));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <ListChecks size={20} className="text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-default-800">Daily Timeline</h3>
                </div>

                <div className="flex flex-col gap-4 min-h-[120px]">
                    {irrigationsList.length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-default-200 rounded-3xl text-center text-default-400 text-sm font-medium">
                            Timeline is empty. Configure a stage below to begin.
                        </div>
                    ) : (
                        irrigationsList.map((irr, idx) => (
                            <Card key={idx} shadow="none" className="border border-default-200 bg-white dark:bg-default-50">
                                <CardBody className="flex flex-row items-center justify-between p-5">
                                    <div className="flex items-center gap-8">
                                        {/* Time Block */}
                                        <div className="flex flex-col items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Start Time</span>
                                            <span className="text-2xl font-mono font-black text-blue-700">
                                                {irr.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Logic Block */}
                                        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                                            {/* Water Flow Section */}
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Water Flow</span>
                                                    <Chip size="sm" color="primary" variant="flat" className="font-bold h-4 text-[9px]">PUMP {irr.water_pump}</Chip>
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-default-500 uppercase">
                                                    <span className="flex items-center gap-1.5" title="Priming Lead Time">
                                                        <Zap size={13} className="text-blue-400" /> {irr.warmup_pump}s
                                                    </span>
                                                    <ArrowRight size={10} className="text-default-300" />
                                                    <span className="flex items-center gap-1.5">
                                                        <Waves size={13} className="text-blue-600" /> {irr.routing_time}s
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Compressor Purge Section */}
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-tighter">Compressor Purge</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-default-500 uppercase">
                                                    <span className="flex items-center gap-1.5" title="Compressor Lead Time">
                                                        <Zap size={13} className="text-sky-400" /> {irr.warmup_compressor}s
                                                    </span>
                                                    <ArrowRight size={10} className="text-default-300" />
                                                    <span className="flex items-center gap-1.5">
                                                        <Wind size={13} className="text-sky-600" /> {irr.compressing_time}s
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Block */}
                                    <Button
                                        isIconOnly variant="flat" color="danger" size="md" radius="full"
                                        onPress={() => irrigationsSetter((p) => p.filter((_, i) => i !== idx))}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <Card className="bg-default-100/50 border border-default-200 shadow-none overflow-visible">
                <CardBody className="p-6 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-wider">
                            <Plus size={18} /> Configure New Stage Configuration
                        </div>
                        <Chip variant="dot" color="primary" size="sm" className="font-bold border-none text-[10px]">SEQUENCE BUILDER</Chip>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Section 1: Hardware & Start */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-default-400 uppercase tracking-widest border-l-2 border-primary pl-2">
                                Stage Parameter
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <TimeInput
                                    label="Execution Time"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    defaultValue={parseAbsoluteToLocal(time.toISOString())}
                                    onChange={(e) => setTime(e!.toDate())}
                                />
                                <Select
                                    label="Source Pump"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    defaultSelectedKeys={["1"]}
                                    onSelectionChange={(k) => setWaterPump(Number(Array.from(k)[0]))}
                                >
                                    <SelectItem key="1" value="1">PUMP UNIT 1</SelectItem>
                                    <SelectItem key="2" value="2">PUMP UNIT 2</SelectItem>
                                    <SelectItem key="3" value="3">PUMP UNIT 3</SelectItem>
                                    <SelectItem key="4" value="4">PUMP UNIT 4</SelectItem>
                                </Select>
                            </div>
                        </div>

                        {/* Section 2: Water Phase */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest border-l-2 border-blue-500 pl-2">
                                Water Flow
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Pump Warmup"
                                    endContent={<span className="text-tiny text-default-400">sec</span>}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={warmupPump}
                                    onValueChange={setWarmupPump}
                                />
                                <Input
                                    label="Run Duration"
                                    endContent={<span className="text-tiny text-default-400">sec</span>}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={routingTime}
                                    onValueChange={setRoutingTime}
                                />
                            </div>
                        </div>

                        {/* Section 3: Air Phase */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-sky-500 uppercase tracking-widest border-l-2 border-sky-500 pl-2">
                                Compression phase (Purge)
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Comp. Warmup"
                                    endContent={<span className="text-tiny text-default-400">sec</span>}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={warmupComp}
                                    onValueChange={setWarmupComp}
                                />
                                <Input
                                    label="Purge Duration"
                                    endContent={<span className="text-tiny text-default-400">sec</span>}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={compTimer}
                                    onValueChange={setCompTimer}
                                />
                            </div>
                        </div>

                        <div className="flex items-end pt-5">
                            <Button
                                color="primary"
                                className="w-full h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                onPress={addEvent}
                                startContent={<Plus size={22} />}
                            >
                                Append
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}