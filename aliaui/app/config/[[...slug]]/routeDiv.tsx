import React, { Key } from "react";
import AddRouteConfig from "./AddRouteConfig";
import { routes } from '@prisma/client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button } from "@nextui-org/react";

export default function RouteDiv({ routes }: { routes: routes[] }) {
    const rows = routes;

    const columns = [
        {
            key: "src",
            label: "Source",
        },
        {
            key: "dst",
            label: "Destination",
        },
        {
            key: "sbc_port",
            label: "SBC Port",
        },
        {
            key: "hub_port",
            label: "Hub Port",
        },
        {
            key: "action",
            label: "Action",
        }
    ];
    const renderCell = React.useCallback((route: routes, columnKey: Key) => {

        switch (columnKey) {
            case "name":
                return (
                    route.src
                );
            case "serial_number":
                return (
                    route.dst
                );
            case "sbc_port":
                return (
                    route.valve_microprocessor_port
                );
            case "hub_port":
                return (
                    route.valve_hub_port
                );
            case "action":
                return (
                    <Button variant="bordered" color="danger">
                        DELETE
                    </Button>
                );
            default:
                return route.id;
        }
    }, []);

    return (
        <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
