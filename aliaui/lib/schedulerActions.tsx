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
    // 1. Fetch counts, min, and max dates in parallel (2 queries instead of 5)
    const [counts, aggregates, zones] = await Promise.all([
        prisma.irrigation.groupBy({
            by: ['status'],
            where: { schedule_name: scheduleName },
            _count: { _all: true },
        }),
        prisma.irrigation.aggregate({
            where: { schedule_name: scheduleName },
            _min: { date: true },
            _max: { date: true },
        }),
        prisma.irrigation.findMany({
            where: { schedule_name: scheduleName },
            distinct: ['zone_name'],
            select: { zone_name: true }
        })
    ]);

    // 2. Fetch specific Next/Past dates (Faster to find single records)
    const nextIrrigation = await prisma.irrigation.findFirst({
        where: { schedule_name: scheduleName, status: "TODO" },
        orderBy: { date: 'asc' },
        select: { date: true }
    });

    const pastIrrigation = await prisma.irrigation.findFirst({
        where: { schedule_name: scheduleName, NOT: { status: "TODO" } },
    });

    // 3. Optimized Raw Query with proper parameter handling
    // We calculate the timezone offset string once
    const userTz = DateTime.local().zoneName;

    const scheduleTemplate = await prisma.$queryRaw<any[]>(Prisma.sql`
        SELECT DISTINCT 
            CAST(EXTRACT(HOUR FROM date AT TIME ZONE ${userTz}) AS INT) AS hour, 
            CAST(EXTRACT(MINUTE FROM date AT TIME ZONE ${userTz}) AS INT) AS minute,
            water_pump,
            routing_time,
            warmup_pump,
            warmup_compressor,
            compressing_time
        FROM scheduler.irrigation
        WHERE schedule_name = ${scheduleName}
        ORDER BY hour, minute;
    `);

    // Helper to extract counts from the grouped results
    const todoCount = counts.find(c => c.status === "TODO")?._count._all || 0;
    const doneCount = counts.filter(c => c.status !== "TODO").reduce((acc, c) => acc + c._count._all, 0);

    return {
        name: scheduleName,
        zones: zones.map(x => x.zone_name),
        todoCount: todoCount,
        notTodoCount: doneCount,
        minDate: aggregates._min.date,
        maxDate: aggregates._max.date,
        nextIrrigation: nextIrrigation?.date || null,
        pastIrrigation: pastIrrigation?.process_end || null,
        schedule: scheduleTemplate
    };
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