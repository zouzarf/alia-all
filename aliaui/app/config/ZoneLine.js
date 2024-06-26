import React from "react";
import Button from '@mui/material/Button';

export default function ZoneLineConfig(props) {

  const zoneName = props.zoneName;
  const updateZonesData = props.fetchZonesData;


  return (
    <tr>
      <td>{zoneName}</td>
      <td>
      <Button variant="contained" color="error">
        DELETE
        </Button>
      </td>
    </tr>
  );
}
