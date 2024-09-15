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
import { jobs_actions, zones } from '@prisma/client'
import { Input, Select, SelectItem, TimeInput, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider } from "@nextui-org/react";
import { RangeCalendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import type { RangeValue } from "@react-types/shared";
import { today, getLocalTimeZone } from "@internationalized/date";
import client from "@/app/mqtt_c";


export default function NewJob({ zones }: { zones: zones[] }) {
    const zones_elements = zones.map(z => <SelectItem key={z.name}>
        {z.name}
    </SelectItem>)
    const [zone, setZone] = useState("");
    const [scheduleName, setScheduleName] = useState("");
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [dailyActions, setDailyActions] = useState<jobs_actions[]>([]);

    const [time, setTime] = useState(0);
    const [waterLevel, setWaterLevel] = useState(0);
    const [doseNumber, setDoseNumber] = useState(0);
    const [doseAmount, setDoseAmount] = useState(0);
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
            key: "dose_amount",
            label: "Dose Amount",
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
    const renderCell = React.useCallback((ds: jobs_actions, columnKey: Key) => {

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
            case "dose_amount":
                return (
                    ds.dose_amount
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
            <h1 className="text-center">New Job</h1>

            <div className="flex flex-row">
                <Input type="text" label="Job Name"
                    labelPlacement="outside" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} />
                <Select
                    placeholder="Select a zone"
                    selectionMode="single"
                    className="w-full"
                    selectedKeys={[zone]}
                    onChange={(e) => setZone(e.target.value)}
                >
                    {zones_elements}

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
                <Input type="number" id="outlined-basic" label="Hour" min={0} max={23} value={time.toString()} onChange={(e) => { setTime(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Amount of water (L)" min={0} value={waterLevel.toString()} onChange={(e) => { setWaterLevel(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Dose number" min={0} value={doseNumber.toString()} onChange={(e) => { setDoseNumber(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Dose amount" min={0} value={doseAmount.toString()} onChange={(e) => { setDoseAmount(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Mixing timer(minutes)" min={0} value={mixingTime.toString()} onChange={(e) => { setMixingTime(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Routing timer(minutes)" min={0} value={routingTime.toString()} onChange={(e) => { setRoutingTime(parseInt(e.target.value)) }} />
                <Input type="number" id="outlined-basic" label="Compressor timer(minutes)" min={0} value={compressingTime.toString()} onChange={(e) => { setCompressingTime(parseInt(e.target.value)) }} />
                <Button className="" color="success" onClick={
                    () => {
                        setDailyActions(oldArray => [...oldArray, {
                            id: 0,
                            job_id: 0,
                            hour: time,
                            water_level: waterLevel,
                            dose_number: doseNumber,
                            dose_amount: doseAmount,
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
                        zone_name: zone,
                        start_date: selectionRange.startDate,
                        end_date: selectionRange.endDate
                    },
                    dailyActions
                );

                client.publish(
                    "hub",
                    JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
                );
            }}>
                Submit
            </Button>
        </div>
    )
}