import "./app.css";

import React from "react";

import SovendusBackendForm from "./components/backend-form";
import type { SovendusFormDataType } from "./sovendus-app-types";

interface SovendusSettingsProps {
  currentStoredSettings: SovendusFormDataType;
  saveSettings: (data: SovendusFormDataType) => Promise<SovendusFormDataType>;
}

export function SovendusSettings({
  currentStoredSettings,
  saveSettings,
}: SovendusSettingsProps): JSX.Element {
  console.log("sovendusSettings", currentStoredSettings);
  return (
    <SovendusBackendForm
      currentStoredSettings={currentStoredSettings}
      saveSettings={saveSettings}
    />
  );
}
