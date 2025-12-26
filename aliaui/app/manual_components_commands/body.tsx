"use client"

import React, { useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Cpu, Router, Settings2 } from "lucide-react";
import { base_station_ports, general_config, routers, routes } from "@prisma/client";
import BaseStationCommands from "./baseStationCommands";
import RouterCommands from "./RouterCommands";

interface BodyProps {
    bs_config: base_station_ports[];
    router: routers[];
    routings: routes[];
    general_config: general_config[];
    mqttIp: string;
}

export default function Body({ bs_config, router, routings }: BodyProps) {
    // Standardizing the dynamic tabs list
    const routerTabs = router.map(r => ({
        id: r.name,
        label: r.name,
        icon: <Router size={16} />,
        content: <RouterCommands router={r} routings={routings} />
    }));

    const allTabs = [
        {
            id: "base_station",
            label: "Base Station",
            icon: <Cpu size={16} />,
            content: <BaseStationCommands bs_config={bs_config} />
        },
        ...routerTabs
    ];

    return (
        <div className="flex w-full flex-col gap-4">
            <Tabs
                aria-label="Hardware Control Panels"
                variant="underlined"
                color="primary"
                classNames={{
                    base: "w-full border-b border-divider",
                    tabList: "gap-6 w-full relative rounded-none p-0",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-2 h-12",
                    tabContent: "group-data-[selected=true]:text-primary font-black uppercase text-[11px] tracking-widest"
                }}
            >
                {allTabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        title={
                            <div className="flex items-center space-x-2">
                                {tab.icon}
                                <span>{tab.label}</span>
                            </div>
                        }
                    >
                        <Card shadow="none" className="bg-transparent mt-4">
                            <CardBody className="px-0 py-2">
                                {/* The dynamic content panel */}
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {tab.content}
                                </div>
                            </CardBody>
                        </Card>
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}