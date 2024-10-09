import React, { useState } from "react";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input } from "@nextui-org/react";
import { MqttClient } from "mqtt/*";
export default function Dosing({ hubEvent, mqttClient }: { hubEvent: string, mqttClient: MqttClient }) {
    const [doseValue, setDoseValue] = useState(0);
    const [doserValue, setDoserValue] = useState("");

    return (
        <div className="flex flex-col" >
            <Input
                id="outlined-number"
                label="Dose (mL)"
                type="number"
                value={doseValue.toString()}
                onChange={(event) => {
                    const value = event.target.value;
                    setDoseValue(parseInt(value));
                }}
            />
            <Select
                labelId="demo-simple-select-filled-label"
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
            <Button
                color="default"
                disabled={hubEvent == "processing"}
                onClick={() => {
                    if (doseValue > 0) {
                        mqttClient.publish(
                            "hub",
                            JSON.stringify({ command: "DOSE", arg1: doserValue, arg2: doseValue, arg3: "" })
                        );
                        setDoseValue(0);
                    }
                }}
            >
                Add
            </Button>
            <Button
                color="default"
                disabled={hubEvent != "processing"}
                onClick={() => {
                    mqttClient.publish(
                        "hub",
                        JSON.stringify({ command: "STOP", arg1: "", arg2: "", arg3: "" })
                    );
                }}
            >
                Stop adding
            </Button>
        </div>
    );
}
