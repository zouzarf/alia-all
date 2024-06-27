"use client"
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import TimeRange from 'react-time-range';
import TextField from '@mui/material/TextField';
import { Button, Paper } from "@mui/material";
import { insertScheduler } from "@/lib/schedulerActions";
import TimePicker from "react-time-picker";
import { daily_schedule_actions } from '@prisma/client'



export default function Scheduler() {
    const [zone, setZone] = useState("0");
    const [scheduleName, setScheduleName] = useState("Schedule X");
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [dailyActions, setDailyActions] = useState<daily_schedule_actions[]>([]);

    const [time, setTime] = useState(0);
    const [waterLevel, setWaterLevel] = useState(0);
    const [doseNumber, setDoseNumber] = useState(0);
    const [mixingTime, setMixingTime] = useState(0);
    const [compressingTime, setCompressingTime] = useState(0);
    const [routingTime, setRoutingTime] = useState(0);

    return (
        <div className='App'>

            <Paper>
                <h1>Scheduler</h1>
                <input type="text" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} />
                <FloatingLabel controlId="floatingSelect" label="Selected Zone">
                    <Form.Select onChange={(e) => setZone(e.target.value)} value={zone}>
                        <option value="0">Zone 1</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                </FloatingLabel>
                <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={(e) => {
                        console.log(e); setSelectionRange({
                            key: 'selection',
                            startDate: new Date(e['selection']['startDate']!),
                            endDate: new Date(e['selection']['endDate']!)
                        })
                    }}
                />

                {dailyActions.map(x => {
                    return (<>
                        {x.hour} Û {x.water_level} Û {x.dose_number} Û {x.routing_time} Û {x.mixing_time} Û {x.compressing_time}
                    </>)
                })}
                <input aria-label="Time" type="number" value={time} onChange={(e) => { setTime(parseInt(e.target.value)) }} />
                <TextField type="number" id="outlined-basic" label="Amount of water (L)" variant="outlined" value={waterLevel} onChange={(e) => { setWaterLevel(parseInt(e.target.value)) }} />
                <TextField type="number" id="outlined-basic" label="Dose number" variant="outlined" value={doseNumber} onChange={(e) => { setDoseNumber(parseInt(e.target.value)) }} />
                <TextField type="number" id="outlined-basic" label="Mixing pumps(minutes)" variant="outlined" value={mixingTime} onChange={(e) => { setMixingTime(parseInt(e.target.value)) }} />
                <TextField type="number" id="outlined-basic" label="Routing Pumps timer(minutes)" variant="outlined" value={routingTime} onChange={(e) => { setRoutingTime(parseInt(e.target.value)) }} />
                <TextField type="number" id="outlined-basic" label="Compressor timer (minutes)" variant="outlined" value={compressingTime} onChange={(e) => { setCompressingTime(parseInt(e.target.value)) }} />
                <Button variant="contained" color="success" onClick={
                    () => {
                        setDailyActions(oldArray => [...oldArray, {
                            id: 0,
                            schedule_id: 0,
                            hour: time,
                            water_level: waterLevel,
                            dose_number: doseNumber,
                            mixing_time: mixingTime,
                            routing_time: routingTime,
                            compressing_time: compressingTime
                        }])
                    }
                }>
                    ADD
                </Button>
                <Button variant="contained" color="success" onClick={() => {
                    insertScheduler(
                        {
                            id: 0,
                            name: scheduleName,
                            zone_id: parseInt(zone),
                            start_date: selectionRange.startDate,
                            end_date: selectionRange.endDate
                        },
                        dailyActions
                    )
                }}>
                    Confirm
                </Button>
            </Paper>
        </div>
    )
}