"use server"

import { base_station_ports, general_config } from '@prisma/client'
import prisma from "@/lib/db";

export const updateBaseStation = async (name: string, data: any) => {
    const response = await prisma.base_station_ports.update({
        where: { name: name },
        data: data
    })
    return response
}


export const generalConfig = async (generalConfig: general_config) => {
    const response = await prisma.general_config.update({
        where: { name: generalConfig.name },
        data: { value: generalConfig.value }
    })
    return response
}