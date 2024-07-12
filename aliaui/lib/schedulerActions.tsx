"use server"
import 'server-only'

import { jobs_actions, jobs } from '@prisma/client'
import prisma from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const insertScheduler = async (job: jobs, dailyActions: jobs_actions[]) => {
    const response = await prisma.jobs.create({
        data: {
            name: job.name,
            zone_name: job.zone_name,
            start_date: job.start_date,
            end_date: job.end_date
        }
    })
    dailyActions.map(async (dailyAction) => {
        await prisma.jobs_actions.create({
            data: {
                job_id: response.id,
                hour: dailyAction.hour,
                compressing_time: dailyAction.compressing_time,
                water_level: dailyAction.water_level,
                dose_number: dailyAction.dose_number,
                mixing_time: dailyAction.mixing_time,
                routing_time: dailyAction.routing_time,
            }
        });
    })
    revalidatePath('/')
    redirect(`/scheduler/${response.id}`)
}
export const readAllSchedules = async () => {
    const response = await prisma.jobs.findMany()
    return response
}
export const readSchedule = async (jobId: number) => {
    const response = await prisma.jobs.findUnique({ "where": { "id": jobId } })
    return response
}
export const readDailyActions = async (jobId: number) => {
    const response = await prisma.jobs_actions.findMany({ "where": { "job_id": jobId } })
    return response
}

export const readEvents = async (jobId: number) => {
    const response = await prisma.events_logs.findMany({ "where": { "job_id": jobId } })
    return response
}
export const deleteJob = async (jobId: number) => {
    await prisma.$transaction([
        prisma.jobs.delete({
            where: { id: jobId }
        }),
        prisma.jobs_actions.deleteMany({
            where: { job_id: jobId }
        })
    ])
    revalidatePath('/')
    redirect(`/scheduler`)

}