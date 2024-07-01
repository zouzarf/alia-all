"use client"

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Grid, Paper } from "@mui/material";
import React from 'react';
import { base_station_ports, general_config, routers, routes, zones } from '@prisma/client';
import GeneralConfig from './GeneralConfig';
import ZonesConfig from './Zones';
import RouterConfig from './RouterConfig';
import BaseStationConfig from './basestation';
import RoutesConfig from './RoutesConfig';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

export default function ConfigEditor(
    { generalConfig, zones, routers, baseStationConfig, routes, selected }: {
        generalConfig: general_config[], zones: zones[], routers: routers[], baseStationConfig: base_station_ports[], routes: routes[], selected: string
    }) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options" selectedKey={selected}>
                <Tab key="general" title="General Parameters" href={"/config/general"}>
                    <Card>
                        <CardBody>
                            <GeneralConfig
                                config={generalConfig}
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
                            />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="routing_table" title="Routing Table" href="/config/routing_table">
                    <Card>
                        <CardBody>
                            <RoutesConfig
                                configRoutes={routes}
                            />
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>)
}