import React, { Key, useState } from "react";
import { zones, routers, routes } from '@prisma/client'
import AddZoneConfig from "./AddZoneConfig";
import { Divider } from "@nextui-org/divider";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button } from "@nextui-org/react";


export default function ZonesConfig({ config, routers, routes }: { config: zones[], routers: routers[], routes: routes[] }) {

  const rows = config.map(zone => {
    const route = routes.filter(route => route.dst == zone.id)[0]
    const router = route != null ? routers.filter(router => router.id == route.id)[0] : { "name": "" }
    return { "name": zone.name, "router": router.name, "mp": route?.valve_microprocessor_port, "hp": route?.valve_hub_port }
  });

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "router_name",
      label: "Router Name",
    },
    {
      key: "micro_port",
      label: "SBC Port",
    },
    {
      key: "hub_port",
      label: "Hub Port",
    },

    {
      key: "action",
      label: "Action",
    }
  ];
  const renderCell = React.useCallback((user: any, columnKey: Key) => {

    switch (columnKey) {
      case "name":
        return (
          user.name
        );
      case "router_name":
        return (
          user.router
        );
      case "micro_port":
        return (
          user.mp
        );
      case "hub_port":
        return (
          user.hp
        );
      case "action":
        return (
          <Button variant="bordered" color="danger">
            DELETE
          </Button>
        );
      default:
        return user.name;
    }
  }, []);

  return (
    <div

    >
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Divider className="my-4" />
      <AddZoneConfig routers={routers} />
    </div>
  );
}
