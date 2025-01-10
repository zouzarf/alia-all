import React, { useState } from "react";
import { general_config } from '@prisma/client'
import { Input, Switch } from "@nextui-org/react";
import { generalConfig } from "@/lib/configActions";

export default function GeneralConfig({ config }: { config: general_config[] }) {

  const configLines = config.map(line => (
    <GeneralConfigLine
      key={line.name}
      config={line}
    />
  ));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">

        {configLines}
      </div>
    </div>
  );
}
export function GeneralConfigLine({ config }: { config: general_config }) {
  const name = config.name
  const [value, setValue] = useState(config.value)
  const end: Record<string, any> = { "RESERVOIR_OFFSET_LITTERS": "Liters", "DOSING_TIME": "Seconds", "RESERVOIR_MAX_VALUE": "Liters", "RESERVOIR_CONVERSION_TO_LITTER": "Volts/Liter" }
  if (name == "SCHEDULER") {
    return (
      <div className="flex flex-col"><p>Scheduler enabled</p><Switch isSelected={value == "true"} aria-label="Automatic updates" onClick={() => { setValue(value => { const newValue = value == "true" ? "false" : "true"; generalConfig({ name: name, value: newValue }); return (newValue) }); }} /></div>
    )
  }
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