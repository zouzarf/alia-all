
import prisma from "@/lib/db";
import CardZone from "./cardZone";

export default async function ScheduleA() {

    const scheduledIrrigations = (await prisma.irrigation.findMany({ distinct: ["schedule_name"] })).map(x => x.schedule_name)

    return (
        <div className="flex flex-col gap-y-5">
            <h1 className="text-center">Overview</h1>
            <div className="flex flex-row gap-10 justify-center">
                {scheduledIrrigations.map(x => <CardZone key={x} scheduledIrrigation={x} />)}
            </div>
        </div>
    )
}