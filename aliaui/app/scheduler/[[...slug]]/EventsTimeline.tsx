import { events_logs } from "@prisma/client"

export default function EventsTimeLine({ events }: { events: events_logs[] }) {
    const eventz = events.map(e => <Event key={e.action_id} event={e} />)
    return (
        <div className="flex bg-white">
            <div className="space-y-6 border-l-2 border-dashed">
                {eventz}
            </div>
        </div>
    )
}

function Event({ event }: { event: events_logs }) {

    return (<div className="relative w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full text-blue-500">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
        </svg>
        <div className="ml-6">
            <h4 className="font-bold text-blue-500">Job for time : {event.job_full_date?.toUTCString()}</h4>
            <p className="mt-2 max-w-screen-sm text-sm text-gray-500">Start time: {event.process_start?.toUTCString()} -- End time: {event.process_end?.toUTCString()}</p>
            <span className="mt-1 block text-sm font-semibold text-blue-500">Time: {(event.process_end!.getTime() - event.process_end!.getTime())}s</span>
        </div>
    </div>)

}