"use client"

import React, { useState } from "react";
import { Card, CardBody, Button, Chip, Divider, Tooltip } from "@nextui-org/react";
import { Power, PowerOff, Activity, Droplets, Zap } from "lucide-react";
import { base_station_ports } from "@prisma/client";
import { handleComponentCommand } from "./command";

export default function BaseStationCommands({ bs_config }: { bs_config: base_station_ports[] }) {
    const [loadingComponent, setLoadingComponent] = useState<string | null>(null);

    // Separate components from sensors
    const components = bs_config
        .filter(b => b.name !== "WATERSENSOR")
        .sort((a, b) => a.name.localeCompare(b.name));

    const onCommand = async (name: string, action: "activate" | "deactivate") => {
        setLoadingComponent(`${name}-${action}`);
        try {
            await handleComponentCommand(name, action);
        } catch (error) {
            console.error('Command failed:', error);
        } finally {
            setLoadingComponent(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Sensor Status Bar */}
            <div className="flex items-center justify-between bg-default-50 p-4 rounded-2xl border border-default-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Droplets size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-default-400 tracking-widest">Live telemetry</p>
                        <h3 className="text-sm font-bold">Base Station Flow Sensors</h3>
                    </div>
                </div>
                <Chip
                    variant="shadow"
                    color="primary"
                    classNames={{ content: "font-mono font-bold" }}
                    startContent={<Activity size={14} className="ml-1" />}
                >
                    System Online
                </Chip>
            </div>

            {/* Component Control Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {components.map((c) => (
                    <Card key={c.name} shadow="sm" className="border border-default-100">
                        <CardBody className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="text-amber-500" />
                                    <span className="font-black uppercase text-xs tracking-tight text-default-700">
                                        {c.name}
                                    </span>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-default-300 animate-pulse" />
                            </div>

                            <Divider />

                            <div className="flex gap-2">
                                <Button
                                    fullWidth
                                    size="sm"
                                    color="success"
                                    variant="flat"
                                    className="font-bold uppercase text-[10px]"
                                    startContent={<Power size={14} />}
                                    isLoading={loadingComponent === `${c.name}-activate`}
                                    onPress={() => onCommand(c.name, "activate")}
                                >
                                    On
                                </Button>
                                <Button
                                    fullWidth
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    className="font-bold uppercase text-[10px]"
                                    startContent={<PowerOff size={14} />}
                                    isLoading={loadingComponent === `${c.name}-deactivate`}
                                    onPress={() => onCommand(c.name, "deactivate")}
                                >
                                    Off
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}