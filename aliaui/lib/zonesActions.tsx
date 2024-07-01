"use server"
import 'server-only'

import { zones } from '@prisma/client'
import prisma from "@/lib/db";


export const createZone = async (zoneName: string) => {
    const response = await prisma.zones.create(
        { "data": { name: zoneName } }
    )
    return response
}