import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { MqttClient } from "mqtt/*";
export default function Mixer({ hubEvent, mqttClient }: { hubEvent: string, mqttClient: MqttClient }) {
    const [mixValue, setMixValue] = useState(1);

    return (
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

            <Button
                disabled={hubEvent == "processing"}
                onClick={() => {
                    if (mixValue > 0) {
                        mqttClient.publish(
                            "hub",
                            JSON.stringify({ command: "MIX", arg1: mixValue, arg2: "", arg3: "" })
                        );
                        setMixValue(0);
                    }
                }}
            >
                Mix
            </Button>
            <Button
                disabled={hubEvent != "processing"}
                onClick={() => {
                    mqttClient.publish(
                        "hub",
                        JSON.stringify({ command: "STOP", arg1: "", arg2: "", arg3: "" })
                    );
                }}
            >
                Stop mixing
            </Button>
        </div>
    );
}
