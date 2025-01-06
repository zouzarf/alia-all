import { events_logs, irrigation } from "@prisma/client"

export default function EventsTimeLine({ irrigations }: { irrigations: irrigation[] }) {
    const eventz = irrigations.map(e => <Event key={e.id} irrigation={e} />)
    return (
        <div className="flex bg-white">
            <div className="space-y-6 border-l-2 border-dashed">
                {eventz}
            </div>
        </div>
    )
}

function Event({ irrigation }: { irrigation: irrigation }) {

    return (<div className="relative w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full text-blue-500">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
        </svg>
        <div className="ml-6">
            <h4 className="font-bold text-blue-500">Execution of : {irrigation.date.toISOString()}</h4>
            <p className="mt-2 max-w-screen-sm text-sm text-gray-500">Start time: {irrigation.process_start?.toUTCString()}</p>
            <p className="mt-2 max-w-screen-sm text-sm text-gray-500">End time: {irrigation.process_end?.toUTCString()}</p>
            <span className="mt-1 block text-sm font-semibold text-blue-500">Time: {formatTime((irrigation.process_end!.getTime() - irrigation.process_start!.getTime()) / 1000)}s</span>
        </div>
    </div>)

}
function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = parseInt((seconds % 60).toFixed(0));

    // Constructing the formatted time
    let formattedTime = '';

    if (hours > 0) {
        formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
        formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    if (remainingSeconds > 0 || formattedTime === '') { // Always show seconds if no other part exists
        formattedTime += `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`;
    }

    return formattedTime.trim();
}