
import prisma from "@/lib/db";
import CardZone from "./cardZone";
import { Button, Divider } from "@nextui-org/react";
import Link from "next/link";
import { PlusCircle, LayoutDashboard, Droplets } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function ScheduleA() {
    const scheduledIrrigations = (await prisma.irrigation.findMany({
        distinct: ["schedule_name"]
    })).map(x => x.schedule_name);

    return (
        <div className="p-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg text-white shadow-lg shadow-blue-200">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">System Overview</h1>
                        <p className="text-default-500 text-tiny uppercase tracking-widest font-semibold">Active Irrigation Schedules</p>
                    </div>
                </div>

                <Button
                    as={Link}
                    href="./scheduler/new"
                    color="primary"
                    variant="shadow"
                    className="font-bold"
                    startContent={<PlusCircle size={20} />}
                >
                    Create New Schedule
                </Button>
            </div>

            <Divider />

            {/* Grid for Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {scheduledIrrigations.length > 0 ? (
                    scheduledIrrigations.map(x => <CardZone key={x} scheduledIrrigation={x} />)
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-default-200 rounded-3xl">
                        <Droplets className="mx-auto text-default-200 mb-4" size={48} />
                        <p className="text-default-400 font-medium">No irrigation schedules found.</p>
                        <p className="text-default-300 text-small">Add a new schedule to begin water routing.</p>
                    </div>
                )}
            </div>
        </div>
    )
}