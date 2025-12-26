"use client"

import React, { Key, useState, useCallback } from "react";
import { zones, routers, routes } from '@prisma/client'
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, SelectItem, Select, Card, Chip
} from "@nextui-org/react";
import { createZone, deleteZone } from "@/lib/zonesActions";
import { Trash2, Plus, MapPin, HardDrive, Hash, Share2, Activity } from 'lucide-react';
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ZonesConfig({ config, routers, routes }: { config: zones[], routers: routers[], routes: routes[] }) {
  const { data } = useSWR("/api/config", fetcher);
  const client = mqttConnecter(data);

  // Form State
  const [name, setName] = useState("");
  const [routerName, setRouterName] = useState("");
  const [hubSN, setHubSN] = useState(0);
  const [hubPort, setHubPort] = useState(0);
  const [relayCh, setRelayCh] = useState(0);

  const handleAdd = () => {
    createZone(name, routerName, hubSN, hubPort, relayCh);
    client?.publish("hub", JSON.stringify({ command: "RELOAD_CONFIG" }));
    // Reset form
    setName(""); setRouterName(""); setHubSN(0); setHubPort(0); setRelayCh(0);
  };

  const columns = [
    { key: "zone", label: "ZONE NAME", icon: <MapPin size={14} /> },
    { key: "src", label: "ROUTING STATION", icon: <HardDrive size={14} /> },
    { key: "sn", label: "HUB SERIAL NUMBER", icon: <Hash size={14} /> },
    { key: "port", label: "HUB PORT", icon: <Share2 size={14} /> },
    { key: "ch", label: "RELAY CH", icon: <Activity size={14} /> },
    { key: "actions", label: "" },
  ];

  return (
    <div className="space-y-6">
      <Table
        aria-label="Zone to Valve Mapping"
        removeWrapper
        classNames={{
          th: "bg-default-50 text-default-500 text-[10px] font-bold py-3",
          td: "py-3 border-b border-default-100 last:border-none font-mono text-sm"
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>
              <div className="flex items-center gap-2">
                {column.icon} {column.label}
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No water zones configured."}>
          {config.map((zone) => {
            const routing = routes.find(x => x.dst === zone.name);
            return (
              <TableRow key={zone.name}>
                <TableCell className="font-bold text-blue-600">{zone.name}</TableCell>
                <TableCell><Chip size="sm" variant="flat">{routing?.src}</Chip></TableCell>
                <TableCell>{routing?.hub_serial_number}</TableCell>
                <TableCell>P{routing?.hub_port}</TableCell>
                <TableCell>CH{routing?.relay_channel}</TableCell>
                <TableCell>
                  <Button
                    isIconOnly variant="light" color="danger" size="sm"
                    onPress={() => {
                      deleteZone(zone.name);
                      client?.publish("hub", JSON.stringify({ command: "RELOAD_CONFIG" }));
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Add Zone Controller */}
      <Card shadow="none" className="bg-default-50/50 border border-default-200 p-6">
        <p className="text-tiny font-bold text-default-500 uppercase mb-4 tracking-widest">Register New Water Zone</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <Input label="Zone Name" size="sm" variant="bordered" value={name} onChange={(e) => setName(e.target.value)} />

          <Select
            label="Station" size="sm" variant="bordered"
            selectedKeys={routerName ? [routerName] : []}
            onChange={(e) => setRouterName(e.target.value)}
          >
            {routers.map((r) => <SelectItem key={r.name}>{r.name}</SelectItem>)}
          </Select>

          <Input label="Hub Serial Number" type="number" size="sm" variant="bordered" value={hubSN.toString()} onChange={(e) => setHubSN(parseInt(e.target.value))} />
          <Input label="Port (0-5)" type="number" size="sm" variant="bordered" value={hubPort.toString()} onChange={(e) => setHubPort(parseInt(e.target.value))} />
          <Input label="Relay CH" type="number" size="sm" variant="bordered" value={relayCh.toString()} onChange={(e) => setRelayCh(parseInt(e.target.value))} />

          <Button color="primary" className="font-bold" onPress={handleAdd} isDisabled={!name || !routerName}>
            Add Zone
          </Button>
        </div>
      </Card>
    </div>
  );
}