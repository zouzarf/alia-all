"use client"
import React from 'react';
import { base_station_ports, general_config, routers, routes, zones, wireless_hubs } from '@prisma/client';
import GeneralConfig from './GeneralConfig';
import ZonesConfig from './ZonesConfig';
import RouterConfig from './RouterConfig';
import BaseStationConfig from './BaseStationConfig';
import WirelessHub from './WirelessHubConfig';
import { Tabs, Tab, Card, CardBody, Chip } from "@nextui-org/react";
import { Settings, Network, Map, Radio, HardDrive } from 'lucide-react';

export default function ConfigEditor({
    generalConfig,
    zones,
    routers,
    baseStationConfig,
    routes,
    selected,
    wirelessHubs
}: {
    generalConfig: general_config[],
    zones: zones[],
    routers: routers[],
    baseStationConfig: base_station_ports[],
    routes: routes[],
    selected: string,
    wirelessHubs: wireless_hubs[]
}) {

    return (
        <div className="flex w-full flex-col gap-6 p-2 md:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-divider pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">System Configuration</h1>
                    <p className="text-default-500 text-small">Manage hardware ports, routing paths, and zone nodes.</p>
                </div>
                <div className="flex gap-2">
                    <Chip variant="flat" color="primary" size="sm">v0.0.0</Chip>
                    <Chip variant="dot" color="success" size="sm">Sync Active</Chip>
                </div>
            </div>

            {/* Config Tabs */}
            <Tabs
                aria-label="Configuration Options"
                selectedKey={selected}
                variant="underlined"
                color="primary"
                classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-blue-600",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-blue-600 font-semibold"
                }}
            >
                <Tab
                    key="general"
                    href="/config/general"
                    title={
                        <div className="flex items-center space-x-2">
                            <Settings size={18} />
                            <span>General</span>
                        </div>
                    }
                >
                    <div className="mt-4">
                        <GeneralConfig config={generalConfig} />
                    </div>
                </Tab>

                <Tab
                    key="base_station"
                    href="/config/base_station"
                    title={
                        <div className="flex items-center space-x-2">
                            <HardDrive size={18} />
                            <span>Base Station</span>
                        </div>
                    }
                >
                    <div className="mt-4">
                        <BaseStationConfig config={baseStationConfig} />
                    </div>
                </Tab>

                <Tab
                    key="routers"
                    href="/config/routers"
                    title={
                        <div className="flex items-center space-x-2">
                            <Network size={18} />
                            <span>Routers</span>
                        </div>
                    }
                >
                    <div className="mt-4">
                        <RouterConfig configRouters={routers} routes={routes} />
                    </div>
                </Tab>

                <Tab
                    key="zones_config"
                    href="/config/zones_config"
                    title={
                        <div className="flex items-center space-x-2">
                            <Map size={18} />
                            <span>Zones</span>
                        </div>
                    }
                >
                    <div className="mt-4">
                        <ZonesConfig routers={routers} routes={routes} config={zones} />
                    </div>
                </Tab>

                <Tab
                    key="wireless_hub_config"
                    href="/config/wireless_hub_config"
                    title={
                        <div className="flex items-center space-x-2">
                            <Radio size={18} />
                            <span>Wireless Hubs</span>
                        </div>
                    }
                >
                    <div className="mt-4">
                        <WirelessHub wirelessHubs={wirelessHubs} />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}