"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { actions } from "@prisma/client";
import React from "react";
import { Key } from "react";

export default function DailyActionsTable({ dailyActions }: { dailyActions: actions[] }) {
    const rows = dailyActions;

    const columns = [
        {
            key: "hour",
            label: "Hour",
        },
        {
            key: "water_level",
            label: "Amount of water",
        },
        {
            key: "dose_number",
            label: "Dose number",
        },
        {
            key: "dose_amount",
            label: "Dose Amount",
        },
        {
            key: "mixing_time",
            label: "Mixing timer",
        },

        {
            key: "routing_time",
            label: "Routing Timer",
        },

        {
            key: "Compression timer",
            label: "Action",
        },

        {
            key: "action",
            label: "Action",
        }
    ];
    const renderCell = React.useCallback((ds: actions, columnKey: Key) => {

        switch (columnKey) {
            case "hour":
                return (
                    ds.hour
                );
            case "water_level":
                return (
                    ds.water_level
                );
            case "dose_number":
                return (
                    ds.dose_number
                );
            case "dose_amount":
                return (
                    ds.dose_amount
                );
            case "routing_time":
                return (
                    ds.routing_time
                );
            case "compressing_time":
                return (
                    ds.compressing_time
                );
            case "action":
                return (
                    ""
                );
            default:
                return ds.id;
        }
    }, []);

    return (
        <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
                {(item) => (
                    <TableRow key={item.id.toString()}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>)
}