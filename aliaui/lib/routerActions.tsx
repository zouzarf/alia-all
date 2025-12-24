"use server"
import { routers } from '@prisma/client'
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


export const addRouter = async (router: routers, router_from: string, hub_port: number, relay_channel: number, serial_number: number) => {
    if (router.linked_to_base_station == false && router_from != "") {
        await prisma.$transaction([
            prisma.nodes.create({ "data": { node_name: router.name } })
            , prisma.routers.create({ "data": router }),
            prisma.routes.create({ "data": { "src": router_from, "dst": router.name, "hub_port": hub_port, "relay_channel": relay_channel, "hub_serial_number": serial_number } })
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

export const addIp = async (ip: string) => {
    await prisma.wireless_hubs.create({ "data": { ip: ip } })
    revalidatePath('/')
    redirect(`/config/wireless_hub_config`)
}

export const deleteIp = async (ip: string) => {
    await prisma.wireless_hubs.delete({
        where: { ip: ip }
    })
    revalidatePath('/')
    redirect(`/config/wireless_hub_config`)

}