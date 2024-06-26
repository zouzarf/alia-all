"use client"
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import TimeRange from 'react-time-range';
import TextField from '@mui/material/TextField';
import { Paper } from "@mui/material";


export default function Scheduler() {
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [timeRange, setTimeRange] = useState({
        startTime: new Date(),
        endTime: new Date()
    });

    return (
        <div className='App'>

            <Paper>
                <h1>Scheduler</h1>
                <FloatingLabel controlId="floatingSelect" label="Selected Zone">
                    <Form.Select aria-label="Selected zone" onChange={(e) => console.log(e.target.value)}>
                        <option value="1">Zone 1</option>
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
                <TimeRange
                    startMoment={timeRange.startTime}
                    endMoment={timeRange.endTime}
                    onChange={(e: any) => console.log(e)}
                />

                <TextField id="outlined-basic" label="Frequency(mins)" variant="outlined" />
                <TextField id="outlined-basic" label="Amount of water (level)" variant="outlined" />
                <TextField id="outlined-basic" label="Dose number" variant="outlined" />
                <TextField id="outlined-basic" label="Mixing minutes" variant="outlined" />
            </Paper>
        </div>
    )
}