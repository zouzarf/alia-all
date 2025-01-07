"use client"
import React, { Key, useState } from "react";
import { routers, routes } from '@prisma/client'
import { Button, Divider, Input, Radio, RadioGroup, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { addRouter, deleteRouter } from "@/lib/routerActions";
import DeleteIcon from '@mui/icons-material/Delete';
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function RouterConfig({ configRouters, routes }: { configRouters: routers[], routes: routes[] }) {


  return (
    <div>
      <h1 className="text-5xl font-extrabold dark:text-white text-center">List of routers</h1>
      <Divider className="my-2" />
      <RouterDivConfig
        router={configRouters}
        routes={routes}
      />
    </div>
  );
}

export function RouterDivConfig({ router, routes }: { router: routers[], routes: routes[] }) {
  const rows = router;
  const { data, error } = useSWR("/api/config", fetcher);
  const client = mqttConnecter(data)

  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [mpPort, setMpPort] = useState(0);
  const [hubPort, setHubPort] = useState(0);
  const isOtherRouterLinkedToBase = router.filter(x => x.linked_to_base_station).length == 0;
  const [linkedToRouter, setLinkedToRouter] = useState("");
  const [pvRouterMpPort, setPvRouterMpPort] = useState(0);
  const [pvRouterHubPort, setPvRouterHubPort] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();



  return (
    <>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Define routing source</ModalHeader>
              <ModalBody>
                <div className="w-900">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          From
                        </th>
                        {(linkedToRouter != "base_station" && linkedToRouter != "") ? (<><th scope="col" className="px-6 py-3">
                          Port
                        </th>
                          <th scope="col" className="px-6 py-3">
                            Channel
                          </th></>) : ""}

                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <Select
                            placeholder="Source"
                            selectionMode="single"
                            className="max-w-xs"
                            value={linkedToRouter}
                            selectedKeys={[linkedToRouter]}
                            onChange={(e) => {
                              setLinkedToRouter(e.target.value);
                            }}
                          >


                            {[["base_station", "Base station"]].concat(router.map(router => [router.name, router.name])).map(router => (
                              <SelectItem key={router[0]} isDisabled={(isOtherRouterLinkedToBase == false && router[0] == "base_station") || (isOtherRouterLinkedToBase == true && router[0] != "base_station")}>
                                {router[1]}
                              </SelectItem>
                            ))}
                          </Select>
                        </th>
                        {(linkedToRouter != "base_station" && linkedToRouter != "") ? (<><td className="px-6 py-4">
                          <Input
                            min={0}
                            max={5}
                            value={pvRouterMpPort.toString()}
                            isDisabled={isOtherRouterLinkedToBase == true}
                            type="number"
                            labelPlacement="outside"
                            onChange={(e) => {
                              setPvRouterMpPort(parseInt(e.target.value));
                            }}
                          />
                        </td>
                          <td className="px-6 py-4">
                            <Input
                              min={0}
                              max={5}
                              value={pvRouterHubPort.toString()}
                              isDisabled={isOtherRouterLinkedToBase == true}
                              type="number"
                              labelPlacement="outside"
                              onChange={(e) => {
                                setPvRouterHubPort(parseInt(e.target.value));
                              }}
                            />
                          </td></>) : ""}
                      </tr>
                    </tbody>
                  </table>
                </div>

              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Router Name
              </th>
              <th scope="col" className="px-6 py-3">
                Serial Number
              </th>
              <th scope="col" className="px-6 py-3">
                Pump port
              </th>
              <th scope="col" className="px-6 py-3">
                Pump Channel
              </th>
              <th scope="col" className="px-6 py-3">
                Flow Source (Routing source)
              </th>
              <th scope="col" className="px-6 py-3">

              </th>
            </tr>
          </thead>
          <tbody>
            {
              router.map(r => {
                const routing = routes.filter(x => x.dst == r.name);
                return (
                  <tr key={r.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {r.name}
                    </th>
                    <td className="px-6 py-4">
                      {r.serial_number}
                    </td>
                    <td className="px-6 py-4">
                      {r.pump_microprocessor_port}
                    </td>
                    <td className="px-6 py-4">
                      {r.pump_hub_port}
                    </td>
                    <td className="px-6 py-4">
                      {r.linked_to_base_station == false ? `Router: ${routing.length > 0 ? routing[0].src : "NA"} - Port:${routing.length > 0 ? routing[0].valve_microprocessor_port : "NA"}/Channel:${routing.length > 0 ? routing[0].valve_hub_port : "NA"}` : "Base station"}
                    </td>
                    <td className="px-6 py-4">
                      <Button isIconOnly variant="bordered" color="danger" onClick={() => {
                        deleteRouter(r);
                        client?.publish(
                          "hub",
                          JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
                        );
                      }}>
                        <DeleteIcon />
                      </Button>
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
                  labelPlacement="inside"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </th>
              <td className="px-6 py-4">
                <Input
                  type="text"
                  min={0}
                  max={5}
                  value={serialNumber}
                  labelPlacement="inside"
                  onChange={(e) => {
                    setSerialNumber(e.target.value);
                  }}
                />
              </td>
              <td className="px-6 py-4">
                <Input
                  min={0}
                  max={5}
                  value={mpPort.toString()}
                  type="number"
                  labelPlacement="inside"
                  onChange={(e) => {
                    setMpPort(parseInt(e.target.value));
                  }}
                />
              </td>
              <td className="px-6 py-4">
                <Input
                  min={0}
                  max={5}
                  value={hubPort.toString()}
                  type="number"
                  labelPlacement="inside"
                  onChange={(e) => {
                    setHubPort(parseInt(e.target.value));
                  }}
                />
              </td>
              <td className="px-6 py-4">
                {linkedToRouter == "" ? "NA " : linkedToRouter == "base_station" ? "Base station " : `Router: ${linkedToRouter} - Port:${pvRouterMpPort}/Channel:${pvRouterHubPort} `}
                <Button onPress={onOpen}>Edit</Button>
              </td>
              <td className="px-6 py-4">
                <Button color="success" isDisabled={(isOtherRouterLinkedToBase == false && linkedToRouter == "") || name == ""} onClick={() => {
                  console.log(linkedToRouter == "base_station")
                  addRouter(
                    {
                      "name": name,
                      "serial_number": serialNumber,
                      "pump_hub_port": mpPort,
                      "pump_microprocessor_port": hubPort,
                      "linked_to_base_station": linkedToRouter == "base_station"
                    }, linkedToRouter, pvRouterMpPort, pvRouterMpPort);
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
    </>
  );
}