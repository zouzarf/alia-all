"use client";
import { Button, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import NewJob from "./NewJob";
import { daily_schedule_actions, schedules } from "@prisma/client";
import JobInfo from "./JobInfo";
import { readDailyActions } from "@/lib/schedulerActions";

export default function Body({ schedules }: { schedules: schedules[] }) {
    const [showForm, setShowForm] = React.useState(false)
    const [selectedJob, setSelectedJob] = React.useState(schedules[0].id)
    const [dailyAction, setDailyActions] = React.useState<daily_schedule_actions[]>()
    return (
        <div className="flex flex-row gap-x-5">
            <div className="basis-1/6">
                <Select
                    placeholder="Select a job"
                    selectionMode="single"
                    className="w-full"
                    selectedKeys={[selectedJob.toString()]}
                    onChange={async (e) => {
                        setShowForm(false);
                        setSelectedJob(parseInt(e.target.value));
                        setDailyActions(await readDailyActions(parseInt(e.target.value)))

                    }}
                >
                    {schedules.map((schedule) => (
                        <SelectItem key={schedule.id}>
                            {schedule.name}
                        </SelectItem>
                    ))}
                </Select>
                <Button className="w-full" color="success" onClick={() => { setShowForm(true) }}>
                    Add new job
                </Button>
            </div>
            <div className="basis-5/6">
                {showForm ? <NewJob /> : <JobInfo schedule={schedules.filter(s => s.id == selectedJob)[0]} dailyActions={dailyAction!} />}
            </div>
        </div>
    )
}