import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import client from "./mqtt_c";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Routing({ zones, masterEvent }: { zones: string[], masterEvent: string }) {
    const listOfZones = zones.map((e) => (
        <MenuItem key={e} value={e}>
            {e}
        </MenuItem>
    ));
    const [zoneValue, setzoneValue] = useState("");
    const [routingTime, setRoutingTime] = useState(1);
    const [compressingTime, setComressingTime] = useState(1);

    return (
        <FormControl>
            <InputLabel id="demo-simple-select-filled-label">Target zone</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={zoneValue}
                label="Target zone"
                onChange={(event) => {
                    const value = event.target.value;
                    setzoneValue(value);
                }}
            >
                {listOfZones}
            </Select>

            <TextField
                id="outlined-number"
                label="Routing time (s)"
                type="number"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccessTimeIcon />
                        </InputAdornment>
                    ),
                }}
                value={routingTime}
                onChange={(event) => {
                    const value = event.target.value;
                    setRoutingTime(parseInt(value));
                }}
            />

            <TextField
                id="outlined-number"
                label="Compression time (s)"
                type="number"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccessTimeIcon />
                        </InputAdornment>
                    ),
                }}
                value={compressingTime}
                onChange={(event) => {
                    const value = event.target.value;
                    setComressingTime(parseInt(value));
                }}
            />

            <Button
                variant="contained"
                disabled={masterEvent === "ROUTING" || masterEvent !== "IDLE"}
                onClick={() => {
                    client.publish(
                        "master_command",
                        JSON.stringify({
                            command: "ROUTE",
                            value:
                                zoneValue +
                                "/" +
                                routingTime.toString() +
                                "/" +
                                compressingTime.toString(),
                        })
                    );
                    setzoneValue("");
                }}
            >
                Start Routing
            </Button>
            <Button
                variant="contained"
                disabled={masterEvent !== "ROUTING"}
                onClick={() => {
                    client.publish(
                        "master_command",
                        JSON.stringify({ command: "STOP_ROUTE", value: "0" })
                    );
                }}
            >
                Stop routing
            </Button>
        </FormControl>
    );
}
