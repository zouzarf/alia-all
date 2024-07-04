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
    const nodesToDrop = await prisma.$queryRawUnsafe<node[]>(`WITH RECURSIVE nodes_to_delete AS (
                                                -- Start with the node you want to delete
                                                SELECT dst
                                                FROM config.routes
                                                WHERE src = '${router.name}'

                                                UNION ALL

                                                -- Recursively find all linked nodes
                                                SELECT t.dst
                                                FROM config.routes t
                                                INNER JOIN nodes_to_delete ntd ON t.src = ntd.dst
                                            )
                            select dst from nodes_to_delete`)
    await prisma.$transaction([
        prisma.routers.delete({
            where: { name: router.name }
        }),
        prisma.routes.deleteMany({
            where: { dst: router.name }
        }),
        prisma.routes.deleteMany({
            where: { dst: { in: nodesToDrop.map(x => x.dst) } }
        }),
        prisma.zones.deleteMany({
            where: { name: { in: nodesToDrop.map(x => x.dst) } }
        }),
        prisma.routers.deleteMany({
            where: { name: { in: nodesToDrop.map(x => x.dst) } }
        }),
        prisma.nodes.deleteMany(
            { "where": { node_name: { in: nodesToDrop.map(x => x.dst).concat([router.name]) } } }
        )
    ])
    revalidatePath('/')
    redirect(`/config/routers`)

}


export const addRouter = async (router: routers, router_from: string, port1: number, port2: number) => {
    if (router.linked_to_base_station == false && router_from != "") {
        await prisma.$transaction([
            prisma.nodes.create({ "data": { node_name: router.name } })
            , prisma.routers.create({ "data": router }),
            prisma.routes.create({ "data": { "src": router_from, "dst": router.name, "valve_microprocessor_port": port1, "valve_hub_port": port2 } })
        ])
    }
    else {
        await prisma.$transaction([
            prisma.nodes.create({ "data": { node_name: router.name } })
            , prisma.routers.create({ "data": router })
        ])
    }
    revalidatePath('/')
    redirect(`/config/routers`)
}