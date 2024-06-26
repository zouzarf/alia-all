
import { Box, Grid, Paper } from "@mui/material";
import { PrismaClient } from '@prisma/client'
import BaseStationConfig from "./basestation";
import ZonesConfig from "./Zones";
import RouterConfig from "./RouterConfig";
import Overview from "./Overview";
import GeneralConfig from "./GeneralConfig";
import prisma from "@/lib/db";
import RoutesConfig from "./RoutesConfig";

export default async function ZonesNetwork() {

    const baseStationPorts = await prisma.base_station_ports.findMany()
    const generalConfig = await prisma.general_config.findMany()
    const zones = await prisma.zones.findMany()
    const routers = await prisma.routers.findMany()
    const routes = await prisma.routes.findMany()


    return (

        <div>
            <Paper>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Overview routers={routers} zones={zones} routes={routes} />
                        <h2>General Config</h2>
                        <div>
                            <GeneralConfig
                                config={generalConfig}
                            />
                        </div>
                        <h2>Zones</h2>
                        <ZonesConfig config={zones} />
                        <h2>Base station</h2>
                        <div>
                            <BaseStationConfig
                                config={baseStationPorts}
                            />
                        </div>
                        <h2>Routers</h2>
                        <RouterConfig
                            configRouters={routers}
                        />
                        <h2>Routes</h2>
                        <RoutesConfig
                            configRoutes={routes}
                        />
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
