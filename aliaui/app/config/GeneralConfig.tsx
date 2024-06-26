import React, { useState } from "react";
import BaseStationComponentConfig from "./basestationconfigLine";
import { base_station_ports, general_config } from '@prisma/client'
import Table from "react-bootstrap/Table";
import GeneralConfigLine from "./GeneralConfigLine";

export default function GeneralConfig({ config }: { config: general_config[] }) {

  const j = config.map(line => (
    <GeneralConfigLine
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
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{j}</tbody>
      </Table>
    </div>
  );
}
