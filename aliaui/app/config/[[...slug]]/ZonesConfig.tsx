import React, { Key, useState } from "react";
import { zones, routers, routes } from '@prisma/client'
import { Divider } from "@nextui-org/divider";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, SelectItem, Select } from "@nextui-org/react";
import { createZone, deleteZone } from "@/lib/zonesActions";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";

export default function ZonesConfig({ config, routers, routes }: { config: zones[], routers: routers[], routes: routes[] }) {
  const { data, error } = useSWR("/api/config", fetcher);
  const client = mqttConnecter(data)
  const rows = config.map(zone => {
    const route = routes.filter(route => route.dst == zone.name)[0]
    const router = route != null ? routers.filter(router => router.name == route.src)[0] : { "name": "" }
    return { "name": zone.name, "router": router.name, "mp": route?.valve_microprocessor_port, "hp": route?.valve_hub_port }
  });
  const [name, setName] = React.useState("")
  const [routerName, setRouterName] = React.useState("")
  const [sbcPort, setSbcPort] = React.useState(0)
  const [hubPort, setHubPort] = React.useState(0)

  return (
    <div

    >
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Zone name
            </th>
            <th scope="col" className="px-6 py-3">
              Source router
            </th>
            <th scope="col" className="px-6 py-3">
              Source router Port
            </th>
            <th scope="col" className="px-6 py-3">
              Source router Channel
            </th>
            <th scope="col" className="px-6 py-3">

            </th>
          </tr>
        </thead>
        <tbody>
          {
            config.map(zone => {
              const routing = routes.filter(x => x.dst == zone.name)[0];
              return (
                <tr key={zone.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {zone.name}
                  </th>
                  <td className="px-6 py-4">
                    {routing.src}
                  </td>
                  <td className="px-6 py-4">
                    {routing.valve_microprocessor_port}
                  </td>
                  <td className="px-6 py-4">
                    {routing.valve_hub_port}
                  </td>
                  <td className="px-6 py-4">
                    <Button isIconOnly variant="bordered" color="danger" onClick={() => {
                      deleteZone(zone.name);
                      client?.publish(
                        "hub",
                        JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
                      );
                    }
                    }>
                      <DeleteIcon />
                    </Button >
                  </td>
                </tr>
              )
            })
          }
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <Input
                type="text"
                value={name}
                labelPlacement="outside"
                onChange={(e) => {
                  console.log(e)
                  setName(e.target.value);
                }}
              />
            </th>
            <td className="px-6 py-4">
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
            </td>
            <td className="px-6 py-4">
              <Input
                type="number"
                min={0}
                max={5}
                value={sbcPort.toString()}
                labelPlacement="outside"
                onChange={(e) => {
                  console.log(e)
                  setSbcPort(parseInt(e.target.value));
                }}
              />
            </td>
            <td className="px-6 py-4">
              <Input
                min={0}
                max={5}
                type="number"
                value={hubPort.toString()}
                labelPlacement="outside"
                onChange={(e) => {
                  console.log(e)
                  setHubPort(parseInt(e.target.value));
                }}
              />
            </td>
            <td className="px-6 py-4">
              <Button isDisabled={routerName == "" || name == ""} color="success" onClick={() => {
                createZone(name, routerName, sbcPort, hubPort);
                client?.publish(
                  "hub",
                  JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
                );
              }}>
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())