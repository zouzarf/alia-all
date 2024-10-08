import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input } from "@nextui-org/react";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
import { zones } from "@prisma/client";
import { MqttClient } from "mqtt/*";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function Routing({ zones, masterEvent, mqttClient }: { zones: zones[], masterEvent: string, mqttClient: MqttClient }) {
    const listOfZones = zones.map((e) => (
        <MenuItem key={e.name} value={e.name}>
            {e.name}
        </MenuItem>
    ));
    const [zoneValue, setzoneValue] = useState("");
    const [routingTime, setRoutingTime] = useState(1);
    const [compressingTime, setComressingTime] = useState(1);

    return (
        <div className="flex flex-col">
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={zoneValue}
                label="Target zone"
                onChange={(event) => {
                    const value = event.target.value;
                    setzoneValue(value);
                }}
            >
                {listOfZones}
            </Select>

            <Input
                id="outlined-number"
                label="Routing time (s)"
                type="number"
                value={routingTime.toString()}
                onChange={(event) => {
                    const value = event.target.value;
                    setRoutingTime(parseInt(value));
                }}
            />

            <Input
                id="outlined-number"
                label="Compression time (s)"
                type="number"
                value={compressingTime.toString()}
                onChange={(event) => {
                    const value = event.target.value;
                    setComressingTime(parseInt(value));
                }}
            />

            <Button
                onClick={() => {
                    mqttClient.publish(
                        "hub",
                        JSON.stringify({ command: "ROUTE", arg1: zoneValue, arg2: routingTime, arg3: compressingTime })
                    );
                    setzoneValue("");
                }}
            >
                Start Routing
            </Button>
            <Button
                disabled={masterEvent !== "ROUTING"}
                onClick={() => {
                    mqttClient.publish(
                        "master_command",
                        JSON.stringify({ command: "STOP_ROUTE", value: "0" })
                    );
                }}
            >
                Stop routing
            </Button>
        </div>
    );
}
