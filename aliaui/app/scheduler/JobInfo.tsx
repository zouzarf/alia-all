import { readDailyActions } from "@/lib/schedulerActions";
import { Button, Table, TableColumn, TableHeader } from "@nextui-org/react";
import { daily_schedule_actions, schedules } from "@prisma/client";

export default function JobInfo({ schedule, dailyActions }: { schedule: schedules, dailyActions: daily_schedule_actions[] | undefined }) {



    return (
        <div>
            <p>{schedule.name}</p>
            <p>{schedule.zone_id}</p>
            <p>{schedule.start_date?.toUTCString()}</p>
            <p>{schedule.end_date?.toUTCString()}</p>
            <p>{dailyActions?.map(d => d.water_level)}</p>
            <Button color="danger"> Delete </Button>

        </div>

    )
}