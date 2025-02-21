"use client";

import type { JSX } from "react";
import { type SovendusAppSettings, Versions } from "sovendus-integration-types";

import { SovendusSettings } from "../sovendus-app-settings";

const initialSettings: SovendusAppSettings = {
  voucherNetwork: {
    settingType: undefined,
    cookieTracking: false,
  },
  optimize: {
    settingsType: undefined,
  },
  checkoutProducts: false,
  employeeBenefits: {
    isEnabled: false,
    addToSidebar: false,
    showWidgetOnDashboard: false,
  },
  version: Versions.THREE,
};

export default function Home(): JSX.Element {
  const saveSettings = async (
    newSettings: SovendusAppSettings,
  ): Promise<SovendusAppSettings> => {
    // wait for 1,5 seconds to simulate a real API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Saving settings:", newSettings);
    return newSettings;
  };

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Sovendus App Settings</h1>
      <SovendusSettings
        currentStoredSettings={initialSettings}
        saveSettings={saveSettings}
      />
    </main>
  );
}
