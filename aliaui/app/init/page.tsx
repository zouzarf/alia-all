"use client"
import React, { useState } from "react";
import { general_config } from '@prisma/client'
import { Button, Input } from "@nextui-org/react";
import { generalConfig } from "@/lib/configActions";
import { init } from "@/lib/init";
import client from "../mqtt_c";

export default function Init() {

    return (
        <div className="flex flex-col gap-4">

            <Button color="danger" onClick={() => {
                init()
                client.publish(
                    "hub",
                    JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
                );
            }} >Init all database</Button>
        </div>
    );
}