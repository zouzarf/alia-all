import React, { Key, useState } from "react";
import { zones, routers, routes } from '@prisma/client'
import { Divider } from "@nextui-org/divider";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, SelectItem, Select } from "@nextui-org/react";
import { createZone, deleteZone } from "@/lib/zonesActions";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';


export default function ZonesConfig({ config, routers, routes }: { config: zones[], routers: routers[], routes: routes[] }) {

  const rows = config.map(zone => {
    const route = routes.filter(route => route.dst == zone.name)[0]
    const router = route != null ? routers.filter(router => router.name == route.src)[0] : { "name": "" }
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
          <Button isIconOnly variant="bordered" color="danger" onClick={() => deleteZone(user.name)}>
            <DeleteIcon />
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

export function AddZoneConfig({ routers }: { routers: routers[] }) {
  const rrouter = useRouter()
  const [name, setName] = React.useState("")
  const [routerName, setRouterName] = React.useState("")
  const [sbcPort, setSbcPort] = React.useState(0)
  const [hubPort, setHubPort] = React.useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          type="text"
          label="Zone Name"
          value={name}
          labelPlacement="outside"
          onChange={(e) => {
            console.log(e)
            setName(e.target.value);
          }}
        />
        <Select
          placeholder="Select a router"
          selectionMode="single"
          className="max-w-xs"
          value={routerName}
          onChange={(e) => {
            console.log(e)
            setRouterName(e.target.value);
          }}
        >
          {routers.map(router => (
            <SelectItem key={router.name}>
              {router.name}
            </SelectItem>
          ))}
        </Select>
        <Input
          type="number"
          min={0}
          max={5}
          label="Router SBC PORT"
          value={sbcPort.toString()}
          labelPlacement="outside"
          onChange={(e) => {
            console.log(e)
            setSbcPort(parseInt(e.target.value));
          }}
        />
        <Input
          min={0}
          max={5}
          type="number"
          label="Router Hub Port"
          value={hubPort.toString()}
          labelPlacement="outside"
          onChange={(e) => {
            console.log(e)
            setHubPort(parseInt(e.target.value));
          }}
        />


      </ div>
      <Button isDisabled={routerName == "" || name == ""} color="success" onClick={() => {
        createZone(name, routerName, sbcPort, hubPort);
      }}>
        Add
      </Button></div>
  );
}