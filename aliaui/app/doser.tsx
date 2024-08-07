import React, { useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import client from "./mqtt_c";
import BalanceIcon from "@mui/icons-material/Balance";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Button, Input } from "@nextui-org/react";

export default function Dosing({ masterEvent }: { masterEvent: string }) {
    const [doseValue, setDoseValue] = useState(0);
    const [doserValue, setDoserValue] = useState("");

    return (
        <div className="flex flex-col" >
            <Input
                id="outlined-number"
                label="Dose (mL)"
                type="number"
                value={doseValue.toString()}
                onChange={(event) => {
                    const value = event.target.value;
                    setDoseValue(parseInt(value));
                }}
            />
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={doserValue}
                label="Doser"
                onChange={(event) => {
                    const value = event.target.value;
                    setDoserValue(value);
                }}
            >
                <MenuItem key="0" value="0">
                    DOSE 1
                </MenuItem>
                <MenuItem key="1" value="1">
                    DOSE 2
                </MenuItem>
                <MenuItem key="2" value="2">
                    DOSE 3
                </MenuItem>
                <MenuItem key="3" value="3">
                    DOSE 4
                </MenuItem>
            </Select>
            <Button
                color="default"
                disabled={masterEvent !== "IDLE"}
                onClick={() => {
                    if (doseValue > 0) {
                        client.publish(
                            "master_command",
                            JSON.stringify({
                                command: "DOSE",
                                value: doseValue.toString() + "/" + doserValue.toString(),
                            })
                        );
                        setDoseValue(0);
                    }
                }}
            >
                Add
            </Button>
            <Button
                color="default"
                disabled={masterEvent !== "DOSE"}
                onClick={() => {
                    client.publish(
                        "master_command",
                        JSON.stringify({ command: "STOP_DOSE", value: "0" })
                    );
                }}
            >
                Stop adding
            </Button>
        </div>
    );
}
