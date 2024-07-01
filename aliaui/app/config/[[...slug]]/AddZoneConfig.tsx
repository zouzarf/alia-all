import React from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { createZone } from "@/lib/zonesActions";
import { routers } from "@prisma/client";

export default function AddZoneConfig({ routers }: { routers: routers[] }) {

  const [name, setName] = React.useState("")
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
        >
          {routers.map(router => (
            <SelectItem key={router.id}>
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
      <Button color="success" onClick={() => createZone(name)}>
        Add
      </Button></div>
  );
}
