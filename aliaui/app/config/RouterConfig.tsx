"use client"
import React from "react";
import RouterDivConfig from "./routersDiv";
import AddRouterConfig from "./AddRouterConfig";
import { routers } from '@prisma/client'


export default function RouterConfig({ configRouters }: { configRouters: routers[] }) {
  const RoutersData = configRouters;

  const routersz = RoutersData.map((e) => (
    <RouterDivConfig
      router={e}
    />
  ));

  return (
    <div
      style={{
        border: "2px solid red",
        background: "#92A8D1",
        margin: "left 3000px",
      }}
    >
      {routersz}
      <AddRouterConfig />
    </div>
  );
}
