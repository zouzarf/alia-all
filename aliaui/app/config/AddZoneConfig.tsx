import React from "react";
import Button from '@mui/material/Button';

export default function AddZoneConfig() {

  return (
    <tr>
      <td>
        <input
          type="text"
          name="sbc"
          required
          minLength={0}
          maxLength={10}
          size={10}
        />{" "}
      </td>

      <td>
        <Button variant="contained" color="success">
          ADD
        </Button>
      </td>
    </tr>
  );
}
