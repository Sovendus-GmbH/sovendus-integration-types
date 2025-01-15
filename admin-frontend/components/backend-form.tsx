"use client";

import { BarChart2, Gift, ShoppingBagIcon } from "lucide-react";
import type { JSX } from "react";
import React, { useState } from "react";

import {
  EnabledOptimizeCountries,
  EnabledVoucherNetworkCountries,
  type SovendusAppSettings,
} from "../../settings/app-settings";
import { SovendusCheckoutProducts } from "./checkout-products";
import { ConfigurationDialog } from "./confirmation-dialog";
import { Notification } from "./notification";
import { SovendusOptimize } from "./optimize";
import { ProductCard } from "./product-card";
import { Alert, AlertDescription } from "./ui/alert";
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

export const DEMO_REQUEST_URL =
  "https://online.sovendus.com/kontakt/demo-tour-kontaktformular/#";

export default function SovendusBackendForm({
  currentStoredSettings: _currentStoredSettings,
  saveSettings,
  additionalSteps,
}: SovendusBackendFormProps): JSX.Element {
  const [currentStoredSettings, setCurrentStoredSettings] =
    useState<SovendusAppSettings>(_currentStoredSettings);
  const [currentSettings, setCurrentSettings] = useState<SovendusAppSettings>(
    currentStoredSettings,
  );
  const [activeConfig, setActiveConfig] = useState<
    "voucherNetwork" | "optimize" | "checkoutProducts" | null
  >(null);
  const [notificationState, setNotificationState] = useState<{
    message: string;
    type: "success" | "error" | "loading";
  } | null>(null);

  const handleSave = async (open: boolean): Promise<void> => {
    if (!open) {
      const hasUnsavedChanges =
        JSON.stringify(currentSettings) !==
        JSON.stringify(currentStoredSettings);
      try {
        if (hasUnsavedChanges) {
          setNotificationState({
            message: "Saving settings...",
            type: "loading",
          });
          const updatedSettings = await saveSettings(currentSettings);
          setCurrentStoredSettings(updatedSettings);
          setCurrentSettings(updatedSettings);
          setNotificationState({
            message: "Settings saved successfully",
            type: "success",
          });
        }
        setActiveConfig(null);
      } catch (error) {
        setNotificationState({
          message: `Failed to save settings, error: ${error?.message || JSON.stringify(error)}`,
          type: "error",
        });
      }
    }
  };

  const getVoucherNetworkStatus = (): {
    active: boolean;
    details: JSX.Element;
  } => {
    const enabledCountries = Object.entries(
      currentSettings.voucherNetwork.countries,
    )
      .filter(([_, country]) =>
        Object.values(country.languages).some((lang) => lang.isEnabled),
      )
      .map(([code]) => code);

    const isActive = enabledCountries.length > 0;

    return {
      active: isActive,
      details: (
        <EnabledVoucherNetworkCountries
          currentSettings={currentSettings.voucherNetwork}
        />
      ),
    };
  };

  const getOptimizeStatus = (): {
    active: boolean;
    details: React.JSX.Element;
  } => {
    const isGlobalEnabled =
      currentSettings.optimize.useGlobalId &&
      currentSettings.optimize.globalEnabled;
    const enabledCountries = Object.entries(
      currentSettings.optimize.countrySpecificIds,
    )
      .filter(([_, data]) => data.isEnabled)
      .map(([code]) => code);

    const isActive = isGlobalEnabled || enabledCountries.length > 0;

    return {
      active: isActive,
      details: (
        <EnabledOptimizeCountries currentSettings={currentSettings.optimize} />
      ),
    };
  };

  const getCheckoutProductsStatus = (): {
    active: boolean;
    details: React.JSX.Element;
  } => {
    return {
      active: currentSettings.checkoutProducts,
      details: (
        <p>
          {currentSettings.checkoutProducts
            ? "Ready to receive traffic from partner shops."
            : "Not active"}
        </p>
      ),
    };
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Sovendus App</h1>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-700 font-semibold">
          <strong>Important:</strong> Welcome to your Sovendus configuration
          dashboard. To get started or make changes to your setup, please
          contact Sovendus for a personalized demo and configuration process.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <ProductCard
          title="Voucher Network & Checkout Benefits"
          description="Drive sales with post-purchase vouchers and earn revenue from partner offers"
          icon={<Gift className="h-6 w-6 text-blue-500" />}
          // status={getVoucherNetworkStatus()}
          status={getVoucherNetworkStatus()}
          metrics={[
            { label: "Network Reach", value: "7M+" },
            { label: "Partner Shops", value: "2,300+" },
            { label: "Available Countries", value: "16" },
          ]}
          onConfigure={(): void => setActiveConfig("voucherNetwork")}
          requestDemoHref={DEMO_REQUEST_URL}
        />

        <ProductCard
          title="Optimize"
          description="Boost conversions with intelligent on-site optimization"
          icon={<BarChart2 className="h-6 w-6 text-green-500" />}
          status={getOptimizeStatus()}
          metrics={[
            { label: "Conversion Boost", value: "10%" },
            { label: "Bounce Rate Reduction", value: "5%" },
            { label: "Newsletter Sign-up Boost ", value: "15%" },
          ]}
          onConfigure={(): void => setActiveConfig("optimize")}
          requestDemoHref={DEMO_REQUEST_URL}
        />

        <ProductCard
          title="Checkout Products"
          description="Receive high-quality traffic from partner shops"
          icon={<ShoppingBagIcon className="h-6 w-6 text-purple-500" />}
          status={getCheckoutProductsStatus()}
          metrics={[
            { label: "Annual Orders", value: "3.6M+" },
            { label: "Conversion Rate", value: "1-3%" },
            { label: "Ad Impressions", value: "185M+" },
          ]}
          onConfigure={(): void => setActiveConfig("checkoutProducts")}
          requestDemoHref={DEMO_REQUEST_URL}
        />
      </div>
      {notificationState && (
        <Notification
          message={notificationState.message}
          type={notificationState.type}
        />
      )}
      <ConfigurationDialog
        open={activeConfig === "voucherNetwork"}
        onOpenChange={(open): void => void handleSave(open)}
        title="Configure Voucher Network & Checkout Benefits"
      >
        <SovendusVoucherNetwork
          currentSettings={currentSettings.voucherNetwork}
          setCurrentSettings={setCurrentSettings}
          additionalSteps={additionalSteps?.voucherNetwork}
        />
      </ConfigurationDialog>

      <ConfigurationDialog
        open={activeConfig === "optimize"}
        onOpenChange={(open): void => void handleSave(open)}
        title="Configure Optimize"
      >
        <SovendusOptimize
          currentOptimizeSettings={currentSettings.optimize}
          savedOptimizeSettings={currentStoredSettings.optimize}
          setCurrentSettings={setCurrentSettings}
          additionalSteps={additionalSteps?.optimize}
        />
      </ConfigurationDialog>

      <ConfigurationDialog
        open={activeConfig === "checkoutProducts"}
        onOpenChange={(open): void => void handleSave(open)}
        title="Configure Checkout Products"
      >
        <SovendusCheckoutProducts
          enabled={currentSettings.checkoutProducts}
          setCurrentSettings={setCurrentSettings}
          additionalSteps={additionalSteps?.checkoutProducts}
        />
      </ConfigurationDialog>
    </div>
  );
}
