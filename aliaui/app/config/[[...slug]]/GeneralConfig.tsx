import React from "react";
import { general_config } from '@prisma/client'
import GeneralConfigLine from "./GeneralConfigLine";

export default function GeneralConfig({ config }: { config: general_config[] }) {

  const jconfigLines = config.map(line => (
    <GeneralConfigLine
      config={line}
    />
  ));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">

        {jconfigLines}
      </div>
    </div>
  );
}
