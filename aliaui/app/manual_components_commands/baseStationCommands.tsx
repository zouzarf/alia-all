import { base_station_ports } from "@prisma/client";
import { useState } from "react";
import { handleComponentCommand } from "./command";

async function handleClick(component: string, command: string) {
    const res = await fetch('http://127.0.0.1:8000/' + component + '/' + command, { cache: 'no-store' });
    const data = await res.json();
    console.log(data);
}

export default function BaseStationCommands({ bs_config }: { bs_config: base_station_ports[] }) {

    const [waterSensor, setWaterSensor] = useState(0.0)
    return (


        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Component
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Command
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {bs_config.filter(b => b.name != "WATERSENSOR").sort((a, b) => (a.name <= b.name ? -1 : 1)).map(c => (
                        <tr key={c.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {c.name}
                            </th>
                            <td className="px-6 py-4">
                                <button
                                    type="button"
                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    onClick={async () => {
                                        try {
                                            const data = await handleComponentCommand(c.name, "activate");
                                            console.log('Success:', data);
                                        } catch (error) {
                                            console.error('Click handler error:', error);
                                        }
                                    }}
                                >
                                    Activate
                                </button>
                                <button type="button"
                                    className="focus:outline-none 
                                text-white bg-red-700 hover:bg-red-800 
                                focus:ring-4 focus:ring-red-300 font-medium rounded-lg 
                                text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 
                                dark:focus:ring-red-900"
                                    onClick={async () => {
                                        try {
                                            const data = await handleComponentCommand(c.name, "deactivate");
                                            console.log('Success:', data);
                                        } catch (error) {
                                            console.error('Click handler error:', error);
                                        }
                                    }}
                                >
                                    Deactivate
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>

    )
}