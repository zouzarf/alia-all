"use client"
import { Paper } from "@mui/material";
import React, { useEffect } from "react";
import { mqttConnecter } from "@/lib/mqttClient";
import { base_station_ports, general_config, routers, routes, zones } from "@prisma/client";
import { MqttClient } from "mqtt/*";
import BaseStationCommands from "./baseStationCommands";
import RouterCommands from "./RouterCommands";
import { bs } from "date-fns/locale";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())

export default function Body({ bs_config, router, routings, general_config, mqttIp }: { bs_config: base_station_ports[], router: routers[], routings: routes[], general_config: general_config[], mqttIp: string }) {
    const [activeTab, setActiveTab] = React.useState("base_station");
    const [client, setClient] = React.useState<MqttClient | null>(null)
    useEffect(() => {
        if (!client) {
            console.log("connecting")
            console.log(`client: ${client}`);
            const clientNv = mqttConnecter({ 'ip': mqttIp })
            setClient(clientNv);
            clientNv!.on('disconnect', function () {
                console.log('DISCONNECTION');
            });
            clientNv!.on('offline', function () {
                console.log('OFFLINE');
            });
            clientNv!.on('close', () => console.log('disconnected', new Date()));
            clientNv!.on('error', (err: any) => console.error('error', err));
        }
        return () => {
            // always clean up the effect if clientRef has a value
            if (client) {
                client!.end();
            }
        };
    }, []);

    const tabs = [
        {
            id: "base_station",
            label: "Base Station",
            "content": (<><BaseStationCommands mqttClient={client!} bs_config={bs_config} /></>)
        }].concat(router.map(r => {
            return {
                "id": r.name,
                "label": r.name,
                "content": (<> < RouterCommands mqttClient={client!} router={r} routings={routings} /></>)
            }
        }))
    return (
        <Paper>
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-styled-tab" data-tabs-toggle="#default-styled-tab-content" data-tabs-active-classes="text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500" data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300" role="tablist">
                    {tabs.map(
                        tab => (
                            <li key={tab.id} className="me-2" role="presentation">
                                <button
                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab == tab.id ? "text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500" : ""}`}
                                    id="profile-styled-tab"
                                    data-tabs-target="#styled-profile"
                                    type="button" role="tab" aria-controls="profile"
                                    aria-selected="true"
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        )
                    )}
                </ul>
            </div>
            <div id="default-styled-tab-content">
                <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
                    id="styled-profile" role="tabpanel" aria-labelledby="profile-tab">
                    {tabs.filter(r => r.id == activeTab)[0].content}
                </div>

            </div>
        </Paper>
    )
}