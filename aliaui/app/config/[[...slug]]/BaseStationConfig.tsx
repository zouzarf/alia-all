import React, { Key, useState } from "react";
import { base_station_ports } from '@prisma/client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";
import { updateBaseStation } from "@/lib/configActions";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
export default function BaseStationConfig({ config }: { config: base_station_ports[] }) {

  const rows = config;

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "hub_port",
      label: "Hub Port",
    },
    {
      key: "relay_channel",
      label: "Relay Channel",
    },
    {
      key: "sn",
      label: "Hub Serial Number",
    },
  ];
  const renderCell = React.useCallback((user: base_station_ports, columnKey: Key) => {

    switch (columnKey) {
      case "name":
        return (
          user.name
        );
      case "hub_port":
        return (
          <SbcPort config={user} />
        );
      case "relay_channel":
        return (
          <HubPort config={user} />
        );
      case "sn":
        return (
          <SerialNumber config={user} />
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
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export function HubPort({ config }: { config: base_station_ports }) {
  const [hub_port, setHubPort] = useState(config.relay_channel)

  const { data, error } = useSWR("/api/config", fetcher);
  const client = mqttConnecter(data)

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

        client?.publish(
          "hub",
          JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
        );
      }}
    />

  );
}
export function SerialNumber({ config }: { config: base_station_ports }) {
  const [serialNumber, setSerialNumber] = useState(config.hub_serial_number)

  const { data, error } = useSWR("/api/config", fetcher);
  const client = mqttConnecter(data)

  return (
    <Input
      type="number"
      value={serialNumber?.toString()}
      disabled={serialNumber == null}
      labelPlacement="outside"
      onChange={(e) => {
        setSerialNumber(parseInt(e.target.value));
        updateBaseStation(config.name, { hub_serial_number: parseInt(e.target.value) })

        client?.publish(
          "hub",
          JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
        );
      }}
    />

  );
}
export function SbcPort({ config }: { config: base_station_ports }) {
  const [hub_port, setHubPort] = useState(config.hub_port)
  const { data, error } = useSWR("/api/config", fetcher);
  const client = mqttConnecter(data)

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
        updateBaseStation(config.name, { hub_port: parseInt(e.target.value) });
        client?.publish(
          "hub",
          JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
        );
      }}
    />


  );
}