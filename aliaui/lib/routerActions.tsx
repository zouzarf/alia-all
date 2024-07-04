"use server"
import 'server-only'

import { base_station_ports, general_config, routers } from '@prisma/client'
import prisma from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
type node = {
    dst: string;
}
export const deleteRouter = async (router: routers) => {
    await prisma.routers.delete({
        where: { name: router.name }
    })
    const nodesToDrop = await prisma.$queryRaw<node[]>`WITH RECURSIVE nodes_to_delete AS (
                                                -- Start with the node you want to delete
                                                SELECT dst
                                                FROM config.routes
                                                WHERE dst = '${router.name}' -- Replace :node_id with the actual node ID you want to delete

                                                UNION ALL

                                                -- Recursively find all linked nodes
                                                SELECT t.dst
                                                FROM config.routes t
                                                INNER JOIN nodes_to_delete ntd ON t.src = ntd.dst
                                            )
                            select dst from nodes_to_delete`
    await prisma.routes.deleteMany({
        where: { dst: router.name }
    })
    await prisma.zones.deleteMany({
        where: { name: { in: nodesToDrop.map(x => x.dst) } }
    })
    await prisma.routers.deleteMany({
        where: { name: { in: nodesToDrop.map(x => x.dst) } }
    })
}


export const addRouter = async (router: routers, router_from: string, port1: number, port2: number) => {
    await prisma.routers.create({ "data": router })
    if (router.linked_to_base_station == false && router_from != "") await prisma.routes.create({ "data": { "src": router_from, "dst": router.name, "valve_microprocessor_port": port1, "valve_hub_port": port2 } })
}