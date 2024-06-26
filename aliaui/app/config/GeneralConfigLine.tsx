"use client"
import { generalConfig, updateBaseStation } from "@/lib/configActions";
import { general_config } from "@prisma/client";
import React, { useState } from "react";

export default function GeneralConfigLine({ config }: { config: general_config }) {
    const name = config.name
    const [value, setValue] = useState(config.value)

    return (
        <tr>
            <td>{name}</td>
            <td>
                <input
                    type="text"
                    id={name}
                    name="sbc"
                    required
                    minLength={0}
                    maxLength={10}
                    value={value!}
                    size={10}
                    onChange={(e) => {
                        console.log(e)
                        setValue(e.target.value);
                        generalConfig({ name: name, value: e.target.value! })
                    }}
                ></input>
            </td>
        </tr>
    );
}
