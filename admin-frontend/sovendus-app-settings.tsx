import React from "react";

export interface SovendusSettingsType {}

interface SovendusSettingsProps {
  handleSettingsUpdate: (updatedSettings: any) => void;
  settings: SovendusSettingsType;
}

export function SovendusSettings({
  handleSettingsUpdate,
  settings,
}: SovendusSettingsProps) {
  console.log("sovendusSettings", settings);
  return <div>gdfgdfg</div>;
}
