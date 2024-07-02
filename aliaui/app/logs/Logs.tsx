"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key } from "react";
import { logs } from "@prisma/client";

export default function Logs({ logs }: { logs: logs[] }) {
    const columns = [
        {
            key: "ts",
            label: "Timestamp",
        },
        {
            key: "producer",
            label: "Producer",
        },
        {
            key: "message",
            label: "Message",
        }
    ];
    const renderCell = React.useCallback((ds: logs, columnKey: Key) => {

        switch (columnKey) {
            case "ts":
                return (
                    ds.ts?.toString()
                );
            case "producter":
                return (
                    ds.producer
                );
            case "message":
                return (
                    ds.log_message
                );
            default:
                return ds.id;
        }
    }, []);
    return (<Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={logs}>
            {(item) => (
                <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
            )}
        </TableBody>
    </Table>)
}