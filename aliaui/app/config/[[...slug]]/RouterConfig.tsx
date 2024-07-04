"use client"
import React, { Key, useState } from "react";
import { routers } from '@prisma/client'
import { Button, Checkbox, Divider, Input, Radio, RadioGroup, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { addRouter, deleteRouter } from "@/lib/routerActions";
import { cp } from "fs";
import { useRouter } from "next/navigation";


export default function RouterConfig({ configRouters }: { configRouters: routers[] }) {


  return (
    <div>
      <RouterDivConfig
        router={configRouters}
      />
      <Divider className="my-4" />
      <AddRouterConfig otherRouters={configRouters} />
    </div>
  );
}

export function RouterDivConfig({ router }: { router: routers[] }) {
  const rrouter = useRouter()
  const rows = router;

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "serial_number",
      label: "Serial Number",
    },
    {
      key: "sbc_port",
      label: "SBC Port",
    },
    {
      key: "hub_port",
      label: "Hub Port",
    },
    {
      key: "main_station",
      label: "Connected to Base Station",
    },
    {
      key: "connect_router",
      label: "Connected to Router",
    },
    {
      key: "action",
      label: "Action",
    }
  ];
  const renderCell = React.useCallback((router: routers, columnKey: Key) => {

    switch (columnKey) {
      case "name":
        return (
          router.name
        );
      case "serial_number":
        return (
          router.serial_number
        );
      case "sbc_port":
        return (
          router.pump_microprocessor_port
        );
      case "hub_port":
        return (
          router.pump_hub_port
        );
      case "main_station":
        return (
          router.linked_to_base_station ? "True" : ""
        );
      case "connect_router":
        return (
          router.linked_to_base_station == false ? "Router: AZEAZE Ports : 3/0" : ""
        );
      case "action":
        return (
          <Button variant="bordered" color="danger" onClick={() => { deleteRouter(router); rrouter.push("/config/routers") }}>
            Delete(cascading)
          </Button>
        );
      default:
        return router.name;
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
export function AddRouterConfig({ otherRouters }: { otherRouters: routers[] }) {
  const rrouter = useRouter()
  const [name, setName] = useState("");
  const [sn, setSn] = useState("");
  const [mpPort, setMpPort] = useState(0);
  const [hubPort, setHubPort] = useState(0);
  const [linkedToBase, setLinkedToBase] = useState(otherRouters.filter(x => x.linked_to_base_station).length == 0);
  const [linkedToRouter, setLinkedToRouter] = useState("");
  const [pvRouterMpPort, setPvRouterMpPort] = useState(0);
  const [pvRouterHubPort, setPvRouterHubPort] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          type="text"
          label="Router Name"
          value={name}
          labelPlacement="outside"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          type="text"
          min={0}
          max={5}
          value={sn}
          label="Serial Number"
          labelPlacement="outside"
          onChange={(e) => {
            setSn(e.target.value);
          }}
        />
        <Input
          min={0}
          max={5}
          value={mpPort.toString()}
          type="number"
          label="Pump SbcPort"
          labelPlacement="outside"
          onChange={(e) => {
            setMpPort(parseInt(e.target.value));
          }}
        />
        <Input
          min={0}
          max={5}
          value={hubPort.toString()}
          type="number"
          label="Pump Hub Port"
          labelPlacement="outside"

          onChange={(e) => {
            setHubPort(parseInt(e.target.value));
          }}
        />


      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <RadioGroup
          label="Linked to"
          value={linkedToBase ? "true" : "false"}
          onChange={(e) => {
            setLinkedToBase(e.target.value == "true" ? true : false);
          }}
        >
          <Radio isDisabled={otherRouters.filter(x => x.linked_to_base_station).length != 0} value="true">Base station</Radio>
          <Radio value="false">Another Router</Radio>
        </RadioGroup>
      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Select
          placeholder="Select a router"
          selectionMode="single"
          className="max-w-xs"
          isDisabled={linkedToBase == true}
          value={linkedToRouter}
          hidden={linkedToBase == true}
          onChange={(e) => {
            console.log(e)
            setLinkedToRouter(e.target.value);
          }}
        >
          {otherRouters.map(router => (
            <SelectItem key={router.name}>
              {router.name}
            </SelectItem>
          ))}
        </Select>
        <Input
          min={0}
          max={5}
          value={pvRouterMpPort.toString()}
          isDisabled={linkedToBase == true}
          type="number"
          label="Router SbcPort"
          labelPlacement="outside"
          onChange={(e) => {
            setPvRouterMpPort(parseInt(e.target.value));
          }}
        />
        <Input
          min={0}
          max={5}
          value={pvRouterHubPort.toString()}
          isDisabled={linkedToBase == true}
          type="number"
          label="Router Hub Port"
          labelPlacement="outside"
          onChange={(e) => {
            setPvRouterHubPort(parseInt(e.target.value));
          }}
        />


      </div>
      <Button color="success" isDisabled={linkedToBase == false && linkedToRouter == ""} onClick={() => {
        addRouter(
          {
            "name": name,
            "serial_number": sn,
            "pump_hub_port": mpPort,
            "pump_microprocessor_port": hubPort,
            "linked_to_base_station": linkedToBase
          }, linkedToRouter, pvRouterMpPort, pvRouterMpPort);
        rrouter.refresh();
        rrouter.push("/config/routers");

      }}>
        Add
      </Button>
    </div>
  );
}