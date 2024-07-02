"use client"
import React, { Key, useState } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import TimeRange from 'react-time-range';
import TextField from '@mui/material/TextField';
import { insertScheduler } from "@/lib/schedulerActions";
import TimePicker from "react-time-picker";
import { daily_schedule_actions } from '@prisma/client'
import { Input, Select, SelectItem, TimeInput, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider } from "@nextui-org/react";
import { RangeCalendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import type { RangeValue } from "@react-types/shared";
import { today, getLocalTimeZone } from "@internationalized/date";


export default function NewJob() {
    const [zone, setZone] = useState("0");
    const [scheduleName, setScheduleName] = useState("Schedule X");
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [dailyActions, setDailyActions] = useState<daily_schedule_actions[]>([]);

    const [time, setTime] = useState(0);
    const [waterLevel, setWaterLevel] = useState(0);
    const [doseNumber, setDoseNumber] = useState(0);
    const [mixingTime, setMixingTime] = useState(0);
    const [compressingTime, setCompressingTime] = useState(0);
    const [routingTime, setRoutingTime] = useState(0);

    let [value, setValue] = React.useState<RangeValue<DateValue>>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({ weeks: 1 }),
    });

    const columns = [
        {
            key: "hour",
            label: "Hour",
        },
        {
            key: "water_level",
            label: "Amount of water",
        },
        {
            key: "dose_number",
            label: "Dose number",
        },
        {
            key: "mixing_time",
            label: "Mixing timer",
        },

        {
            key: "routing_time",
            label: "Routing Timer",
        },

        {
            key: "Compression timer",
            label: "Action",
        },

        {
            key: "action",
            label: "Action",
        }
    ];
    const renderCell = React.useCallback((ds: daily_schedule_actions, columnKey: Key) => {

        switch (columnKey) {
            case "hour":
                return (
                    ds.hour
                );
            case "water_level":
                return (
                    ds.water_level
                );
            case "dose_number":
                return (
                    ds.dose_number
                );
            case "routing_time":
                return (
                    ds.routing_time
                );
            case "compressing_time":
                return (
                    ds.compressing_time
                );
            case "action":
                return (
                    <Button variant="bordered" color="danger">
                        DELETE
                    </Button>
                );
            default:
                return ds.id;
        }
    }, []);

    return (

        <div className="flex flex-col">
            <h1 className="text-center">New Scheduler</h1>

            <div className="flex flex-row"> <Input type="text" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} /><Select
                placeholder="Select a zone"
                selectionMode="single"
                className="w-full"
            >
                <SelectItem key={0}>
                    Se1e
                </SelectItem>
                <SelectItem key={1}>
                    Se1e3
                </SelectItem>
                <SelectItem key={2}>
                    Se1e4
                </SelectItem>

            </Select></div>


            <Divider className="my-4" />
            <h1 className="text-center pb-8">Date range</h1>
            <p className="text-center">{value.start.toString()}  till {value.end.toString()} </p>
            <RangeCalendar
                aria-label="Date (Controlled)"
                value={value}
                onChange={setValue}
                minValue={today(getLocalTimeZone())}
            />
            <Divider className="my-4" />
            <h1 className="text-center pb-8">Daily plan</h1>

            <Table aria-label="Example table with dynamic content">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={dailyActions}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Divider className="my-4" />


            <div className="flex flex-row items-center">
                <TimeInput granularity="hour" label="Hour" hourCycle={24} /><Input type="number" id="outlined-basic" label="Amount of water (L)" value={waterLevel.toString()} onChange={(e) => { setWaterLevel(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Dose number" value={doseNumber.toString()} onChange={(e) => { setDoseNumber(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Mixing timer(minutes)" value={mixingTime.toString()} onChange={(e) => { setMixingTime(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Routing timer(minutes)" value={routingTime.toString()} onChange={(e) => { setRoutingTime(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Compressor timer(minutes)" value={compressingTime.toString()} onChange={(e) => { setCompressingTime(parseInt(e.target.value)) }} />
                <Button className="" color="success" onClick={
                    () => {
                        setDailyActions(oldArray => [...oldArray, {
                            id: 0,
                            schedule_id: 0,
                            hour: time,
                            water_level: waterLevel,
                            dose_number: doseNumber,
                            mixing_time: mixingTime,
                            routing_time: routingTime,
                            compressing_time: compressingTime
                        }])
                    }
                }>
                    ADD
                </Button>
            </div>
            <Divider className="my-4" />
            <Button color="success" onClick={() => {
                insertScheduler(
                    {
                        id: 0,
                        name: scheduleName,
                        zone_id: parseInt(zone),
                        start_date: selectionRange.startDate,
                        end_date: selectionRange.endDate
                    },
                    dailyActions
                )
            }}>
                Submit
            </Button>
        </div>
    )
}