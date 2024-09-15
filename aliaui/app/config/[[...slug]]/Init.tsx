import React, { useState } from "react";
import { general_config } from '@prisma/client'
import { Button, Input } from "@nextui-org/react";
import { generalConfig } from "@/lib/configActions";
import { init } from "@/lib/init";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function Init() {
  const { data, error } = useSWR("/api/config", fetcher);
  const client = mqttConnecter(data)

  return (
    <div className="flex flex-col gap-4">

      <Button color="danger" onClick={() => {
        init();
        client?.publish(
          "hub",
          JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
        );
      }} >Init all database</Button>
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