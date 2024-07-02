
import { Grid, Paper } from "@mui/material";
import Overview from "./Overview";
import prisma from "@/lib/db";
import styles from './styles.module.css'

export default async function ConfigPage({ params }: { params: { slug: string[] } }) {

    const zones = await prisma.zones.findMany()
    const routers = await prisma.routers.findMany()
    const routes = await prisma.routes.findMany()
    return (

        <div>

            <h2 className={styles.title}>Overview</h2>
            <Overview routers={routers} zones={zones} routes={routes} />
        </div >
    );
}
