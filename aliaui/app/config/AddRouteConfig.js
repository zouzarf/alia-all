import React, { useState } from "react";
import Button from '@mui/material/Button';

export default function AddRouteConfig(props) {
  const [nameValue, setName] = useState("");
  const [sbcPortValue, setsbcPort] = useState("");
  const [relayPortValue, setrelayPort] = useState("");

  const routerName = props.routerName;
  const updateRoutersData = props.fetchRoutersData;

  const addRouterName = () => {
    fetch(
      "http://localhost:8000/add-route/" +
        routerName +
        "/" +
        nameValue +
        "/" +
        sbcPortValue +
        "/" +
        relayPortValue
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        updateRoutersData();
      });
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          name="sbc"
          required
          minlength="0"
          maxlength="10"
          value={nameValue}
          size="10"
          onChange={(e) => setName(e.target.value)}
        />{" "}
      </td>
      <td>
        <input
          type="number"
          min="1"
          max="5"
          required
          minlength="0"
          maxlength="10"
          value={sbcPortValue}
          size="10"
          onChange={(e) => setsbcPort(e.target.value)}
        />{" "}
      </td>
      <td>
        <input
          type="number"
          min="1"
          max="4"
          required
          minlength="0"
          maxlength="10"
          value={relayPortValue}
          size="10"
          onChange={(e) => setrelayPort(e.target.value)}
        />{" "}
      </td>
      <td>
      <Button variant="contained" color="success" onClick={(e) => addRouterName()}>
        ADD
        </Button>

      </td>
    </tr>
  );
}
