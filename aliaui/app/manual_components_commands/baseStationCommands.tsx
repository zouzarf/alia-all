import { base_station_ports } from "@prisma/client";

export default function BaseStationCommands({ bs_config }: { bs_config: base_station_ports[] }) {
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
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            WATER LEVEL
                        </th>
                        <td className="px-6 py-4">
                            X.12L
                        </td>
                    </tr>
                    {bs_config.filter(b => b.name != "WATERSENSOR").toSorted((a, b) => (a.name <= b.name ? -1 : 1)).map(c => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {c.name}
                            </th>
                            <td className="px-6 py-4">
                                <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Activate
                                </button>
                                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
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