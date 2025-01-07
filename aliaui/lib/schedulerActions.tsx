"use server"
import 'server-only'

import { irrigation, Prisma } from '@prisma/client'
import prisma from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { DateTime } from 'luxon';

interface irrigationPlan {
    name: string
    zones: string[]
    startDate: string
    endDate: string
}
interface irrigationz {
    time: Date
    water_level: number
    dose1: number
    dose2: number
    dose3: number
    dose4: number
    mixing_time: number
    routing_time: number
    compressing_time: number
}
export const insertScheduler = async (job: irrigationPlan, dailyActions: irrigationz[]) => {
    console.log(job)
    console.log(dailyActions)
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const curr = currentDate.toISOString().split('T')[0]; // Log the date in YYYY-MM-DD format
        for (const dailyAction of dailyActions) {
            for (const zone of job.zones) {
                const datetime = dailyAction.time
                datetime.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
                if (new Date().getTime() <= datetime.getTime()) {
                    const action = {
                        schedule_name: job.name,
                        zone_name: zone,
                        date: datetime,
                        water_level: dailyAction.water_level,
                        dose_1: dailyAction.dose1,
                        dose_2: dailyAction.dose2,
                        dose_3: dailyAction.dose3,
                        dose_4: dailyAction.dose4,
                        mixing_time: dailyAction.mixing_time,
                        routing_time: dailyAction.routing_time,
                        compressing_time: dailyAction.compressing_time,
                        status: "TODO"
                    }
                    await prisma.irrigation.create({
                        data: action
                    })
                    console.log(action)
                }
            }
        }


    }
    revalidatePath('/')
    redirect(`/scheduler`)
}
export const readScheduleStatistics = async (scheduleName: string) => {
    const todoCount = await prisma.irrigation.count({
        where: {
            schedule_name: scheduleName,
            status: "TODO",
        },
    });

    const notTodoCount = await prisma.irrigation.count({
        where: {
            schedule_name: scheduleName,
            NOT: {
                status: "TODO",
            },
        },
    });

    const dateRange = await prisma.irrigation.aggregate({
        where: { schedule_name: scheduleName },
        _min: { date: true },
        _max: { date: true },
    });
    const nextIrrigation = await prisma.irrigation.aggregate({
        where: { schedule_name: scheduleName, status: "TODO" },
        _min: { date: true },
    });
    const results = await prisma.$queryRaw<
        { hour: number; minute: number; water_level: number; dose_1: number; dose_2: number; dose_3: number; dose_4: number; mixing_time: number; routing_time: number; compressing_time: number }[]
    >(Prisma.sql`
        SELECT DISTINCT 
        CAST(EXTRACT(HOUR FROM date AT TIME ZONE ${DateTime.local().zoneName}) AS INT) AS hour, 
        CAST(EXTRACT(MINUTE FROM date AT TIME ZONE ${DateTime.local().zoneName})AS INT) AS minute,
        water_level,
        dose_1,
        dose_2,
        dose_3,
        dose_4,
        mixing_time,
        routing_time,
        compressing_time
        FROM scheduler.irrigation
        WHERE schedule_name=${scheduleName}
        ;
        `);
    const zones = await prisma.irrigation.findMany({
        distinct: ['zone_name'],
        where: { schedule_name: scheduleName }
    })
    return {
        name: scheduleName,
        zones: zones.map(x => x.zone_name),
        todoCount: todoCount,
        notTodoCount: notTodoCount,
        minDate: dateRange._min.date,
        maxDate: dateRange._max.date,
        nextIrrigation: nextIrrigation._min.date,
        schedule: results
    }
}
export const readAllSchedules = async () => {
    const response = await prisma.irrigation.findMany()
    return response
}
export const readSchedule = async (jobId: number) => {
    const response = await prisma.irrigation.findUnique({ "where": { "id": jobId } })
    return response
}
export const readDailyActions = async (jobId: number) => {
    const response = await prisma.irrigation.findMany({ "where": { "id": jobId } })
    return response
}

export const readEvents = async (jobId: number) => {
    const response = await prisma.events_logs.findMany({ "where": { "job_id": jobId } })
    return response
}
export const deleteJob = async (schedulerName: string) => {
    await prisma.$transaction([
        prisma.irrigation.deleteMany({
            where: { schedule_name: schedulerName }
        }),
    ])
    revalidatePath('/')
    redirect(`/scheduler`)

}