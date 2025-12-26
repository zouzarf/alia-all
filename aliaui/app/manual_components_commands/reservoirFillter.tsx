import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
export default function ReservoirFiller({ hubEvent, current_value, maxLevel }: { hubEvent: string, current_value: number, maxLevel: number }) {
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
                color={hubEvent == "processing" ? "default" : "primary"}
                disabled={hubEvent == "processing"}
                onClick={() => {
                    if (
                        waterValue > 0 &&
                        waterValue <= WATER_LEVEL_MAX_LITERS &&
                        waterValue > current_value
                    ) {
                        setWaterValue(0);
                    }
                }}
            >
                LOAD
            </Button>
            <Button
                color={hubEvent != "processing" ? "default" : "primary"}
                disabled={hubEvent != "processing"}
            >
                STOP
            </Button>
        </div>
    );
}
