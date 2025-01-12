"use client";

import { BarChart2, Gift, ShoppingBagIcon, Users } from "lucide-react";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import type { SovendusAppSettings } from "../../settings/app-settings";
import {
  EnabledOptimizeCountries,
  EnabledVoucherNetworkCountries,
} from "../../settings/app-settings";
import { SovendusCheckoutProducts } from "./checkout-products";
import { ContactCTA } from "./contact-form";
import { SovendusOptimize } from "./optimize";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SovendusVoucherNetwork } from "./voucher-network";

export interface AdditionalStep {
  title: string;
  subSteps: string[];
}

export interface AdditionalSteps {
  checkoutProducts?: AdditionalStep;
  optimize?: AdditionalStep;
  voucherNetwork?: AdditionalStep;
}

interface SovendusBackendFormProps {
  currentStoredSettings: SovendusAppSettings;
  saveSettings: (data: SovendusAppSettings) => Promise<SovendusAppSettings>;
  additionalSteps?: AdditionalSteps;
}

export default function SovendusBackendForm({
  currentStoredSettings,
  saveSettings,
  additionalSteps,
}: SovendusBackendFormProps): JSX.Element {
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

  return (
    <div className="container mx-auto p-6 space-y-8 items-center">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Sovendus Revenue Booster</h1>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-yellow-600 font-medium">Unsaved changes</span>
          )}
          {hasUnsavedChanges && (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
          <CardTitle>Your Revenue Potential</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-lg font-semibold flex items-center">
                <Gift className="mr-2 h-5 w-5 text-blue-500" />
                Voucher Network & Checkout Benefits
              </h4>
              <EnabledVoucherNetworkCountries
                currentSettings={savedSettings.voucherNetwork}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-green-500" />
                Optimize
              </h4>
              <EnabledOptimizeCountries
                currentSettings={savedSettings.optimize}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold flex items-center">
                <ShoppingBagIcon className="mr-2 h-5 w-5 text-purple-500" />
                Checkout Products
              </h4>
              <p
                className={`text-sm ${
                  savedSettings.checkoutProducts
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {savedSettings.checkoutProducts ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Users className="h-4 w-4 mr-2 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Join our network of 2,300+ European partners and reach 7 million
          online shoppers monthly!
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="voucherNetwork" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="voucherNetwork">
            Voucher Network & Checkout Benefits
          </TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="checkoutProducts">Checkout Products</TabsTrigger>
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
      </Tabs>

      <ContactCTA />
    </div>
  );
}
