import React, { useState } from "react";
import { zones } from '@prisma/client'
import Table from "react-bootstrap/Table";
import ZoneLineConfig from "./ZoneLine";
import AddZoneConfig from "./AddZoneConfig";
export default function ZonesConfig({ config }: { config: zones[] }) {


  const j = config.map(z => <ZoneLineConfig
    zoneName={z.name}
  />);

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
            <th>Zone Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{j}
          <AddZoneConfig
          />

        </tbody>
      </Table>
    </div>
  );
}
