"use client"
import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input } from "@nextui-org/react";
import { zones } from "@prisma/client";
import { routeWater } from "./command";

export default function Routing({ zones, hubEvent }: { zones: zones[], hubEvent: string }) {
    const listOfZones = zones.map((e) => (
        <MenuItem key={e.name} value={e.name}>
            {e.name}
        </MenuItem>
    ));
    const [zoneValue, setzoneValue] = useState(zones.length > 0 ? zones[0].name : "");
    const [pumpValue, setPumpValue] = useState("1");
    const [pumpingTime, setPumpingTime] = useState("1.0");
    const [warmUpPump, setWarmUpPump] = useState("1");
    const [warmUpCompressor, setWarmUpCompressor] = useState("1");
    const [compressingTime, setComressingTime] = useState("1");
    const [wating, setWaiting] = useState(false)
    return (
        <>
            {
                wating && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="text-white text-2xl">Routing ...</div>
                    </div>
                )
            }
            <tr className="bg-white dark:bg-gray-800">

                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ROUTE
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex flex-row">
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={pumpValue}
                            label="Target pump"
                            className="w-full"
                            onChange={(event) => {
                                const value = event.target.value;
                                setPumpValue(value);
                            }}
                        >
                            <MenuItem key={"1"} value={"1"}>
                                WATERPUMP 1
                            </MenuItem>
                            <MenuItem key={"2"} value={"2"}>
                                WATERPUMP 2
                            </MenuItem>
                            <MenuItem key={"3"} value={"3"}>
                                WATERPUMP 3
                            </MenuItem>
                            <MenuItem key={"4"} value={"4"}>
                                WATERPUMP 4
                            </MenuItem>
                        </Select>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={zoneValue}
                            label="Target zone"
                            className="w-full"
                            onChange={(event) => {
                                const value = event.target.value;
                                setzoneValue(value);
                            }}
                        >
                            {listOfZones}
                        </Select>
                        <Input
                            id="outlined-number"
                            label="Warm Up Time (sec)"
                            className="w-full"
                            value={warmUpPump.toString()}
                            onValueChange={(value) => {
                                setWarmUpPump((value));
                            }}
                        />
                        <Input
                            id="outlined-number"
                            label="Pumping time (sec)"
                            step="any"
                            className="w-full"
                            value={pumpingTime}
                            onValueChange={(value) => {
                                setPumpingTime(value);
                            }}
                        />
                        <Input
                            id="outlined-number"
                            label="WarmUp Compressor time (sec)"
                            className="w-full"
                            value={warmUpCompressor}
                            onValueChange={(value) => {
                                setWarmUpCompressor(value);
                            }}
                        />

                        <Input
                            id="outlined-number"
                            label="Compression time (sec)"
                            className="w-full"
                            value={compressingTime.toString()}
                            onValueChange={(value) => {
                                setComressingTime(value);
                            }}
                        />
                    </div>
                </th>
                <td className="px-6 py-4">
                    <Button
                        className="w-full"
                        color={(wating == true || zoneValue == "" || parseFloat(compressingTime) <= 0) ? "default" : "primary"}
                        disabled={wating == true || zoneValue == "" || parseFloat(compressingTime) <= 0}
                        onClick={async () => {
                            setWaiting(true)
                            const data = await routeWater(
                                pumpValue,
                                warmUpPump.toString(),
                                pumpingTime.toString(),
                                warmUpCompressor.toString(),
                                compressingTime.toString(),
                                zoneValue
                            );
                            setWaiting(false)
                            console.log(data);
                        }}
                    >
                        START
                    </Button>
                </td>
            </tr>
        </>
    );
}
