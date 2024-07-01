
import { Box, Grid, Paper } from "@mui/material";
import { PrismaClient } from '@prisma/client'
import BaseStationConfig from "./basestation";
import ZonesConfig from "./Zones";
import RouterConfig from "./RouterConfig";
import Overview from "./Overview";
import GeneralConfig from "./GeneralConfig";
import prisma from "@/lib/db";
import RoutesConfig from "./RoutesConfig";
import styles from './styles.module.css'
import ConfigEditor from "./ConfigEditor";

export default async function ConfigPage({ params }: { params: { slug: string[] } }) {

    const baseStationPorts = await prisma.base_station_ports.findMany()
    const generalConfig = await prisma.general_config.findMany()
    const zones = await prisma.zones.findMany()
    const routers = await prisma.routers.findMany()
    const routes = await prisma.routes.findMany()

    console.log(params.slug)



    return (

        <div>
            <Paper>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h2 className={styles.title}>Overview</h2>
                        <Overview routers={routers} zones={zones} routes={routes} />
                        <h2 className={styles.title}>Edit Config</h2>
                        <ConfigEditor generalConfig={generalConfig} zones={zones} routers={routers} baseStationConfig={baseStationPorts} routes={routes} selected={params.slug != null && params.slug.length > 0 ? params.slug[0] : "general"} />
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </Paper>
        </div >
    );
}
