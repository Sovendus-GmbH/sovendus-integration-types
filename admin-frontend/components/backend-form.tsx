"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import type {
  ConsentSettings,
  SovendusAppSettings,
} from "../../settings/app-settings";
import {
  EnabledOptimizeCountries,
  EnabledVoucherNetworkCountries,
} from "../../settings/app-settings";
import { cn } from "../lib/utils";
import { SovendusCheckoutProducts } from "./checkout-products";
import { SovendusOptimize } from "./optimize";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { predefinedConsentScripts } from "./user-consent";
import { SovendusVoucherNetwork } from "./voucher-network";

export interface AdditionalStep {
  title: string;
  subSteps: string[];
}

export default function SovendusBackendForm({
  currentStoredSettings,
  saveSettings,
  additionalSteps,
}: {
  currentStoredSettings: SovendusAppSettings;
  saveSettings: (data: SovendusAppSettings) => Promise<SovendusAppSettings>;
  additionalSteps?: {
    checkoutProducts: AdditionalStep;
    optimize: AdditionalStep;
    voucherNetwork: AdditionalStep;
  };
}): JSX.Element {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentSettings, setCurrentSettings] = useState<SovendusAppSettings>(
    currentStoredSettings,
  );
  const [savedSettings, setSavedSettings] = useState<SovendusAppSettings>(
    currentStoredSettings,
  );

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(savedSettings) !== JSON.stringify(currentSettings);
  }, [currentSettings, savedSettings]);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const confirmedSettings = await saveSettings(currentSettings);
      setSavedSettings(confirmedSettings);
      setNotification("Your Sovendus settings have been successfully updated.");
    } catch (error) {
      setNotification(
        "An error occurred while saving your settings. Please try again.",
      );
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };
  const handleUserConsentChange = (
    product: string,
    type: "custom" | "predefined",
    script: string,
  ): void => {
    setCurrentSettings((prevState) => ({
      ...prevState,
      userConsentSettings: {
        ...prevState.userConsentSettings,
        [product]: { type, script },
      },
    }));
  };
  return (
    <div className="container mx-auto p-6 space-y-8 items-center">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Sovendus App Settings</h1>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-yellow-600 font-medium">Unsaved changes</span>
          )}
          {hasUnsavedChanges && (
            <Button
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      {notification && (
        <Alert>
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Overview of Sovendus integration states</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-md">Voucher Network</h4>
              <EnabledVoucherNetworkCountries
                currentSettings={savedSettings.voucherNetwork}
              />
            </div>
            <div>
              <h4 className="text-md">Optimize</h4>
              <EnabledOptimizeCountries
                currentSettings={savedSettings.optimize}
              />
            </div>
            <div>
              <h4 className="text-md">Checkout Products</h4>
              <p
                className={cn(
                  "text-sm",
                  savedSettings.checkoutProducts
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {savedSettings.checkoutProducts ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div>
              <h4 className="text-md">User Consent</h4>
              <p className="text-sm">
                {savedSettings.userConsentSettings &&
                Object.keys(savedSettings.userConsentSettings)?.length
                  ? "Consent scripts configured"
                  : "No consent scripts configured"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="mb-4">
        <InfoCircledIcon className="h-4 w-4 mr-2" />
        <AlertDescription>
          If you need help with your Sovendus integration, please get in touch
          with your Sovendus contact.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="voucherNetwork" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="voucherNetwork">Voucher Network</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="checkoutProducts">Checkout Products</TabsTrigger>
          <TabsTrigger value="userConsent">Consent</TabsTrigger>
        </TabsList>
        <TabsContent value="voucherNetwork">
          <SovendusVoucherNetwork
            currentSettings={currentSettings.voucherNetwork}
            setCurrentSettings={setCurrentSettings}
            additionalSteps={additionalSteps?.voucherNetwork}
          />
        </TabsContent>
        <TabsContent value="optimize">
          <SovendusOptimize
            currentOptimizeSettings={currentSettings.optimize}
            savedOptimizeSettings={savedSettings.optimize}
            setCurrentSettings={setCurrentSettings}
            additionalSteps={additionalSteps?.optimize}
          />
        </TabsContent>
        <TabsContent value="checkoutProducts">
          <SovendusCheckoutProducts
            enabled={currentSettings.checkoutProducts}
            setCurrentSettings={setCurrentSettings}
            additionalSteps={additionalSteps?.checkoutProducts}
          />
        </TabsContent>
        <TabsContent value="userConsent">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
              User Consent Settings
            </h2>
            {/* Example UI for user consent */}

            <div className="flex flex-col space-y-2 border-b pb-4 mb-4">
              <label className="font-medium">Consent Fn</label>
              <div className="flex items-center space-x-4">
                <select
                  className="border p-1 rounded"
                  value={currentSettings.userConsentSettings?.key}
                  onChange={(e): void =>
                    setCurrentSettings((prev) => ({
                      ...prev,
                      userConsentSettings: predefinedConsentScripts.find(
                        (script: ConsentSettings) => {
                          return script.key === e.target.value;
                        },
                      ) as ConsentSettings,
                    }))
                  }
                >
                  {predefinedConsentScripts.map((script: ConsentSettings) => (
                    <option key={script.key} value={script.key}>
                      {script.title}
                    </option>
                  ))}
                </select>
                {/* // TODO add code editor here to edit current script */}
                {/* edits on existing scripts will saved as a new script */}
                {/*  */}
              </div>
            </div>

            {/* A way to add new consent entries */}
            <button
              className="px-3 py-2 rounded-md bg-primary text-white"
              onClick={(): void =>
                setCurrentSettings((prev) => ({
                  ...prev,
                  userConsentSettings: predefinedConsentScripts[0],
                }))
              }
            >
              Add New Consent Script
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
