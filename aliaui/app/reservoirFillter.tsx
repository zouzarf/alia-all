import FormControl from "@mui/material/FormControl";
import React, { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import client from "./mqtt_c";
import ScienceIcon from "@mui/icons-material/Science";
import config from "./config.json";
import { Button, Input } from "@nextui-org/react";

export default function ReservoirFiller({ masterEvent, current_value }: { masterEvent: string, current_value: number }) {
    const WATER_LEVEL_MAX_LITERS = config.WATER_LEVEL_MAX_LITERS;
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
                disabled={masterEvent !== "IDLE"}
                onClick={() => {
                    if (
                        waterValue > 0 &&
                        waterValue <= WATER_LEVEL_MAX_LITERS &&
                        waterValue > current_value
                    ) {
                        client.publish(
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
                    client.publish(
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
