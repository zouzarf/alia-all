import prisma from "@/lib/db";
import ConfigEditor from "./ConfigEditor";

export default async function ConfigPage({ params }: { params: { slug: string[] } }) {

    const baseStationPorts = await prisma.base_station_ports.findMany()
    const generalConfig = await prisma.general_config.findMany()
    const zones = await prisma.zones.findMany()
    const routers = await prisma.routers.findMany()
    const routes = await prisma.routes.findMany()

    return (
        <ConfigEditor generalConfig={generalConfig} zones={zones} routers={routers} baseStationConfig={baseStationPorts} routes={routes} selected={params.slug != null && params.slug.length > 0 ? params.slug[0] : "general"} />
    );
}
