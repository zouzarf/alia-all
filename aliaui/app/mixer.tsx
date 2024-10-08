import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { MqttClient } from "mqtt/*";
export default function Mixer({ masterEvent, mqttClient }: { masterEvent: string, mqttClient: MqttClient }) {
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
                disabled={masterEvent !== "MIX"}
                onClick={() => {
                    mqttClient.publish(
                        "master_command",
                        JSON.stringify({ command: "STOP_MIX", value: "0" })
                    );
                }}
            >
                Stop mixing
            </Button>
        </div>
    );
}
