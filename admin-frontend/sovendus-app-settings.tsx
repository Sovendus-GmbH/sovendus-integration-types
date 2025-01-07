import "./app.css";

import React from "react";

import type { SovendusAppSettings } from "../settings/app-settings";
import SovendusBackendForm from "./components/backend-form";

interface SovendusSettingsProps {
  currentStoredSettings: SovendusAppSettings;
  saveSettings: (data: SovendusAppSettings) => Promise<SovendusAppSettings>;
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
