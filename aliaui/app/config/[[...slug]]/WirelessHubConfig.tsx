"use client"

import React, { useState } from "react";
import { wireless_hubs } from '@prisma/client'
import {
    Button,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardBody
} from "@nextui-org/react";
import { addIp, deleteIp } from "@/lib/routerActions";
import { Trash2, Plus, Wifi, Globe } from 'lucide-react';

export default function WirelessHub({ wirelessHubs }: { wirelessHubs: wireless_hubs[] }) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-extrabold uppercase tracking-tighter dark:text-white">
                    Hub Connectivity
                </h1>
                <p className="text-default-500 text-sm">Register IP addresses for Wireless VINT Hubs on the local network.</p>
            </div>

            <WirelessHubConfig wirelessHubs={wirelessHubs} />
        </div>
    );
}

export function WirelessHubConfig({ wirelessHubs }: { wirelessHubs: wireless_hubs[] }) {
    const [newIp, setNewIp] = useState("");

    const handleAdd = () => {
        if (!newIp.trim()) return;
        addIp(newIp);
        setNewIp("");
    };

    return (
        <div className="flex flex-col gap-4">
            <Table
                aria-label="VINT Hub IP Registry"
                removeWrapper
                className="border border-default-200 rounded-xl"
                classNames={{
                    th: "bg-default-50 text-default-600 font-bold",
                    td: "py-4 font-mono"
                }}
            >
                <TableHeader>
                    <TableColumn>HUB IP ADDRESS</TableColumn>
                    <TableColumn align="end" className="w-[100px]">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No wireless hubs registered."}>
                    {wirelessHubs.map((r) => (
                        <TableRow key={r.ip} className="border-b border-default-100 last:border-none">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Globe size={16} className="text-default-400" />
                                    <span className="text-md tracking-widest">{r.ip}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    color="danger"
                                    size="sm"
                                    onPress={() => deleteIp(r.ip)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Card shadow="none" className="bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
                <CardBody className="flex flex-row gap-3 items-end p-4">
                    <Input
                        label="New Hub IP"
                        placeholder="192.168.1.XX"
                        labelPlacement="outside"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        variant="bordered"
                        className="flex-1 bg-white dark:bg-default-100 rounded-xl"
                        startContent={<Wifi size={16} className="text-default-400" />}
                    />
                    <Button
                        color="primary"
                        onPress={handleAdd}
                        startContent={<Plus size={18} />}
                        isDisabled={!newIp}
                        className="font-bold shadow-md"
                    >
                        Register Hub
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
}