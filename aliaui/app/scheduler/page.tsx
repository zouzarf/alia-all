
import { readSchedules } from "@/lib/schedulerActions";
import Body from "./Body";
import { Paper } from "@mui/material";

export default async function ScheduleA() {

    const jobs = await readSchedules()

    return (
        <Paper>
            <Body schedules={jobs} />
        </Paper>
    )
}