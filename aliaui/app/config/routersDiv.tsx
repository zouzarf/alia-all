import React from "react";
import RouteLineConfig from "./RouteLine";
import AddRouteConfig from "./AddRouteConfig";
import Table from "react-bootstrap/Table";
import Button from '@mui/material/Button';
import { routers } from '@prisma/client'
import { Router } from "next/router";

export default function RouterDivConfig({ router }: { router: routers }) {
  const RouterName = router.name;

  const relay_port = router.pump_microprocessor_port;
  const sbc_port = router.pump_hub_port;

  const routerheader = (
    <tr>
      <td colSpan={4}>
        <h3>{RouterName} </h3>
        <Button variant="contained" color="error">
          DELETE
        </Button>
      </td>
    </tr>
  );
  const routerPump = (
    <tr>
      <td>Pump</td>
      <td>
        <input
          type="number"
          min="0"
          max="5"
          name="sbc"
          value={sbc_port!}
        />{" "}
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="3"
          name="relay"
          value={relay_port!}
          size={10}
        />
      </td>
      <td></td>
    </tr>
  );

  return (
    <div
      style={{
        border: "2px solid green",
      }}
    >
      <Table striped bordered hover>
        <thead>
          {routerheader}
          <tr>
            <th>Name</th>
            <th>SBC port</th>
            <th>Relay port</th>
            <th>Connected to base station</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routerPump}
          <AddRouteConfig
            routerName={RouterName}
          />
        </tbody>
      </Table>
    </div>
  );
}
