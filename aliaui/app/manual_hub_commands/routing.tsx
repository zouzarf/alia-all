import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input } from "@nextui-org/react";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
import { zones } from "@prisma/client";
import { MqttClient } from "mqtt/*";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function Routing({ zones, hubEvent, mqttClient }: { zones: zones[], hubEvent: string, mqttClient: MqttClient }) {
    const listOfZones = zones.map((e) => (
        <MenuItem key={e.name} value={e.name}>
            {e.name}
        </MenuItem>
    ));
    const [zoneValue, setzoneValue] = useState("");
    const [routingTime, setRoutingTime] = useState(1);
    const [compressingTime, setComressingTime] = useState(1);

    return (
        <tr className="bg-white dark:bg-gray-800">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ROUTE
            </th>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex flex-row">
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
                        label="Routing time (min)"
                        type="number"
                        className="w-full"
                        value={routingTime.toString()}
                        onChange={(event) => {
                            const value = event.target.value;
                            setRoutingTime(parseInt(value));
                        }}
                    />

                    <Input
                        id="outlined-number"
                        label="Compression time (min)"
                        type="number"
                        className="w-full"
                        value={compressingTime.toString()}
                        onChange={(event) => {
                            const value = event.target.value;
                            setComressingTime(parseInt(value));
                        }}
                    />
                </div>
            </th>
            <td className="px-6 py-4">
                <Button
                    className="w-full"
                    color={hubEvent == "processing" ? "default" : "primary"}
                    disabled={hubEvent == "processing"}
                    onClick={() => {
                        mqttClient.publish(
                            "hub",
                            JSON.stringify({ command: "ROUTE", arg1: zoneValue, arg2: routingTime, arg3: compressingTime })
                        );
                        setzoneValue("");
                    }}
                >
                    START
                </Button>
            </td>
            <td className="px-6 py-4">
                <Button
                    className="w-full"
                    color={hubEvent != "processing" ? "default" : "primary"}
                    disabled={hubEvent != "processing"}
                    onClick={() => {
                        mqttClient.publish(
                            "hub",
                            JSON.stringify({ command: "STOP", arg1: "", arg2: "", arg3: "" })
                        );
                    }}
                >
                    STOP
                </Button>
            </td>
        </tr>
    );
}
