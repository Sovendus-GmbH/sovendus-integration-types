import { BarChart2, Gift, ShoppingBagIcon } from "lucide-react";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";
import type { SovendusAppSettings } from "sovendus-integration-types";

import { cn } from "../lib/utils";
import { SovendusCheckoutProducts } from "./checkout-products";
import { ConfigurationDialog } from "./confirmation-dialog";
import { Notification } from "./notification";
import { SovendusOptimize } from "./optimize";
import { EnabledOptimizeCountries } from "./optimize-country-options";
import { ProductCard } from "./product-card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { SovendusVoucherNetwork } from "./voucher-network";
import { EnabledVoucherNetworkCountries } from "./voucher-network-country-options";

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
  zoomedVersion?: boolean;
}

export const DEMO_REQUEST_URL =
  "https://online.sovendus.com/kontakt/demo-tour-kontaktformular/#";

export default function SovendusBackendForm({
  currentStoredSettings: _currentStoredSettings,
  saveSettings,
  additionalSteps,
  zoomedVersion = false,
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
  useSettingsSaveOnLoad(saveSettings, currentStoredSettings);
  const buttonsDisabled = notificationState?.type === "loading";
  const handleSave = async (open: boolean): Promise<void> => {
    if (!open) {
      const hasUnsavedChanges =
        JSON.stringify(currentSettings) !==
        JSON.stringify(currentStoredSettings);
      const prevActiveConfig = activeConfig;
      try {
        setActiveConfig(null);
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
      } catch (error) {
        setActiveConfig(prevActiveConfig);
        setNotificationState({
          message: `Failed to save settings, error: ${
            (error as Error)?.message || JSON.stringify(error)
          }`,
          type: "error",
        });
      }
    }
  };

  const getVoucherNetworkStatus = (): {
    active: boolean;
    details: JSX.Element;
  } => {
    const enabledCountries =
      currentSettings.voucherNetwork?.countries?.ids &&
      Object.entries(currentSettings.voucherNetwork.countries.ids)
        .filter(
          ([_, country]) =>
            country.languages &&
            Object.values(country.languages).some((lang) => lang.isEnabled),
        )
        .map(([code]) => code);

    const isActive = enabledCountries?.length
      ? enabledCountries.length > 0
      : false;

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
      currentSettings.optimize?.simple?.optimizeId &&
      currentSettings.optimize?.simple?.isEnabled;
    const enabledCountries =
      currentSettings.optimize.countries &&
      Object.entries(currentSettings.optimize.countries.ids)
        .filter(([_, data]) => data.isEnabled)
        .map(([code]) => code);

    const isActive =
      isGlobalEnabled ||
      (enabledCountries?.length && enabledCountries.length > 0) ||
      false;

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
        <p
          className={cn(
            "text-sm",
            currentSettings.checkoutProducts
              ? "text-green-600"
              : "text-red-600",
          )}
        >
          {currentSettings.checkoutProducts
            ? "Ready to receive traffic from partner shops."
            : "Not active"}
        </p>
      ),
    };
  };

  return (
    <div
      className={cn("container mx-auto p-6 space-y-8", {
        zoomed: zoomedVersion,
      })}
    >
      <div className={cn("flex justify-between items-center")}>
        <h1 className={cn("text-4xl font-bold")}>Sovendus App</h1>
      </div>

      <Alert className={cn("bg-blue-50 border-blue-200")}>
        <AlertTitle className={cn("text-blue-700 font-semibold")}>
          <strong>Welcome to your Sovendus configuration dashboard.</strong>
        </AlertTitle>
        <AlertDescription className={cn("text-blue-700 font-semibold")}>
          To get started or make changes to your setup, please contact Sovendus
          for a personalized demo and configuration process.
        </AlertDescription>
      </Alert>

      <div className={cn("grid gap-6")}>
        <ProductCard
          title="Voucher Network & Checkout Benefits"
          description="Drive sales with post-purchase vouchers and earn revenue from partner offers"
          icon={<Gift className={cn("h-6 w-6 text-blue-500")} />}
          status={getVoucherNetworkStatus()}
          buttonsDisabled={buttonsDisabled}
          metrics={[
            { label: "Network Reach", value: "7M+" },
            { label: "Partner Shops", value: "2,300+" },
            { label: "Available Countries", value: "14" },
          ]}
          onConfigure={(): void => setActiveConfig("voucherNetwork")}
          requestDemoHref={DEMO_REQUEST_URL}
        />

        <ProductCard
          title="Optimize"
          description="Boost conversions with intelligent on-site optimization"
          icon={<BarChart2 className={cn("h-6 w-6 text-green-500")} />}
          status={getOptimizeStatus()}
          buttonsDisabled={buttonsDisabled}
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
          description="Reach 24 million potential customers a month with your product"
          icon={<ShoppingBagIcon className={cn("h-6 w-6 text-purple-500")} />}
          status={getCheckoutProductsStatus()}
          buttonsDisabled={buttonsDisabled}
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
        zoomedVersion={zoomedVersion}
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
        zoomedVersion={zoomedVersion}
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
        zoomedVersion={zoomedVersion}
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

function useSettingsSaveOnLoad(
  saveSettings: (data: SovendusAppSettings) => Promise<SovendusAppSettings>,
  currentStoredSettings: SovendusAppSettings,
): void {
  useEffect(() => {
    // Save settings in case there any settings migrations
    if (
      currentStoredSettings.optimize ||
      currentStoredSettings.voucherNetwork ||
      currentStoredSettings.checkoutProducts
    ) {
      void saveSettings(currentStoredSettings);
    }
  }, []);
}
