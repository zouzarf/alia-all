import React, { useState } from "react";
import Button from '@mui/material/Button';

export default function RouteLineConfig(props) {
  const masterEvent = props.master_event;
  const [doseValue, setDoseValue] = useState(0);
  const [doserValue, setDoserValue] = useState("");

  const routerName = props.routerName;
  const routeName = props.routeName;
  const sbc_port = props.routePorts.split("/")[0];
  const relay_port = props.routePorts.split("/")[1];
  const updateRoutersData = props.fetchRoutersData;

  const deleteRouterLine = () => {
    fetch("http://localhost:8000/delete-route/" + routerName + "/" + routeName)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        updateRoutersData();
      });
  };

  return (
    <tr>
      <td>{routeName}</td>
      <td>{sbc_port}</td>
      <td>{relay_port}</td>
      <td>
      <Button variant="contained" color="error" onClick={(e) => deleteRouterLine()}>
        Delete
        </Button>
      </td>
    </tr>
  );
}
