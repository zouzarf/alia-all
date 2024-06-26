"use client"
import { updateBaseStation } from "@/lib/configActions";
import { base_station_ports } from "@prisma/client";
import React, { useState } from "react";

export default function bsConfigLine({ config }: { config: base_station_ports }) {
  const name = config.name
  const [micro_port, setMicroPort] = useState(config.microprocessor_port)
  const [hub_port, setHubPort] = useState(config.hub_port)

  return (
    <tr>
      <td>{name}</td>
      <td>
        <input
          type="number"
          min="0"
          max="5"
          id={name}
          name="sbc"
          required
          minLength={0}
          maxLength={10}
          value={micro_port!}
          size={10}
          onChange={(e) => {
            console.log(e)
            setMicroPort(parseInt(e.target.value));
            updateBaseStation({ name: name, microprocessor_port: parseInt(e.target.value), hub_port: hub_port })
          }}
        ></input>
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="3"
          disabled={hub_port == null}
          id={name}
          name="relay"
          required
          minLength={0}
          maxLength={10}
          value={hub_port!}
          onChange={(e) => {
            setHubPort(parseInt(e.target.value));
            updateBaseStation({ name: name, microprocessor_port: micro_port, hub_port: parseInt(e.target.value) })
          }}
          size={10}
        ></input>
      </td>
    </tr>
  );
}
