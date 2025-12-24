"use server"
import { Prisma } from '@prisma/client'
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
    water_pump: number
    routing_time: number
    warmup_pump: number
    warmup_compressor: number
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
                datetime.setMilliseconds(0)
                datetime.setSeconds(0)
                if (new Date().getTime() <= datetime.getTime()) {
                    const action = {
                        schedule_name: job.name,
                        zone_name: zone,
                        date: datetime,
                        water_pump: dailyAction.water_pump,
                        warmup_pump: dailyAction.warmup_pump,
                        warmup_compressor: dailyAction.warmup_compressor,
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

    const generalStats = await prisma.irrigation.aggregate({
        where: { schedule_name: scheduleName },
        _min: { date: true },
        _max: { date: true }
    });
    const nextIrrigation = await prisma.irrigation.aggregate({
        where: { schedule_name: scheduleName, status: "TODO" },
        _min: { date: true },
    });
    const pastIrrigation = await prisma.irrigation.aggregate({
        where: { schedule_name: scheduleName, NOT: { status: "TODO" } },
        _max: { process_end: true },
    });
    const results = await prisma.$queryRaw<
        {
            hour: number; minute: number; water_pump: number; routing_time: number;
            warmup_pump: number;
            warmup_compressor: number;
            compressing_time: number
        }[]
    >(Prisma.sql`
        SELECT DISTINCT 
        CAST(EXTRACT(HOUR FROM date AT TIME ZONE ${DateTime.local().zoneName}) AS INT) AS hour, 
        CAST(EXTRACT(MINUTE FROM date AT TIME ZONE ${DateTime.local().zoneName})AS INT) AS minute,
        water_pump,
        routing_time,
        warmup_pump,
        warmup_compressor,
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
        minDate: generalStats._min.date,
        maxDate: generalStats._max.date,
        nextIrrigation: nextIrrigation._min.date,
        pastIrrigation: pastIrrigation._max.process_end,
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
    await prisma.irrigation.deleteMany({
        where: { schedule_name: schedulerName }
    })
    revalidatePath('/')
    redirect(`/scheduler`)

}