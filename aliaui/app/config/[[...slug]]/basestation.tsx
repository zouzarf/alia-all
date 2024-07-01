import React, { Key, useState } from "react";
import { base_station_ports } from '@prisma/client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";
import { updateBaseStation } from "@/lib/configActions";

export default function BaseStationConfig({ config }: { config: base_station_ports[] }) {

  const rows = config;

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "microport",
      label: "SBC Port",
    },
    {
      key: "hubport",
      label: "Hub Port",
    },
  ];
  const renderCell = React.useCallback((user: base_station_ports, columnKey: Key) => {

    switch (columnKey) {
      case "name":
        return (
          user.name
        );
      case "microport":
        return (
          <SbcPort config={user} />
        );
      case "hubport":
        return (
          <HubPort config={user} />
        );
      default:
        return user.name;
    }
  }, []);

  return (
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
  );
}

export function HubPort({ config }: { config: base_station_ports }) {
  const [hub_port, setHubPort] = useState(config.hub_port)

  return (
    <Input
      type="number"
      min={0}
      max={5}
      value={hub_port?.toString()}
      disabled={hub_port == null}
      labelPlacement="outside"
      onChange={(e) => {
        setHubPort(parseInt(e.target.value));
        updateBaseStation(config.name, { hub_port: parseInt(e.target.value) })
      }}
    />

  );
}
export function SbcPort({ config }: { config: base_station_ports }) {
  const [hub_port, setHubPort] = useState(config.microprocessor_port)

  return (
    <Input
      type="number"
      min={0}
      max={5}
      value={hub_port?.toString()}
      disabled={hub_port == null}
      labelPlacement="outside"
      onChange={(e) => {
        setHubPort(parseInt(e.target.value));
        updateBaseStation(config.name, { microprocessor_port: parseInt(e.target.value) })
      }}
    />


  );
}