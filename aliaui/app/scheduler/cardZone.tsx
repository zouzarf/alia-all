import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { irrigation, events_logs, zones, Prisma } from "@prisma/client";
import { Avatar } from "@nextui-org/react";
import prisma from "@/lib/db";
import { DateTime } from "luxon";
import { readScheduleStatistics } from "@/lib/schedulerActions";
import CardModal from "./cardModal";

interface scheduleStats {
    name: string
    zones: string[]
    todoCount: number;
    notTodoCount: number;
    minDate: Date | null;
    maxDate: Date | null;
    nextIrrigation: Date | null;
    schedule: {
        hour: number;
        minute: number,
        water_level: number,
        dose_1: number,
        dose_2: number,
        dose_3: number,
        dose_4: number,
        mixing_time: number,
        routing_time: number,
        compressing_time: number;
    }[];
}

export default async function CardZone({ scheduledIrrigation }: { scheduledIrrigation: string }) {
    const scheduleStats = await readScheduleStatistics(scheduledIrrigation)
    const irrigations = await prisma.irrigation.findMany({ where: { schedule_name: scheduledIrrigation } })
    const nextIrrigationTime = DateTime.fromJSDate(scheduleStats.nextIrrigation!).diff(DateTime.now(), ['hours', 'minutes'])
    const pastIrrigationTime = DateTime.now().diff(DateTime.fromJSDate(scheduleStats.pastIrrigation!), ['hours', 'minutes'])
    return (
        <>


            <Card className="max-w-[340px]">
                <CardHeader className="justify-between">
                    <div className="flex gap-5">
                        <Avatar
                            isBordered
                            radius="full"
                            size="md"
                            src="./icon.png"
                        />
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">{scheduledIrrigation}</h4>
                        </div>
                    </div>
                    <CardModal irrigations={irrigations} scheduleStats={scheduleStats} />
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                    <p>Next irrigation in {nextIrrigationTime.hours} hours, {nextIrrigationTime.minutes.toFixed(0)} minutes</p>
                    <p>Last irrigation {pastIrrigationTime.hours} hours, {pastIrrigationTime.minutes.toFixed(0)} minutes ago</p>
                    <span className="pt-2">
                        <p>From {DateTime.fromJSDate(scheduleStats.minDate!).toFormat('dd-LL-yyyy hh:mm ZZZZ')}</p>
                        <p>To {DateTime.fromJSDate(scheduleStats.maxDate!).toFormat('dd-LL-yyyy hh:mm ZZZZ')} </p>
                    </span>
                </CardBody>
                <CardFooter className="gap-3">
                    <div className="flex flex-col">
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">{scheduleStats.todoCount}</p>
                            <p className=" text-default-400 text-small">Irrigations to come</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">{scheduleStats.notTodoCount}</p>
                            <p className="text-default-400 text-small">Irrigations done</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">{scheduleStats.totalWaterConsumed}</p>
                            <p className="text-default-400 text-small">litters consumed</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">{scheduleStats.totalWaterConsumed}</p>
                            <p className="text-default-400 text-small">Zones</p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </>

    )
}