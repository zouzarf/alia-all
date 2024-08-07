"use client"
import { CircularProgress, Divider, Paper } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import WaterTank from "./waterTank";
import ReservoirFiller from "./reservoirFillter";
import Dosing from "./doser";
import Mixer from "./mixer";
import Routing from "./routing";
import client from './mqtt_c';

export default function Home() {
  const [zonesList, setzonesList] = React.useState([]);
  const [waterValue, setwaterValue] = React.useState(0);
  const [masterEvent, setmasterEvent] = React.useState("NULL");
  useEffect(() => {
    client.on('message', function (topic, message) {
      if (topic === "water_level") {
        setwaterValue(parseFloat(message.toString()));
      }
      else if (topic === "config") {
        setzonesList(JSON.parse(message.toString()).zones);
      }
      else if (topic === "master_event") {
        setmasterEvent(message.toString());
      }
      else {
        console.log("Weird message:" + topic + "" + message);
      }
    })
    client.on('disconnect', function () {
      console.log('DISCONNECTION');
    });
    client.on('offline', function () {
      console.log('OFFLINE');
    });
    client.on('close', () => console.log('disconnected', new Date()));
    client.on('error', err => console.error('error', err));
  }, []);
  return (
    <Paper><div className="flex flex-col">
      <h2 className="text-center">
        State: {masterEvent} {masterEvent === "MIX" ? (<CircularProgress size="20px" />) : <div />}
      </h2>
      <WaterTank waterValue={waterValue} mixing={masterEvent === "MIX"} />

      <Divider />
      <h2 className="text-center">
        Manual Controls
      </h2>
      <div className='flex flex-row content-start justify-center gap-4'>
        <ReservoirFiller masterEvent={masterEvent} current_value={waterValue} />
        <Dosing masterEvent={masterEvent} />
        <Mixer masterEvent={masterEvent} />
        <Routing zones={zonesList} masterEvent={masterEvent} />
      </div>
    </div>
    </Paper>
  );
}