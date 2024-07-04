"use server"
import 'server-only'

import { zones } from '@prisma/client'
import prisma from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export const createZone = async (zoneName: string, router: string, port1: number, port2: number) => {
    const response = await prisma.$transaction([prisma.nodes.create({ "data": { node_name: zoneName } })
        , prisma.zones.create(
            { "data": { name: zoneName } }
        )
        , prisma.routes.create(
            { "data": { src: router, dst: zoneName, valve_microprocessor_port: port1, valve_hub_port: port2 } }
        )
    ])
    revalidatePath('/')
    redirect(`/config/zones_config`)
    return response
}
export const deleteZone = async (zoneName: string) => {
    const r = await prisma.$transaction([prisma.zones.delete(
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
    return r
}