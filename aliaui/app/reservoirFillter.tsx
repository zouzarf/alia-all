import React, { useState } from "react";
import config from "./config.json";
import { Button, Input } from "@nextui-org/react";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
import { MqttClient } from "mqtt/*";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function ReservoirFiller({ masterEvent, current_value, mqttClient, maxLevel }: { masterEvent: string, current_value: number, mqttClient: MqttClient, maxLevel: number }) {
    const WATER_LEVEL_MAX_LITERS = maxLevel;
    const [waterValue, setWaterValue] = useState(10);

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
                onClick={() => {
                    console.log(waterValue, current_value)
                    if (
                        waterValue > 0 &&
                        waterValue <= WATER_LEVEL_MAX_LITERS &&
                        waterValue > current_value
                    ) {
                        mqttClient.publish(
                            "hub",
                            JSON.stringify({ command: "FILL_WATER", arg1: waterValue, arg2: "", arg3: "" })
                        );
                        console.log("sending water command")
                        setWaterValue(0);
                    }
                    console.log("sending water command")
                }}
            >
                LOAD
            </Button>
            <Button
                color="default"
                onClick={() => {
                    mqttClient.publish(
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
