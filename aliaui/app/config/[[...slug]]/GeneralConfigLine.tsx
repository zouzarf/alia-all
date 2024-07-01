"use client"
import { generalConfig, updateBaseStation } from "@/lib/configActions";
import { general_config } from "@prisma/client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";

export default function GeneralConfigLine({ config }: { config: general_config }) {
    const name = config.name
    const [value, setValue] = useState(config.value)
    const end = { "RESERVOIR_OFFSET_LITTERS": "Liters", "ROUTING_TIME": "Seconds", "RESERVOIR_MAX_VALUE": "Liters", "RESERVOIR_CONVERSION_TO_LITTER": "Volts/Liter" }

    return (

        <Input
            type="text"
            label={name}
            value={value!}
            labelPlacement="outside"
            endContent={
                <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">{end[name] || ""}</span>
                </div>
            }
            onChange={(e) => {
                console.log(e)
                setValue(e.target.value);
                generalConfig({ name: name, value: e.target.value! })
            }}
        />
    );
}
