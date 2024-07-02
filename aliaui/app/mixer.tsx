import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import client from "./mqtt_c";
import { Button, Input } from "@nextui-org/react";

export default function Mixer({ masterEvent }: { masterEvent: string }) {
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
                disabled={masterEvent !== "IDLE"}
                onClick={() => {
                    if (mixValue > 0) {
                        client.publish(
                            "master_command",
                            JSON.stringify({ command: "MIX", value: mixValue })
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
                    client.publish(
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
