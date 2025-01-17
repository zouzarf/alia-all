import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { MqttClient } from "mqtt/*";
import { sendHubCommand } from "./command";


export default function Mixer({ hubEvent, mqttClient }: { hubEvent: string, mqttClient: MqttClient }) {
    const [mixValue, setMixValue] = useState(1);

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                MIX
            </th>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex flex-col">
                    <Input
                        id="standard-basic"
                        label="Mix (min)"
                        type="number"
                        value={mixValue.toString()}
                        onChange={(event) => {
                            const value = event.target.value;
                            setMixValue(parseInt(value));
                        }}
                    />

                </div>
            </th>
            <td className="px-6 py-4">
                <Button
                    className="w-full"
                    color={(hubEvent == "processing" || mixValue <= 0) ? "default" : "primary"}
                    disabled={(hubEvent == "processing" || mixValue <= 0)}
                    onClick={() => {
                        if (mixValue > 0) {
                            sendHubCommand(mqttClient, "hub", { command: "MIX", arg1: mixValue.toString(), arg2: "", arg3: "" })
                            setMixValue(0);
                        }
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
                        sendHubCommand(mqttClient, "hub", { command: "STOP", arg1: "", arg2: "", arg3: "" })
                    }}
                >
                    STOP
                </Button>
            </td>
        </tr>
    );
}
