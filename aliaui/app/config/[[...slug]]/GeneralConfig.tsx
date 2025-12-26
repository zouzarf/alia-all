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
  const name = config.name;
  const [value, setValue] = useState(config.value);

  // Mapping units for better readability
  const units: Record<string, string> = {
    "RESERVOIR_OFFSET_LITTERS": "Liters",
    "DOSING_TIME": "Seconds",
    "RESERVOIR_MAX_VALUE": "Liters",
    "RESERVOIR_CONVERSION_TO_LITTER": "V/L"
  };

  if (name === "SCHEDULER") {
    return (
      <div className="flex items-center justify-between p-4 bg-default-50 rounded-xl border border-default-200">
        <div>
          <p className="font-bold">System Scheduler</p>
          <p className="text-tiny text-default-400">Enable automatic pump routing</p>
        </div>
        <Switch
          isSelected={value === "true"}
          color="success"
          onChange={() => {
            const newValue = value === "true" ? "false" : "true";
            setValue(newValue);
            generalConfig({ name, value: newValue });
          }}
        />
      </div>
    );
  }

  return (
    <Input
      type="text"
      label={name.replace(/_/g, " ")} // Make label pretty: RESERVOIR_MAX -> RESERVOIR MAX
      value={value!}
      variant="bordered"
      labelPlacement="outside"
      placeholder="0.00"
      endContent={
        <span className="text-default-400 text-tiny border-l pl-2 border-default-200">
          {units[name] || ""}
        </span>
      }
      onChange={(e) => {
        setValue(e.target.value);
        generalConfig({ name, value: e.target.value });
      }}
      className="max-w-xs"
    />
  );
}