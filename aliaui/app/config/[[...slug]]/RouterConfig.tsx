"use client"
import React from "react";
import RouterDivConfig from "./RoutersDiv";
import AddRouterConfig from "./AddRouterConfig";
import { routers } from '@prisma/client'
import { Divider } from "@nextui-org/react";


export default function RouterConfig({ configRouters }: { configRouters: routers[] }) {
  const RoutersData = configRouters;

  const routersz = <RouterDivConfig
    router={configRouters}
  />;

  return (
    <div>
      {routersz}
      <Divider className="my-4" />
      <AddRouterConfig />
    </div>
  );
}
