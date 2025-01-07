import React from "react";
import SovendusBackendForm from "./components/backend-form";
import { SovendusFormDataType } from "./sovendus-app-types";

export interface SovendusSettingsType {}

interface SovendusSettingsProps {
  currentStoredSettings: SovendusFormDataType;
  saveSettings: (data: SovendusFormDataType) => Promise<SovendusFormDataType>;
}

export function SovendusSettings({
  currentStoredSettings,
  saveSettings,
}: SovendusSettingsProps) {
  console.log("sovendusSettings", currentStoredSettings);
  return (
    <SovendusBackendForm
      currentStoredSettings={currentStoredSettings}
      saveSettings={saveSettings}
    />
  );
}
