"use client"

import React, { Key, useState, useCallback } from "react";
import { base_station_ports } from '@prisma/client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Tooltip } from "@nextui-org/react";
import { updateBaseStation } from "@/lib/configActions";
import { Cpu, Hash, Share2, Activity, Info } from "lucide-react";

export default function BaseStationConfig({ config }: { config: base_station_ports[] }) {

  const columns = [
    { key: "name", label: "COMPONENT SOURCE" },
    { key: "hub_port", label: "HUB PORT" },
    { key: "relay_channel", label: "RELAY CH" },
    { key: "sn", label: "SERIAL NUMBER" },
  ];

  const renderCell = useCallback((item: base_station_ports, columnKey: Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-8 h-8 rounded bg-default-100 flex items-center justify-center text-default-500">
              <Cpu size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight uppercase">
                {item.name.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] text-default-400 font-mono">ID: {item.name.toLowerCase()}</span>
            </div>
          </div>
        );
      case "hub_port":
        return <ConfigInput config={item} field="hub_port" initialValue={item.hub_port} min={0} max={5} />;
      case "relay_channel":
        return <ConfigInput config={item} field="relay_channel" initialValue={item.relay_channel} min={0} max={5} />;
      case "sn":
        return <ConfigInput config={item} field="hub_serial_number" initialValue={item.hub_serial_number} isLong />;
      default:
        return item.name;
    }
  }, []);

  return (
    <div className="w-full border border-default-200 rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <Table
        aria-label="High Density Hardware Config"
        removeWrapper
        selectionMode="none"
        classNames={{
          th: "bg-default-50 text-default-500 text-tiny font-bold uppercase py-3 border-b border-default-200",
          td: "py-2 px-4 border-b border-default-100 last:border-none",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={config}>
          {(item) => (
            <TableRow key={item.name} className="hover:bg-default-50/50 transition-colors">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ConfigInput({ config, field, initialValue, min, max, isLong }: any) {
  const [val, setVal] = useState(initialValue);

  return (
    <Input
      type="number"
      size="sm"
      variant="bordered"
      min={min}
      max={max}
      value={val?.toString() ?? "0"}
      disabled={initialValue === null}
      onWheel={(e) => (e.target as HTMLInputElement).blur()}
      onChange={(e) => {
        const v = e.target.value === "" ? 0 : parseInt(e.target.value);
        setVal(v);
        updateBaseStation(config.name, { [field]: v });
      }}
      classNames={{
        base: isLong ? "max-w-[180px]" : "max-w-[80px]",
        input: "font-mono text-xs text-center",
        inputWrapper: "h-8 min-h-unit-8 px-2 border-default-200 bg-white dark:bg-default-100 hover:border-primary focus-within:!border-primary transition-all shadow-none"
      }}
    />
  );
}