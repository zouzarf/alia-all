"use server"
import prisma from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export const createZone = async (zoneName: string, router: string, hub_serial_number: number, hub_port: number, relay_channel: number) => {
    const response = await prisma.$transaction([prisma.nodes.create({ "data": { node_name: zoneName } })
        , prisma.zones.create(
            { "data": { name: zoneName } }
        )
        , prisma.routes.create(
            { "data": { src: router, dst: zoneName, hub_port: hub_port, relay_channel: relay_channel, hub_serial_number: hub_serial_number } }
        )
    ])
    revalidatePath('/')
    redirect(`/config/zones_config`)
    return response
}
export const deleteZone = async (zoneName: string) => {
    const r = await prisma.$transaction([
        prisma.zones.delete(
            { "where": { name: zoneName } }
        )
        , prisma.routes.deleteMany(
            { "where": { dst: zoneName } }
        )
        , prisma.nodes.delete(
            { "where": { node_name: zoneName } }
        )])
    revalidatePath('/')
    redirect(`/config/zones_config`)
}