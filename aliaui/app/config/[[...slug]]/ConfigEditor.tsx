"use client"
import React from 'react';
import { base_station_ports, general_config, routers, routes, zones } from '@prisma/client';
import GeneralConfig from './GeneralConfig';
import ZonesConfig from './ZonesConfig';
import RouterConfig from './RouterConfig';
import BaseStationConfig from './BaseStationConfig';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Init from './Init';

export default function ConfigEditor(
    { generalConfig, zones, routers, baseStationConfig, routes, selected }: {
        generalConfig: general_config[], zones: zones[], routers: routers[], baseStationConfig: base_station_ports[], routes: routes[], selected: string
    }) {

    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options" selectedKey={selected} fullWidth size="sm">
                <Tab key="general" title="General Parameters" href={"/config/general"}>
                    <Card>
                        <CardBody>
                            <GeneralConfig
                                config={generalConfig}
                            />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="base_station" title="Base station ports" href="/config/base_station">
                    <Card>
                        <CardBody>
                            <BaseStationConfig
                                config={baseStationConfig}
                            />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="routers" title="Routers Config" href="/config/routers">
                    <Card>
                        <CardBody>
                            <RouterConfig
                                configRouters={routers}
                                routes={routes}
                            />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="zones_config" title="Zones Configuration" href="/config/zones_config">
                    <Card>
                        <CardBody>
                            <ZonesConfig routers={routers} routes={routes} config={zones} />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="init" title="Init" href={"/config/init"}>
                    <Card>
                        <CardBody>
                            <Init />
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>)
}