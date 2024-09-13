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
            key: "module_name",
            label: "Module",
        },
        {
            key: "log_level",
            label: "Level",
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
                    ds.ts?.toISOString().toString()
                );
            case "producer":
                return (
                    ds.producer
                );
            case "module_name":
                return (
                    ds.module_name
                );
            case "log_level":
                return ds.log_level;
            case "message":
                return (
                    ds.log_message
                );
            default:
                return ds.id;
        }
    }, []);
    const renderColor = React.useCallback((ds: logs) => {

        switch (ds.log_level) {
            case "ERROR":
                return (
                    "text-red-700"
                );
            default:
                return "text-green-500";
        }
    }, []);
    return (
        <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={logs}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell><p className={renderColor(item)}>{renderCell(item, columnKey)}</p></TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}