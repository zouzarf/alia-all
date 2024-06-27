"use server"
import 'server-only'

import { daily_schedule_actions, schedules } from '@prisma/client'
import prisma from "@/lib/db";

export const insertScheduler = async (schedule: schedules, dailyActions: daily_schedule_actions[]) => {
    const response = await prisma.schedules.create({
        data: {
            name: schedule.name,
            zone_id: schedule.zone_id,
            start_date: schedule.start_date,
            end_date: schedule.end_date
        }
    })
    dailyActions.map(async (dailyAction) => {
        await prisma.daily_schedule_actions.create({
            data: {
                schedule_id: response.id,
                hour: dailyAction.hour,
                compressing_time: dailyAction.compressing_time,
                water_level: dailyAction.water_level,
                dose_number: dailyAction.dose_number,
                mixing_time: dailyAction.mixing_time,
                routing_time: dailyAction.routing_time,
            }
        });
    })

    return response
}