"use client"

import React, { useState } from "react";
import { routers, routes } from '@prisma/client'
import {
  Button,
  Divider,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Card,
  CardBody
} from "@nextui-org/react";
import { addRouter, deleteRouter } from "@/lib/routerActions";
import { Trash2, Plus, Droplets } from 'lucide-react';

export default function RouterConfig({ configRouters, routes }: { configRouters: routers[], routes: routes[] }) {
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h1 className="text-4xl font-extrabold dark:text-white uppercase tracking-tight">
          Routing Stations
        </h1>
        <p className="text-default-500 text-sm mt-1">Manage physical valve controller links and flow paths.</p>
      </div>

      <RouterDivConfig
        router={configRouters}
        routes={routes}
      />
    </div>
  );
}

export function RouterDivConfig({ router, routes }: { router: routers[], routes: routes[] }) {
  const [name, setName] = useState("");

  const onAddStation = () => {
    if (!name.trim()) return;
    addRouter(
      {
        "name": name,
        "hub_serial_number": 0,
        "hub_port": 0,
        "relay_channel": 0,
        "linked_to_base_station": true
      }, "", 0, 0, 0);
    setName("");
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <Table
        aria-label="Routing Station List"
        removeWrapper
        className="border border-default-200 rounded-xl"
        classNames={{
          th: "bg-default-50 text-default-600 font-bold",
          td: "py-3"
        }}
      >
        <TableHeader>
          <TableColumn>STATION NAME</TableColumn>
          <TableColumn align="end" className="w-[100px]">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No routing stations configured."}>
          {router.map((r) => (
            <TableRow key={r.name} className="border-b border-default-100 last:border-none">
              <TableCell>
                <div className="flex items-center gap-2 font-mono font-bold">
                  <Droplets size={16} className="text-blue-500" />
                  {r.name}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  variant="light"
                  color="danger"
                  size="sm"
                  onPress={() => deleteRouter(r)}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Manual Entry Section */}
      <Card shadow="none" className="bg-default-50/50 border border-default-200">
        <CardBody className="flex flex-row gap-3 items-end p-4">
          <Input
            label="New Station Name"
            placeholder="e.g. ZONE_A_VALVES"
            labelPlacement="outside"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="bordered"
            className="flex-1"
          />
          <Button
            color="primary"
            onPress={onAddStation}
            startContent={<Plus size={18} />}
            isDisabled={!name || router.length > 0}
            className="font-bold"
          >
            Add Station
          </Button>
        </CardBody>
      </Card>

      {router.length > 0 && (
        <p className="text-[10px] text-default-400 italic text-center uppercase tracking-widest">
          Primary flow path established
        </p>
      )}
    </div>
  );
}