import React, { useState } from "react";
import Button from '@mui/material/Button';

export default function AddRouterConfig() {
  const [nameValue, setName] = useState("");

  return (
    <><td>
      <input
        type="text"
        name="sbc"
        value={""}
      />
    </td>
      <td>
        <input
          type="text"
          min="0"
          max="5"
          name="sbc"
          value={""}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="3"
          name="relay"
          value={""}
          size={10}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="3"
          name="relay"
          value={""}
          size={10}
        />
      </td>
      <td>
        <input
          type="checkbox"
          min="0"
          max="3"
          name="relay"
          checked={false}
          size={10}
        />
      </td>
      <td colSpan={4}>
        <Button variant="contained" color="error">
          DELETE
        </Button>
      </td>
    </>
  );
}
