"use client"
import { CircularProgress, Divider, Paper } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import WaterTank from "./waterTank";
import ReservoirFiller from "./reservoirFillter";
import Dosing from "./doser";
import Mixer from "./mixer";
import Routing from "./routing";
import useSWR from 'swr'
import { mqttConnecter } from "@/lib/mqttClient";
import { base_station_ports, general_config, zones } from "@prisma/client";
import { MqttClient } from "mqtt/*";

export default function Body({ zones, general_config, mqttIp }: { zones: zones[], general_config: general_config[], mqttIp: string }) {
    const water_conversion = parseFloat(general_config.filter(x => x.name == "WATER_VOLT_TO_L_CONVERSION")[0].value!)
    const water_offset = parseFloat(general_config.filter(x => x.name == "WATER_OFFSET_L")[0].value!)
    const waterMaxLevel = parseFloat(general_config.filter(x => x.name == "WATER_MAX_LEVEL")[0].value!)
    const [waterValue, setwaterValue] = React.useState(0);
    const [hubEvent, setHubEvent] = React.useState<string | null>(null);
    const client = React.useRef<MqttClient | null>(null)
    useEffect(() => {
        if (!client.current) {
            client.current = mqttConnecter({ 'ip': mqttIp });
            client.current?.on('message', function (topic: string, payload: Buffer) {
                if (topic === "sensors") {
                    setwaterValue(parseFloat(JSON.parse(payload.toString()).water_voltage) * water_conversion + water_offset);
                }
                else if (topic === "hub_response") {
                    setHubEvent(JSON.parse(payload.toString()).event);
                }
                else {
                    console.log("Weird message:" + topic + "" + payload);
                }
            })
            client.current?.on('disconnect', function () {
                console.log('DISCONNECTION');
            });
            client.current?.on('offline', function () {
                console.log('OFFLINE');
            });
            client.current?.on('close', () => console.log('disconnected', new Date()));
            client.current?.on('error', (err: any) => console.error('error', err));
        }
        console.log("connecting")
        return () => {
            // always clean up the effect if clientRef.current has a value
            if (client.current) {
                client.current.unsubscribe('test');
                client.current.end();
            }
        };
    }, []);
    return (
        <Paper>


            <div className="flex flex-row w-full gap-10 p-2">


                <div className='flex flex-col gap-10 w-full'>


                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Command
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Parameters
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Start
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Stop
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <ReservoirFiller hubEvent={hubEvent!} current_value={waterValue} mqttClient={client.current!} maxLevel={waterMaxLevel} />
                                <Dosing hubEvent={hubEvent!} mqttClient={client.current!} />
                                <Mixer hubEvent={hubEvent!} mqttClient={client.current!} />
                                <Routing zones={zones} hubEvent={hubEvent!} mqttClient={client.current!} />
                            </tbody>
                        </table>
                    </div>


                </div>
                <div className="flex flex-col">
                    <h2 className="text-center">
                        Water Tank {hubEvent!} {hubEvent === "processing" ? (<CircularProgress size="20px" />) : <></>}
                    </h2>
                    <WaterTank waterValue={waterValue} min={0} max={10} isMixing={hubEvent === "processing"} />
                </div>

            </div>
        </Paper>
    )
}