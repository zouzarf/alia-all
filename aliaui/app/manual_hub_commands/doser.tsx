import React, { useState } from "react";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input } from "@nextui-org/react";
import { MqttClient } from "mqtt/*";
import { sendHubCommand } from "./command";
export default function Dosing({ hubEvent, mqttClient }: { hubEvent: string, mqttClient: MqttClient }) {
    const [doseValue, setDoseValue] = useState(0);
    const [doserValue, setDoserValue] = useState("");

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                DOSE
            </th>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex flex-row">
                    <Select
                        labelId="demo-simple-select-filled-label"
                        className="w-full"
                        id="demo-simple-select-filled"
                        value={doserValue}
                        label="Doser"
                        onChange={(event) => {
                            const value = event.target.value;
                            setDoserValue(value);
                        }}
                    >
                        <MenuItem key="1" value="1">
                            DOSE 1
                        </MenuItem>
                        <MenuItem key="2" value="2">
                            DOSE 2
                        </MenuItem>
                        <MenuItem key="3" value="3">
                            DOSE 3
                        </MenuItem>
                        <MenuItem key="4" value="4">
                            DOSE 4
                        </MenuItem>
                    </Select>
                    <Input
                        id="outlined-number"
                        label="Dose (mL)"
                        type="number"
                        className="w-full"
                        value={doseValue.toString()}
                        onChange={(event) => {
                            const value = event.target.value;
                            setDoseValue(parseInt(value));
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
                        if (doseValue > 0) {
                            sendHubCommand(mqttClient, "hub", { command: "DOSE", arg1: doserValue, arg2: doseValue.toString(), arg3: "" })
                            setDoseValue(0);
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
                    onClick={() => sendHubCommand(mqttClient, "hub", { command: "STOP", arg1: "", arg2: "", arg3: "" })}
                >
                    STOP
                </Button>
            </td>
        </tr>
    );
}
