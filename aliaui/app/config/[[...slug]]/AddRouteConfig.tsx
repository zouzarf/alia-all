import React, { useState } from "react";
import Button from '@mui/material/Button';

export default function AddRouteConfig() {
  const [nameValue, setName] = useState("");
  const [sbcPortValue, setsbcPort] = useState("");
  const [relayPortValue, setrelayPort] = useState("");




  return (
    <tr>
      <td>
        <select name="pets" id="pet-select">
          <option value="">--Please choose an option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
          <option value="goldfish">Goldfish</option>
        </select>
      </td>
      <td>
        <select name="pets" id="pet-select">
          <option value="">--Please choose an option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
          <option value="goldfish">Goldfish</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          min="1"
          max="5"
          required
          minLength={0}
          maxLength={10}
          value={sbcPortValue}
          size={10}
          onChange={(e) => setsbcPort(e.target.value)}
        />{" "}
      </td>
      <td>
        <input
          type="number"
          min="1"
          max="4"
          required
          minLength={0}
          maxLength={10}
          value={relayPortValue}
          size={10}
          onChange={(e) => setrelayPort(e.target.value)}
        />{" "}
      </td>
      <td>
        <Button variant="contained" color="success" >
          ADD
        </Button>

      </td>
    </tr>
  );
}
