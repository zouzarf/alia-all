import React, { Key } from "react";
import RouteLineConfig from "./RouteLine";
import AddRouteConfig from "./AddRouteConfig";
import { routers } from '@prisma/client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button } from "@nextui-org/react";


export default function RouterDivConfig({ router }: { router: routers[] }) {
  const rows = router;

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "serial_number",
      label: "Serial Number",
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
      key: "main_station",
      label: "Connected to Base Station",
    },
    {
      key: "action",
      label: "Action",
    }
  ];
  const renderCell = React.useCallback((router: routers, columnKey: Key) => {

    switch (columnKey) {
      case "name":
        return (
          router.name
        );
      case "serial_number":
        return (
          router.serial_number
        );
      case "sbc_port":
        return (
          router.pump_microprocessor_port
        );
      case "hub_port":
        return (
          router.pump_hub_port
        );
      case "main_station":
        return (
          router.linked_to_base_station
        );
      case "action":
        return (
          <Button variant="bordered" color="danger">
            DELETE
          </Button>
        );
      default:
        return router.name;
    }
  }, []);

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
