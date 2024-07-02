import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import client from "./mqtt_c";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Button, Input } from "@nextui-org/react";

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
        <div className="flex flex-col">
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

            <Input
                id="outlined-number"
                label="Routing time (s)"
                type="number"
                value={routingTime.toString()}
                onChange={(event) => {
                    const value = event.target.value;
                    setRoutingTime(parseInt(value));
                }}
            />

            <Input
                id="outlined-number"
                label="Compression time (s)"
                type="number"
                value={compressingTime.toString()}
                onChange={(event) => {
                    const value = event.target.value;
                    setComressingTime(parseInt(value));
                }}
            />

            <Button
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
        </div>
    );
}
