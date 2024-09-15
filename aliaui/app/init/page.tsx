"use client"
import React, { useState } from "react";
import { general_config } from '@prisma/client'
import { Button, Input } from "@nextui-org/react";
import { generalConfig } from "@/lib/configActions";
import { init } from "@/lib/init";

export default function Init() {

    return (
        <div className="flex flex-col gap-4">

            <Button color="danger" onClick={() => { init() }} >Init all database</Button>
        </div>
    );
}