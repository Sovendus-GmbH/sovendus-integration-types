"use client";

import React, { useState } from "react";
import { ShoppingBagIcon, BarChart2, Gift } from "lucide-react";

import { Alert, AlertDescription } from "./ui/alert";
import { SovendusAppSettings } from "../../settings/app-settings";
import { ProductCard } from "./product-card";
import { ConfigurationDialog } from "./confirmation-dialog";
import { SovendusVoucherNetwork } from "./voucher-network";
import { SovendusOptimize } from "./optimize";
import { SovendusCheckoutProducts } from "./checkout-products";

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

const DEMO_REQUEST_URL =
  "https://online.sovendus.com/kontakt/demo-tour-kontaktformular/#";

export default function SovendusBackendForm({
  currentStoredSettings,
  saveSettings,
  additionalSteps,
}: SovendusBackendFormProps): JSX.Element {
  const [currentSettings, setCurrentSettings] = useState<SovendusAppSettings>(
    currentStoredSettings,
  );
  const [activeConfig, setActiveConfig] = useState<
    "voucherNetwork" | "optimize" | "checkoutProducts" | null
  >(null);

  const handleSave = async () => {
    await saveSettings(currentSettings);
  };

  const getVoucherNetworkStatus = () => {
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
        <div className="space-y-2">
          {isActive ? (
            <>
              <p>Active in {enabledCountries.length} countries:</p>
              <ul className="list-disc list-inside text-sm">
                {enabledCountries.map((country) => (
                  <li key={country}>{country}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Not configured.</p>
          )}
        </div>
      ),
    };
  };

  const getOptimizeStatus = () => {
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
        <div className="space-y-2">
          {isActive ? (
            isGlobalEnabled ? (
              <p>
                Global optimization active (ID:{" "}
                {currentSettings.optimize.globalId})
              </p>
            ) : (
              <>
                <p>Active in {enabledCountries.length} countries:</p>
                <ul className="list-disc list-inside text-sm">
                  {enabledCountries.map((country) => (
                    <li key={country}>{country}</li>
                  ))}
                </ul>
              </>
            )
          ) : (
            <p>Not configured.</p>
          )}
        </div>
      ),
    };
  };

  const getCheckoutProductsStatus = () => {
    return {
      active: currentSettings.checkoutProducts,
      details: (
        <p>
          {currentSettings.checkoutProducts
            ? "Ready to receive traffic from partner shops. Contact Sovendus for full activation."
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
        <AlertDescription className="text-blue-700">
          Welcome to your Sovendus configuration dashboard. To get started or
          make changes to your setup, please contact Sovendus for a personalized
          demo and configuration process.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* <ProductCard
          title="Voucher Network & Checkout Benefits"
          description="Drive sales with post-purchase vouchers and earn revenue from partner offers"
          icon={<Gift className="h-6 w-6 text-blue-500" />}
          status={getVoucherNetworkStatus()}
          metrics={[
            { label: "Network Reach", value: "7M+" },
            { label: "Partner Shops", value: "2,300+" },
            { label: "Available Countries", value: "16" },
          ]}
          onConfigure={() => setActiveConfig("voucherNetwork")}
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
          onConfigure={() => setActiveConfig("optimize")}
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
          onConfigure={() => setActiveConfig("checkoutProducts")}
          requestDemoHref={DEMO_REQUEST_URL}
        /> */}
      </div>

      {/* <ConfigurationDialog
        open={activeConfig === "voucherNetwork"}
        onOpenChange={(open) => !open && setActiveConfig(null)}
        title="Configure Voucher Network & Checkout Benefits"
        onSave={handleSave}
        instructions="To set up or modify your Voucher Network and Checkout Benefits, please contact Sovendus for a personalized demo and configuration process. The settings below are for reference only."
      >
        <SovendusVoucherNetwork
          currentSettings={currentSettings.voucherNetwork}
          setCurrentSettings={setCurrentSettings}
          additionalSteps={additionalSteps?.voucherNetwork}
        />
      </ConfigurationDialog>

      <ConfigurationDialog
        open={activeConfig === "optimize"}
        onOpenChange={(open) => !open && setActiveConfig(null)}
        title="Configure Optimize"
        onSave={handleSave}
        instructions="To set up or modify your Optimize settings, please contact Sovendus for a personalized demo and configuration process. The settings below are for reference only."
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
        onOpenChange={(open) => !open && setActiveConfig(null)}
        title="Configure Checkout Products"
        onSave={handleSave}
        instructions="To enable Checkout Products, please contact Sovendus for a personalized demo and setup process. The setting below is for reference only."
      >
        <SovendusCheckoutProducts
          enabled={currentSettings.checkoutProducts}
          setCurrentSettings={setCurrentSettings}
          additionalSteps={additionalSteps?.checkoutProducts}
        />
      </ConfigurationDialog> */}
    </div>
  );
}
