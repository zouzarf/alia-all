
import prisma from "@/lib/db";
import CardZone from "./cardZone";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Image from 'next/image'

export default async function ScheduleA() {
    const AddCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"} {...props}>
            <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );

    const scheduledIrrigations = (await prisma.irrigation.findMany({ distinct: ["schedule_name"] })).map(x => x.schedule_name)

    return (
        <div className="flex flex-col gap-y-5">
            <div className="relative flex items-center justify-center py-5">
                <h1 className="text-4xl font-bold">Overview</h1>
                <Button
                    startContent={<AddCircleIcon />} as={Link} href="./scheduler/new"
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 px-4 py-2"
                    color="primary">
                    New irrigation schedule
                </Button>
            </div>
            <div className="flex flex-row gap-10 justify-center">
                {scheduledIrrigations.map(x => <CardZone key={x} scheduledIrrigation={x} />)}
                {scheduledIrrigations.length == 0 ? "No schedules have been added at the moment please add a new one" : ""}
            </div>

        </div>
    )
}