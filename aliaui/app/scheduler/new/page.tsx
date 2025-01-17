
import { zones } from "@prisma/client";
import NewJob from "./NewPage";
import prisma from "@/lib/db";
export const dynamic = 'force-dynamic'
export default async function ScheduleA({ params }: { params: { slug: string[] } }) {

    const zones: zones[] = await prisma.zones.findMany()

    return (
        <div className="flex flex-col gap-x-5">
            <NewJob zones={zones} />
        </div>
    )
}