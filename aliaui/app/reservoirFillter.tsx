import React, { useState } from "react";
import config from "./config.json";
import { Button, Input } from "@nextui-org/react";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function ReservoirFiller({ masterEvent, current_value }: { masterEvent: string, current_value: number }) {
    const WATER_LEVEL_MAX_LITERS = config.WATER_LEVEL_MAX_LITERS;
    const [waterValue, setWaterValue] = useState(10);
    const { data, error } = useSWR("/api/config", fetcher);
    const client = mqttConnecter(data)

    return (
        <div className="flex flex-col">
            <Input
                id="standard-basic"
                label="Load water (L)"
                type="number"
                value={waterValue.toString()}
                onChange={(event) => {
                    const value = parseInt(event.target.value);
                    if (value <= WATER_LEVEL_MAX_LITERS) {
                        setWaterValue(value);
                    }
                }}
            />
            <Button
                color="default"
                disabled={masterEvent !== "IDLE"}
                onClick={() => {
                    if (
                        waterValue > 0 &&
                        waterValue <= WATER_LEVEL_MAX_LITERS &&
                        waterValue > current_value
                    ) {
                        client?.publish(
                            "master_command",
                            JSON.stringify({ command: "FILL", value: waterValue })
                        );
                        setWaterValue(0);
                    }
                }}
            >
                LOAD
            </Button>
            <Button
                color="default"
                disabled={masterEvent !== "FILL"}
                onClick={() => {
                    client?.publish(
                        "master_command",
                        JSON.stringify({ command: "STOP_FILL", value: "0" })
                    );
                }}
            >
                STOP
            </Button>
        </div>
    );
}
