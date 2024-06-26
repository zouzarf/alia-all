import React, { useState } from "react";
import Button from '@mui/material/Button';

export default function AddRouterConfig(props) {
  const [nameValue, setName] = useState("");

  const updateRoutersData = props.fetchRoutersData;

  const addRouterName = () => {
    fetch(
      "http://localhost:8000/add-router/" +
        nameValue +
        "/" +
        0 +
        "/" +
        0
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
    <div>
      <p>
        New router -- SN:{" "}
        <input
          type="text"
          id=""
          name="sbc"
          required
          minlength="0"
          maxlength="10"
          value={nameValue}
          size="10"
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" color="success" onClick={(e) => addRouterName()}>
        ADD
        </Button>
      </p>
    </div>
  );
}
