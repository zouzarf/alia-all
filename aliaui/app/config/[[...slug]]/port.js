import React, { useState } from 'react';

import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import client from './mqtt';
import BalanceIcon from '@mui/icons-material/Balance';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

export default function Dosing(props) {
    const masterEvent = props.master_event
    const [doseValue, setDoseValue] = useState(0);
    const [doserValue, setDoserValue] = useState("");

    return (
      <FormControl >
        
        <TextField id="outlined-number" 
        label="Dosing value (mL)" 
        type="number" pattern="\d*" variant="standard" InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BalanceIcon />
            </InputAdornment>
          ),
        }} value ={doseValue} onChange={(event)=>{
            const value  = event.target.value
            setDoseValue(value)
        }} />
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={doserValue}
          label="Doser"
          onChange={
              (event) => {
                const value  = event.target.value
                setDoserValue(value)
              }
          }
        >
          <MenuItem key="0" value="0">DOSE 1</MenuItem>
          <MenuItem key="1" value="1">DOSE 2</MenuItem>
          <MenuItem key="2" value="2">DOSE 3</MenuItem>
          <MenuItem key="3" value="3">DOSE 4</MenuItem>
        </Select>
        <Button variant="contained" disabled={masterEvent !== "IDLE"} onClick={() => {
            if (doseValue > 0 ) {
                client.publish('master_command', JSON.stringify({ command:'DOSE' , value: doseValue.toString()+"/"+doserValue.toString() }));
                setDoseValue(0)
                }
        }}
        >Add</Button>
        <Button variant="contained" disabled={masterEvent !== "DOSE"} onClick={() => {
          client.publish('master_command', JSON.stringify({ command:'STOP_DOSE' , value: "0" }));
        }}
        >Stop adding</Button>
      </FormControl>
    )
  
  }