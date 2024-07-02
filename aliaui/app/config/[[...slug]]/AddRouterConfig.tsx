import React, { useState } from "react";
import Button from '@mui/material/Button';
import { Checkbox, Input, Select } from "@nextui-org/react";

export default function AddRouterConfig() {
  const [nameValue, setName] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          type="text"
          label="Router Name"
          value={nameValue}
          labelPlacement="outside"
          onChange={(e) => {
            console.log(e)
            setName(e.target.value);
          }}
        />
        <Input
          type="text"
          min={0}
          max={5}
          label="Serial Number"
          labelPlacement="outside"
        />
        <Input
          min={0}
          max={5}
          type="number"
          label="Router SbcPort"
          labelPlacement="outside"
        />
        <Input
          min={0}
          max={5}
          type="number"
          label="Router Hub Port"
          labelPlacement="outside"
        />
        <Checkbox defaultSelected size="sm">Base Sation</Checkbox>


      </div>
      <Button color="success">
        Add
      </Button>
    </div>
  );
}
