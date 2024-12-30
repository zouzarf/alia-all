import React, { useState } from "react";
import config from "./config.json";
import { Button, Input } from "@nextui-org/react";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
import { MqttClient } from "mqtt/*";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function ReservoirFiller({ hubEvent, current_value, mqttClient, maxLevel }: { hubEvent: string, current_value: number, mqttClient: MqttClient, maxLevel: number }) {
    const WATER_LEVEL_MAX_LITERS = maxLevel;
    const [waterValue, setWaterValue] = useState(10);

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                LOAD WATER
            </th>
            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
            </td>
            <td className="px-6 py-4">
                <Button
                    className="w-full"
                    color={hubEvent == "processing" ? "default" : "primary"}
                    disabled={hubEvent == "processing"}
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
