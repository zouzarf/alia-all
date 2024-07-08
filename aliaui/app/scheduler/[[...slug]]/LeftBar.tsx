"use client"
import { Paper } from "@mui/material"
import { Button, Select, SelectItem } from "@nextui-org/react"
import { jobs } from "@prisma/client"
import { useRouter } from "next/navigation";

export default function LeftBar({ jobs, selectJob }: { jobs: jobs[], selectJob: string }) {
    const rrouter = useRouter()
    return (
        <Paper>
            <Select
                placeholder="Select a job"
                color="default"
                selectionMode="single"
                className="w-full"
                selectedKeys={[selectJob]}
                onChange={(e) => {
                    rrouter.push(`/scheduler/${e.target.value}`)

                }}
            >
                {jobs.map((job) => (
                    <SelectItem key={job.id}>
                        {job.name}
                    </SelectItem>
                ))}
            </Select>
            <Button className="w-full" color="success" onClick={() => { rrouter.push(`/scheduler/new`) }}>
                Add new job
            </Button>
        </Paper>)

}