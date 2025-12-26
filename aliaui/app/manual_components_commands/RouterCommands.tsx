"use client"

import React, { useState } from "react";
import { Card, CardBody, Button, Chip, Tooltip, Divider } from "@nextui-org/react";
import { ArrowRightLeft, Power, PowerOff, MapPin, Navigation } from "lucide-react";
import { routers, routes } from "@prisma/client";
import { handleComponentCommand } from "./command";

export default function RouterCommands({ router, routings }: { router: routers, routings: routes[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const activeRoutes = routings.filter(r => r.src === router.name);

    const onCommand = async (id: string, destination: string, action: "activate" | "deactivate") => {
        setLoadingId(`${id}-${action}`);
        try {
            await handleComponentCommand(destination, action);
        } catch (error) {
            console.error('Valve command failed:', error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Router Identity Header */}
            <div className="flex items-center gap-4 px-2">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Navigation size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-black uppercase tracking-tight">{router.name}</h2>
                    <p className="text-tiny text-default-400 font-bold uppercase tracking-widest">
                        Manual Valve Control
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoutes.map((route) => (
                    <Card key={route.id} shadow="sm" className="border border-default-100 overflow-hidden">
                        <CardBody className="p-0">
                            {/* Path Visualization */}
                            <div className="bg-default-50 p-4 flex items-center justify-between border-b border-default-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-default-400 uppercase tracking-widest">Source</span>
                                        <span className="text-xs font-bold">{router.name}</span>
                                    </div>

                                    <div className="flex items-center px-1">
                                        <ArrowRightLeft size={14} className="text-primary animate-pulse" />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Destination</span>
                                        <span className="text-xs font-bold">{route.dst}</span>
                                    </div>
                                </div>

                                {/* Technical Addressing Badge */}
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[8px] font-black text-default-400 uppercase tracking-tighter">Valve ports</span>
                                    <div className="flex gap-1">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            className="font-mono font-bold h-5 text-[9px] px-1"
                                        >
                                            PORT {route.hub_port}
                                        </Chip>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color="secondary"
                                            className="font-mono font-bold h-5 text-[9px] px-1"
                                        >
                                            CH {route.relay_channel}
                                        </Chip>
                                    </div>
                                </div>
                            </div>

                            {/* Control Actions */}
                            <div className="p-4 flex gap-3">
                                <Button
                                    fullWidth
                                    color="success"
                                    variant="flat"
                                    className="font-black uppercase text-[10px] tracking-wider"
                                    startContent={<Power size={14} />}
                                    isLoading={loadingId === `${route.id}-activate`}
                                    onPress={() => onCommand(route.id.toString(), route.dst!, "activate")}
                                >
                                    Open Valve
                                </Button>
                                <Button
                                    fullWidth
                                    color="danger"
                                    variant="flat"
                                    className="font-black uppercase text-[10px] tracking-wider"
                                    startContent={<PowerOff size={14} />}
                                    isLoading={loadingId === `${route.id}-deactivate`}
                                    onPress={() => onCommand(route.id.toString(), route.dst!, "deactivate")}
                                >
                                    Close Valve
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {activeRoutes.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-default-200 rounded-3xl">
                    <MapPin size={40} className="mx-auto text-default-200 mb-4" />
                    <p className="text-default-400 font-medium">No routings defined for this unit.</p>
                </div>
            )}
        </div>
    );
}