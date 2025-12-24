"use client"
import React, { Key, useState } from "react";
import { wireless_hubs } from '@prisma/client'
import { Button, Divider, Input, Radio, RadioGroup, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { addIp, addRouter, deleteIp, deleteRouter } from "@/lib/routerActions";
import DeleteIcon from '@mui/icons-material/Delete';
export default function WirelessHub({ wirelessHubs }: { wirelessHubs: wireless_hubs[] }) {


    return (
        <div>
            <h1 className="text-5xl font-extrabold dark:text-white text-center">Wireless VINT HUBs IP Adresses</h1>
            <Divider className="my-2" />
            <WirelessHubConfig
                wirelessHubs={wirelessHubs}
            />
        </div>
    );
}

export function WirelessHubConfig({ wirelessHubs }: { wirelessHubs: wireless_hubs[] }) {
    const [newIp, setNewIp] = useState("");
    return (
        <>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                IP
                            </th>
                            <th scope="col" className="px-6 py-3">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            wirelessHubs.map(r => {
                                return (
                                    <tr key={r.ip} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {r.ip}
                                        </th>
                                        <td className="px-6 py-4">
                                            <Button isIconOnly variant="bordered" color="danger" onClick={() => {
                                                deleteIp(r.ip);
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
                                    value={newIp}
                                    labelPlacement="inside"
                                    onChange={(e) => {
                                        setNewIp(e.target.value);
                                    }}
                                />
                            </th>
                            <td className="px-6 py-4">
                                <Button color="success" onClick={() => {
                                    addIp(newIp)
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