import React from "react";
import AddRouteConfig from "./AddRouteConfig";
import Table from "react-bootstrap/Table";
import Button from '@mui/material/Button';
import { routes } from '@prisma/client'

export default function RouteDiv({ routes }: { routes: routes }) {
    const from = routes.from;
    const to = routes.to;
    const portMicro = routes.pump_microprocessor_port;
    const portHub = routes.pump_hub_port;

    const routersList = (
        <tr>
            <td>
                {from}
            </td>
            <td>
                {to}
            </td>
            <td>
                <input
                    type="number"
                    min="0"
                    max="5"
                    name="sbc"
                    value={portMicro!}
                />
            </td>
            <td>
                <input
                    type="number"
                    min="0"
                    max="5"
                    name="sbc"
                    value={portHub!}
                />
            </td>
            <td colSpan={4}>
                <Button variant="contained" color="error">
                    DELETE
                </Button>
            </td>
        </tr>
    );

    return (
        <div
            style={{
                border: "2px solid green",
            }}
        >
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>FROM</th>
                        <th>TO</th>
                        <th>port Micro</th>
                        <th>port Hub</th>
                    </tr>
                </thead>
                <tbody>
                    {routersList}
                    <AddRouteConfig />
                </tbody>
            </Table>
        </div>
    );
}
