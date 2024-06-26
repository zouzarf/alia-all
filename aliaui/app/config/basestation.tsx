import React, { useState } from "react";
import BaseStationComponentConfig from "./basestationconfigLine";
import { base_station_ports } from '@prisma/client'
import Table from "react-bootstrap/Table";

export default function BaseStationConfig({ config }: { config: base_station_ports[] }) {

  const baseStationData = config;

  const j = baseStationData.map(line => (
    <BaseStationComponentConfig
      config={line}
    />
  ));

  return (
    <div
      style={{
        border: "2px solid red",
        background: "#FF6F61",
      }}
    >
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Component Name</th>
            <th>SBC port</th>
            <th>Relay Port</th>
          </tr>
        </thead>
        <tbody>{j}</tbody>
      </Table>
    </div>
  );
}
