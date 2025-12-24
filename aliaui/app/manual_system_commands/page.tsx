"use client"
import React, { useState } from "react";
import { general_config } from '@prisma/client'
import { Button, Input } from "@nextui-org/react";
import { generalConfig } from "@/lib/configActions";
import { init } from "@/lib/init";
import { mqttConnecter } from "@/lib/mqttClient";
import useSWR from "swr";
import { ReloadDriver } from "@/lib/checkStatus";
export default function Init() {
    const [loading, setLoading] = useState(false);
    const [initalization, setInitalization] = useState(false);


    return (
        <>
            <div className="flex flex-col gap-4">
                {
                    initalization && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="text-white text-2xl">Reinitializing db...</div>
                        </div>
                    )
                }

                <Button color="danger" onClick={() => {
                    setInitalization(true);
                    init()
                }} >Init all database</Button>
            </div>
            <div className="flex flex-col gap-4">
                {
                    loading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="text-white text-2xl">Reloading driver...</div>
                        </div>
                    )
                }

                <Button color="warning" onClick={
                    async () => {
                        try {
                            setLoading(true);
                            const data = await ReloadDriver();
                            console.log('Success:', data);
                            setLoading(false)
                        } catch (error) {
                            console.error('Click handler error:', error);
                        }
                    }
                } >Reload driver</Button>
            </div>
        </>
    );
}