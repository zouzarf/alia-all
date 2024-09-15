import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input } from "@nextui-org/react";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function Routing({ zones, masterEvent }: { zones: string[], masterEvent: string }) {
    const listOfZones = zones.map((e) => (
        <MenuItem key={e} value={e}>
            {e}
        </MenuItem>
    ));
    const [zoneValue, setzoneValue] = useState("");
    const [routingTime, setRoutingTime] = useState(1);
    const [compressingTime, setComressingTime] = useState(1);
    const { data, error } = useSWR("/api/config", fetcher);
    const client = mqttConnecter(data)

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
                disabled={masterEvent === "ROUTING" || masterEvent !== "IDLE"}
                onClick={() => {
                    client?.publish(
                        "master_command",
                        JSON.stringify({
                            command: "ROUTE",
                            value:
                                zoneValue +
                                "/" +
                                routingTime.toString() +
                                "/" +
                                compressingTime.toString(),
                        })
                    );
                    setzoneValue("");
                }}
            >
                Start Routing
            </Button>
            <Button
                disabled={masterEvent !== "ROUTING"}
                onClick={() => {
                    client?.publish(
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
