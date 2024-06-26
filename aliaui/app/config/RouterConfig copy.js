import React, { useState } from "react";
import RouterDivConfig from "./routersDiv";
import AddRouterConfig from "./AddRouterConfig";

export default function RouterConfig(props) {
  const RoutersData = props.RoutersData;
  const RoutersDataSetter = props.RoutersDataSetter;
  const ApiRouterUpdater = props.ApiRouterUpdater;
  const fetchRoutersData = props.fetchRoutersData;

  const routersz = RoutersData.map((e) => (
    <RouterDivConfig
      name={e["sn"]}
      RoutersData={RoutersData}
      RoutersDataSetter={RoutersDataSetter}
      ApiRouterUpdater={ApiRouterUpdater}
      fetchRoutersData={fetchRoutersData}
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
      <AddRouterConfig fetchRoutersData={fetchRoutersData} />
    </div>
  );
}
