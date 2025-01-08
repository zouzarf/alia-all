"use client"
import React, { useState } from "react";
import { general_config } from '@prisma/client'
import { Button, Input } from "@nextui-org/react";
import { generalConfig } from "@/lib/configActions";
import { init } from "@/lib/init";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function Init() {
    const { data, error } = useSWR("/api/config", fetcher);
    const client = mqttConnecter(data)
    const [loading, setLoading] = useState(false);


    return (
        <div className="flex flex-col gap-4">
            {
                loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="text-white text-2xl">Reinitializing db...</div>
                    </div>
                )
            }

            <Button color="danger" onClick={() => {
                setLoading(true);
                init()
                client?.publish(
                    "hub",
                    JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
                );
            }} >Init all database</Button>
        </div>
    );
}