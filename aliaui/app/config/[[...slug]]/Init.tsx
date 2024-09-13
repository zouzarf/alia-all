import React, { useState } from "react";
import { general_config } from '@prisma/client'
import { Button, Input } from "@nextui-org/react";
import { generalConfig } from "@/lib/configActions";
import { init } from "@/lib/init";

export default function Init() {

  return (
    <div className="flex flex-col gap-4">

      <Button color="danger" onClick={() => { init() }} >Init all database</Button>
    </div>
  );
}
export function GeneralConfigLine({ config }: { config: general_config }) {
  const name = config.name
  const [value, setValue] = useState(config.value)
  const end: Record<string, any> = { "RESERVOIR_OFFSET_LITTERS": "Liters", "ROUTING_TIME": "Seconds", "RESERVOIR_MAX_VALUE": "Liters", "RESERVOIR_CONVERSION_TO_LITTER": "Volts/Liter" }

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