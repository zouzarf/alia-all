import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import client from "./mqtt_c";

export default function Mixer({ masterEvent }: { masterEvent: string }) {
    const [mixValue, setMixValue] = useState(1);

    return (
        <FormControl>
            <TextField
                id="standard-basic"
                label="Mix (min)"
                type="number"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccessTimeIcon />
                        </InputAdornment>
                    ),
                }}
                value={mixValue}
                onChange={(event) => {
                    const value = event.target.value;
                    setMixValue(parseInt(value));
                }}
            />

            <Button
                variant="contained"
                disabled={masterEvent !== "IDLE"}
                onClick={() => {
                    if (mixValue > 0) {
                        client.publish(
                            "master_command",
                            JSON.stringify({ command: "MIX", value: mixValue })
                        );
                        setMixValue(0);
                    }
                }}
            >
                Mix
            </Button>
            <Button
                variant="contained"
                disabled={masterEvent !== "MIX"}
                onClick={() => {
                    client.publish(
                        "master_command",
                        JSON.stringify({ command: "STOP_MIX", value: "0" })
                    );
                }}
            >
                Stop mixing
            </Button>
        </FormControl>
    );
}
