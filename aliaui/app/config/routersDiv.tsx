import React from "react";
import RouteLineConfig from "./RouteLine";
import AddRouteConfig from "./AddRouteConfig";
import Table from "react-bootstrap/Table";
import Button from '@mui/material/Button';
import { routers } from '@prisma/client'

export default function RouterDivConfig({ router }: { router: routers }) {
  const router_name = router.name;
  const router_sn = router.serial_number;

  const router_mp_port = router.pump_microprocessor_port;
  const router_hub_port = router.pump_hub_port;
  const router_main_station = router.linked_to_base_station;
  const routersList = (
    <tr>
      <td>
        <input
          type="text"
          name="sbc"
          value={router_name}
        />
      </td>
      <td>
        <input
          type="text"
          min="0"
          max="5"
          name="sbc"
          value={router_sn!}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="3"
          name="relay"
          value={router_mp_port!}
          size={10}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="3"
          name="relay"
          value={router_hub_port!}
          size={10}
        />
      </td>
      <td>
        <input
          type="checkbox"
          min="0"
          max="3"
          name="relay"
          checked={router_main_station!}
          size={10}
        />
      </td>
      <td colSpan={4}>
        <Button variant="contained" color="error">
          DELETE
        </Button>
      </td>
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
          <tr>
            <th>Name</th>
            <th>Serial Number</th>
            <th>SBC port</th>
            <th>Relay port</th>
            <th>Connected to base station?</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routersList}
          <AddRouteConfig />
        </tbody>
      </Table>
    </div>
  );
}
