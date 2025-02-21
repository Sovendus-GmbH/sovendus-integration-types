import "./app.css";

import type { JSX } from "react";
import type { SovendusAppSettings } from "sovendus-integration-types";

import { SovendusBackendForm } from "./components/backend-form";

export interface SovendusSettingsProps {
  currentStoredSettings: SovendusAppSettings;
  saveSettings: (data: SovendusAppSettings) => Promise<SovendusAppSettings>;
  zoomedVersion?: boolean;
}

export function SovendusSettings({
  currentStoredSettings,
  saveSettings,
  zoomedVersion = false,
}: SovendusSettingsProps): JSX.Element {
  return (
    <SovendusBackendForm
      currentStoredSettings={currentStoredSettings}
      saveSettings={saveSettings}
      zoomedVersion={zoomedVersion}
    />
  );
}
