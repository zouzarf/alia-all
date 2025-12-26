import { Card, CardHeader, CardBody, CardFooter, Divider, Progress, Chip } from "@nextui-org/react";
import { DateTime } from "luxon";
import { readScheduleStatistics } from "@/lib/schedulerActions";
import CardModal from "./cardModal";
import { Clock, Calendar, Droplets } from "lucide-react";
import prisma from "@/lib/db";

export default async function CardZone({ scheduledIrrigation }: { scheduledIrrigation: string }) {
    const stats = await readScheduleStatistics(scheduledIrrigation);
    const irrigations = await prisma.irrigation.findMany({ where: { schedule_name: scheduledIrrigation } });

    // Time Calculations
    const now = DateTime.now();
    const next = DateTime.fromJSDate(stats.nextIrrigation!);
    const past = DateTime.fromJSDate(stats.pastIrrigation!);

    const nextDiff = next.diff(now, ['hours', 'minutes']);
    const pastDiff = now.diff(past, ['hours', 'minutes']);

    // Progress percentage
    const total = stats.todoCount + stats.notTodoCount;
    const progressValue = total > 0 ? (stats.notTodoCount / total) * 100 : 0;

    return (
        <Card className="border-none bg-white dark:bg-default-50 shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex justify-between items-start px-5 pt-5">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Droplets size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-md font-bold text-default-800 leading-tight uppercase tracking-tight">
                            {scheduledIrrigation}
                        </h4>
                        <Chip size="sm" variant="dot" color="success" className="h-5 border-none px-0 text-[10px] font-bold">ACTIVE</Chip>
                    </div>
                </div>
                <CardModal irrigations={irrigations} scheduleStats={stats} />
            </CardHeader>

            <CardBody className="px-5 py-4 space-y-4">
                {/* Next Irrigation Highlight */}
                <div className="bg-default-100 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-xs font-bold text-default-600 uppercase">Next Cycle</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-600">
                        in {nextDiff.hours}h {nextDiff.minutes.toFixed(0)}m
                    </span>
                </div>
                <div className="bg-default-100 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-xs font-bold text-default-600 uppercase">Last Cycle</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-600">
                        {pastDiff.hours}h {pastDiff.minutes.toFixed(0)}m ago
                    </span>
                </div>

                {/* Progress Visual */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-default-400 uppercase">
                        <span>Cycle Completion</span>
                        <span>{progressValue.toFixed(0)}%</span>
                    </div>
                    <Progress
                        value={progressValue}
                        color="primary"
                        size="sm"
                        radius="full"
                        className="max-w-md"
                    />
                </div>

                {/* Date Range */}
                <div className="text-[10px] text-default-400 font-mono space-y-0.5 pt-2 border-t border-default-100">
                    <div className="flex items-center gap-1">
                        <Calendar size={10} /> START: {DateTime.fromJSDate(stats.minDate!).toFormat('dd LLL, HH:mm')}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={10} /> END: {DateTime.fromJSDate(stats.maxDate!).toFormat('dd LLL, HH:mm')}
                    </div>
                </div>
            </CardBody>

            <Divider />

            <CardFooter className="px-5 py-3 bg-default-50/50 justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] text-default-400 font-bold uppercase tracking-widest">Pending</span>
                    <span className="text-sm font-black text-default-700">{stats.todoCount}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-default-400 font-bold uppercase tracking-widest">Completed</span>
                    <span className="text-sm font-black text-green-600">{stats.notTodoCount}</span>
                </div>
            </CardFooter>
        </Card>
    );
}