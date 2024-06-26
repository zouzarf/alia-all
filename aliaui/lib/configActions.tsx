"use server"
import 'server-only'

import { base_station_ports, general_config } from '@prisma/client'
import prisma from "@/lib/db";

export const updateBaseStation = async (baseStationConfig: base_station_ports) => {
    const response = await prisma.base_station_ports.update({
        where: { name: baseStationConfig.name },
        data: { hub_port: baseStationConfig.hub_port, microprocessor_port: baseStationConfig.microprocessor_port }
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