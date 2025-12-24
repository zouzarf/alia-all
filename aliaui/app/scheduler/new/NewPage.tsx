"use client"
import React, { useState } from "react";
import { insertScheduler } from "@/lib/schedulerActions";
import { zones } from '@prisma/client'
import { Input, Select, SelectItem, TimeInput, Button, DatePicker, CheckboxGroup, Checkbox, RadioGroup, Radio } from "@nextui-org/react";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
import { parseAbsoluteToLocal } from "@internationalized/date";

interface irrigationPlan {
    name: string
    zones: string[]
    startDate: string
    endDate: string
}
interface irrigation {
    time: Date
    water_pump: number
    routing_time: number
    warmup_pump: number
    warmup_compressor: number
    compressing_time: number
}

interface irrigationEventDriven {
    humidityLevel: number
    water_pump: number
    routing_time: number
    compressing_time: number
}

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function NewJob({ zones }: { zones: zones[] }) {
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [scheduleName, setScheduleName] = useState("");

    const [startingDate, setStartingDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const [loading, setLoading] = useState(false);
    const [irrigationsTimeDriven, setIrrigationsTimeDriven] = useState<irrigation[]>([])
    const [irrigationsEventDriven, setIrrigationsEventDriven] = useState<irrigationEventDriven[]>([])
    const { data, error } = useSWR("/api/config", fetcher);
    const client = mqttConnecter(data)
    const [irrigationType, setIrrigationType] = useState("time-driven")

    return (
        <div className="relative">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="text-white text-2xl">Loading...</div>
                </div>
            )}

            <div className="flex flex-col gap-7 py-10">
                <h1 className="text-center text-3xl">Add a new irrigation</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Name
                            </th>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <Input type="text" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} />
                            </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Start Date
                            </th>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <DatePicker
                                    key={"start-date"}
                                    className="max-w-[284px]"
                                    labelPlacement={"inside"}
                                    onChange={(e) => setStartingDate(`${e.year}-${e.month.toString().padStart(2, "0")}-${e.day.toString().padStart(2, "0")}`)}
                                />
                            </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                End Date
                            </th>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <DatePicker
                                    key={"end-date"}
                                    className="max-w-[284px]"
                                    labelPlacement={"inside"}
                                    onChange={(e) => setEndDate(`${e.year}-${e.month.toString().padStart(2, "0")}-${e.day.toString().padStart(2, "0")}`)}
                                />
                            </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Zones
                            </th>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <CheckboxGroup value={selectedZones} onValueChange={setSelectedZones}>
                                    {zones.map(z =>
                                        <Checkbox key={z.name} value={z.name}>
                                            {z.name}
                                        </Checkbox>
                                    )}
                                </CheckboxGroup>
                            </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Irrigation mode
                            </th>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <RadioGroup value={irrigationType} onValueChange={setIrrigationType}>
                                    <Radio value="time-driven">Time driven</Radio>
                                    <Radio value="event-driven" isDisabled={true}>Event driven</Radio>
                                </RadioGroup>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h1 className="text-center text-3xl">Time driven irrigation</h1>
                {irrigationType == "time-driven" ? <TimeDrivenIrrigationTable irrigationsList={irrigationsTimeDriven} irrigationsSetter={setIrrigationsTimeDriven} /> : <EventDrivenIrrigationTable irrigationsList={irrigationsEventDriven} irrigationsSetter={setIrrigationsEventDriven} />}
                <Button className="w-full" color="success" onClick={() => {
                    setLoading(true);
                    insertScheduler(
                        {
                            name: scheduleName,
                            zones: selectedZones,
                            startDate: startingDate,
                            endDate: endDate
                        },
                        irrigationsTimeDriven
                    );
                }}>
                    Submit
                </Button>
            </div>
        </div>
    )
}

function TimeDrivenIrrigationTable(
    { irrigationsList, irrigationsSetter }: { irrigationsList: irrigation[], irrigationsSetter: React.Dispatch<React.SetStateAction<irrigation[]>> }) {
    const [time, setTime] = useState<Date>(new Date());
    const [waterPump, setWaterPump] = useState(1);
    const [compressingTime, setCompressingTime] = useState("0");
    const [warmupTimePump, setWarmupTimePump] = useState("0");
    const [warmUpCompressor, setWarmUpCompressor] = useState("0");
    const [pumpingTimer, setPumpingTimer] = useState("0");
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3 w-1/20">
                        Time
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Water pump
                    </th>

                    <th scope="col" className="px-6 py-3 w-1/10">
                        Warmup time pump
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Pump timer
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Warmup time compressor
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Compressor timer
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {irrigationsList.map(irrigation => {
                    return (<tr key={irrigation.time.toISOString()} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {irrigation.time.getHours().toString().padStart(2, "0")}:{irrigation.time.getMinutes().toString().padStart(2, "0")} +{-1 * irrigation.time.getTimezoneOffset() / 60}
                        </th>
                        <td scope="row" className="px-6 py-4">
                            <span className="text-default-400 text-small">{irrigation.water_pump}</span>
                        </td>
                        <td scope="row" className="px-6 py-4">
                            <span className="text-default-400 text-small">{irrigation.warmup_pump} (sec)</span>
                        </td>
                        <td scope="row" className="px-6 py-4">
                            <span className="text-default-400 text-small">{irrigation.routing_time} (sec)</span>
                        </td>
                        <td scope="row" className="px-6 py-4">
                            <span className="text-default-400 text-small">{irrigation.warmup_compressor} (sec)</span>
                        </td>
                        <td scope="row" className="px-6 py-4">
                            <span className="text-default-400 text-small">{irrigation.compressing_time} (sec)</span>
                        </td>
                        <td scope="row" className="px-6 py-4">
                            <Button className="" color="danger" onPress={e => { irrigationsSetter((prevItems) => prevItems.filter((item) => item.time !== irrigation.time)); }} >
                                Drop
                            </Button>
                        </td>
                    </tr>)
                })}
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <TimeInput
                            defaultValue={parseAbsoluteToLocal(time.toISOString())}
                            labelPlacement="outside"
                            granularity="minute"
                            hourCycle={24}
                            onChange={(e) => { setTime(e.toDate()) }}
                        />
                    </th>
                    <td scope="row" className="px-6 py-4">
                        <div>
                            <Select
                                id="demo-simple-select-filled"
                                value={waterPump}
                                label="Target pump"
                                className="w-full"
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setWaterPump(parseInt(value));
                                }}
                            >
                                <SelectItem key={1} value={1}>
                                    WATERPUMP 1
                                </SelectItem>
                                <SelectItem key={2} value={2}>
                                    WATERPUMP 2
                                </SelectItem>
                                <SelectItem key={3} value={3}>
                                    WATERPUMP 3
                                </SelectItem>
                                <SelectItem key={4} value={4}>
                                    WATERPUMP 4
                                </SelectItem>
                            </Select>
                        </div>
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Input type="text" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">(sec)</span>
                            </div>
                        } min={0} value={warmupTimePump.toString()} onValueChange={(e) => { setWarmupTimePump((e)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Input type="text" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">(sec)</span>
                            </div>
                        } min={0} value={pumpingTimer.toString()} onValueChange={(e) => { setPumpingTimer((e)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Input type="text" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">(sec)</span>
                            </div>
                        } min={0} value={warmUpCompressor.toString()} onValueChange={(e) => { setWarmUpCompressor((e)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Input type="text" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">(sec)</span>
                            </div>
                        } min={0} value={compressingTime.toString()} onValueChange={(e) => { setCompressingTime((e)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Button className="" color="success" onClick={
                            () => {
                                irrigationsSetter(oldArray => [...oldArray, {
                                    time: time,
                                    water_pump: waterPump,
                                    routing_time: parseFloat(pumpingTimer),
                                    warmup_pump: parseFloat(warmupTimePump),
                                    warmup_compressor: parseFloat(warmUpCompressor),
                                    compressing_time: parseFloat(compressingTime)
                                }])
                            }
                        }>
                            Add
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

function EventDrivenIrrigationTable(
    { irrigationsList, irrigationsSetter }: { irrigationsList: irrigationEventDriven[], irrigationsSetter: React.Dispatch<React.SetStateAction<irrigationEventDriven[]>> }) {
    const [dose1, setDose1] = useState(0);
    const [dose2, setDose2] = useState(0);
    const [dose3, setDose3] = useState(0);
    const [dose4, setDose4] = useState(0);
    const [time, setTime] = useState<Date>(new Date());
    const [waterLevel, setWaterLevel] = useState(0);
    const [mixingTime, setMixingTime] = useState(0);
    const [compressingTime, setCompressingTime] = useState(0);
    const [routingTime, setRoutingTime] = useState(0);
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3 w-1/20">
                        Sensor min value
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Water amount
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/6">
                        Dosing
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Mixing time
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Routing time
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Routing time
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Routing time
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Compressing time
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/10">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                    </th>
                    <td scope="row" className="px-6 py-4">
                        <Input type="number" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small"></span>
                            </div>
                        } min={0} value={waterLevel.toString()} onChange={(e) => { setWaterLevel(parseInt(e.target.value)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4 w-300">
                        <div className="flex flex-col">
                            <Input type="number" id="outlined-basic"
                                defaultValue="1"
                                label="Dose1"
                                className="w-300"
                                min={0} value={dose1.toString()}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">ml</span>
                                    </div>
                                }
                                onChange={(e) => { setDose1(parseInt(e.target.value)) }}
                            />
                            <Input type="number" id="outlined-basic"
                                defaultValue="0"
                                label="Dose2"
                                min={0} value={dose2.toString()}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">ml</span>
                                    </div>
                                }
                                onChange={(e) => { setDose2(parseInt(e.target.value)) }}
                            />
                            <Input type="number" id="outlined-basic"
                                defaultValue="1"
                                label="Dose3"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">ml</span>
                                    </div>
                                }
                                min={0} value={dose3.toString()}
                                onChange={(e) => { setDose3(parseInt(e.target.value)) }}
                            />
                            <Input type="number" id="outlined-basic"
                                defaultValue="1"
                                label="Dose4"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">ml</span>
                                    </div>
                                }
                                min={0} value={dose4.toString()}
                                onChange={(e) => { setDose4(parseInt(e.target.value)) }}
                            /></div>


                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Input type="number" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">(sec)</span>
                            </div>
                        } min={0} value={mixingTime.toString()} onChange={(e) => { setMixingTime(parseInt(e.target.value)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Input type="number" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">(sec)</span>
                            </div>
                        } min={0} value={routingTime.toString()} onChange={(e) => { setRoutingTime(parseInt(e.target.value)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Input type="number" id="outlined-basic" endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">(sec)</span>
                            </div>
                        } min={0} value={compressingTime.toString()} onChange={(e) => { setCompressingTime(parseInt(e.target.value)) }} />
                    </td>
                    <td scope="row" className="px-6 py-4">
                        <Button className="" color="success">
                            Add
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}