"use client";

import { useState, useMemo } from "react";

import { InfoCircledIcon } from "@radix-ui/react-icons";

import type { SovendusFormDataType } from "~/sovendus-plugins-commons/admin-frontend/sovendus-app-types";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SovendusVoucherNetwork } from "./voucher-network";
import { SovendusOptimize } from "./optimize";
import { SovendusCheckoutProducts } from "./checkout-products";
import {
  optimizeCountries,
  OptimizeCountryCode,
  voucherNetworkCountries,
  VoucherNetworkCountryCode,
} from "./form-types";

export default function SovendusBackendForm({
  currentStoredSettings,
  saveSettings,
}: {
  currentStoredSettings: SovendusFormDataType;
  saveSettings: (data: SovendusFormDataType) => Promise<SovendusFormDataType>;
}) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentSettings, setCurrentSettings] =
    useState<SovendusFormDataType>(currentStoredSettings);
  const [savedSettings, setSavedSettings] =
    useState<SovendusFormDataType>(currentStoredSettings);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(savedSettings) !== JSON.stringify(currentSettings);
  }, [currentSettings, savedSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const confirmedSettings = await saveSettings(currentSettings);
      setSavedSettings(confirmedSettings);
      setNotification("Your Sovendus settings have been successfully updated.");
    } catch (error) {
      setNotification(
        "An error occurred while saving your settings. Please try again."
      );
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const getEnabledVoucherNetworkCountries = () => {
    return Object.entries(savedSettings.voucherNetwork)
      .filter(
        ([countryKey, data]: [string, any]) =>
          data.isEnabled &&
          data.trafficSourceNumber &&
          data.trafficMediumNumber &&
          voucherNetworkCountries[countryKey as VoucherNetworkCountryCode]
      )
      .map(
        ([countryKey]) =>
          voucherNetworkCountries[countryKey as VoucherNetworkCountryCode]
      )
      .join(", ");
  };

  const getOptimizeStatus = () => {
    if (
      savedSettings.optimize.useGlobalId &&
      savedSettings.optimize.globalEnabled
    ) {
      return `Global ID: ${savedSettings.optimize.globalId}`;
    } else if (!savedSettings.optimize.useGlobalId) {
      const enabledCountries = Object.entries(
        savedSettings.optimize.countrySpecificIds
      )
        .filter(
          ([countryKey, data]: [string, any]) =>
            data.isEnabled &&
            data.id &&
            optimizeCountries[countryKey as OptimizeCountryCode]
        )
        .map(
          ([countryKey]) => optimizeCountries[countryKey as OptimizeCountryCode]
        )
        .join(", ");
      return enabledCountries
        ? `Enabled for: ${enabledCountries}`
        : "No countries enabled";
    } else {
      return "No countries enabled";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 items-center">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Sovendus Settings</h1>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-yellow-600 font-medium">Unsaved changes</span>
          )}
          {hasUnsavedChanges && (
            <Button onClick={handleSave} disabled={isSaving}>
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
              <p
                className={cn(
                  "text-sm",
                  Object.values(savedSettings.voucherNetwork).some(
                    (country: any) => country.isEnabled
                  )
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {Object.values(savedSettings.voucherNetwork).some(
                  (country: any) => country.isEnabled
                )
                  ? `Enabled for: ${getEnabledVoucherNetworkCountries()}`
                  : "No Countries Enabled"}
              </p>
            </div>
            <div>
              <h4 className="text-md">Optimize</h4>
              <p
                className={cn(
                  "text-sm",
                  (savedSettings.optimize.useGlobalId &&
                    savedSettings.optimize.globalEnabled) ||
                    (!savedSettings.optimize.useGlobalId &&
                      Object.values(
                        savedSettings.optimize.countrySpecificIds
                      ).some((country: any) => country.isEnabled))
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {getOptimizeStatus()}
              </p>
            </div>
            <div>
              <h4 className="text-md">Checkout Products</h4>
              <p
                className={cn(
                  "text-sm",
                  savedSettings.checkoutProducts
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {savedSettings.checkoutProducts ? "Enabled" : "Disabled"}
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
        </TabsList>
        <TabsContent value="voucherNetwork">
          <SovendusVoucherNetwork
            currentSettings={currentSettings.voucherNetwork}
            setCurrentSettings={setCurrentSettings}
          />
        </TabsContent>
        <TabsContent value="optimize">
          <SovendusOptimize
            currentOptimizeSettings={currentSettings.optimize}
            savedOptimizeSettings={savedSettings.optimize}
            setCurrentSettings={setCurrentSettings}
          />
        </TabsContent>
        <TabsContent value="checkoutProducts">
          <SovendusCheckoutProducts
            enabled={currentSettings.checkoutProducts}
            setCurrentSettings={setCurrentSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
