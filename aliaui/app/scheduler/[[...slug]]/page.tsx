
import { readAllSchedules, readDailyActions, readEvents } from "@/lib/schedulerActions";
import { jobs_actions, events_logs, zones } from "@prisma/client";
import LeftBar from "./LeftBar";
import NewJob from "./NewJob";
import JobInfo from "./JobInfo";
import prisma from "@/lib/db";

export default async function ScheduleA({ params }: { params: { slug: string[] } }) {

    const jobs = await readAllSchedules()
    const dailyActions: jobs_actions[] = params.slug != null && params.slug.length > 0 ? await readDailyActions(parseInt(params.slug[0])) : []
    const events: events_logs[] = params.slug != null && params.slug.length > 0 ? await readEvents(parseInt(params.slug[0])) : []
    const zones: zones[] = await prisma.zones.findMany()

    return (
        <div className="flex flex-row gap-x-5">
            <div className="basis-1/6">
                <LeftBar jobs={jobs} selectJob={params.slug != null && params.slug.length > 0 ? params.slug[0] : ""} />
            </div>
            <div className="basis-5/6">
                {params.slug != null && params.slug.length > 0 ? (params.slug[0] == "new" ? <NewJob zones={zones} /> : <JobInfo job={jobs.filter(s => s.id == parseInt(params.slug[0]))[0]} dailyActions={dailyActions} events={events} />) : ""}
            </div>
        </div>
    )
}