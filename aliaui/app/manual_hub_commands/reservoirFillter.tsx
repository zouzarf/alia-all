import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
export default function ReservoirFiller({ hubEvent, current_value, maxLevel }: { hubEvent: string, current_value: number, maxLevel: number }) {
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
                    color={(hubEvent == "processing" || waterValue <= current_value) ? "default" : "primary"}
                    disabled={(hubEvent == "processing" || waterValue <= current_value)}
                >
                    START
                </Button>
            </td>
            <td className="px-6 py-4">
                <Button
                    className="w-full"
                    color={hubEvent != "processing" ? "default" : "primary"}
                    disabled={hubEvent != "processing"}
                >
                    STOP
                </Button>
            </td>
        </tr>
    );
}
