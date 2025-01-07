"use client";

import type { SetStateAction, Dispatch } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";

import { cn } from "../lib/utils";
import { CountryOptions } from "./optimize-country-options";
import {
  OptimizeSettingsFormType,
  SovendusFormDataType,
} from "../sovendus-app-types";
import { optimizeCountries, OptimizeCountryCode } from "./form-types";

interface SovendusOptimizeProps {
  currentOptimizeSettings: OptimizeSettingsFormType;
  savedOptimizeSettings: OptimizeSettingsFormType;
  setCurrentSettings: Dispatch<SetStateAction<SovendusFormDataType>>;
}

export function SovendusOptimize({
  currentOptimizeSettings,
  setCurrentSettings,
}: SovendusOptimizeProps) {
  const handleGlobalChange = (
    field: "globalId" | "globalEnabled",
    value: string | boolean
  ) => {
    setCurrentSettings((prevState) => ({
      ...prevState,
      optimize: {
        ...prevState.optimize,
        [field]: value,
      },
    }));
  };

  const handleGlobalOptimizeIdChange = (
    value: "global" | "country-specific"
  ) => {
    setCurrentSettings((prevState) => ({
      ...prevState,
      optimize: {
        ...prevState.optimize,
        useGlobalId: value === "global" ? true : false,
      },
    }));
  };

  const getSettingsSummary = () => {
    if (
      currentOptimizeSettings.useGlobalId &&
      currentOptimizeSettings.globalEnabled
    ) {
      return `Global Optimize ID: ${currentOptimizeSettings.globalId}`;
    } else if (!currentOptimizeSettings.useGlobalId) {
      const enabledCountries = Object.entries(
        currentOptimizeSettings.countrySpecificIds
      )
        .filter(([_, data]) => data.isEnabled)
        .map(([country]) => optimizeCountries[country as OptimizeCountryCode]);

      return enabledCountries.length > 0
        ? `Enabled for: ${enabledCountries.join(", ")}`
        : "No countries enabled";
    } else {
      return "No countries enabled";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Optimize Settings</h2>
      <p className="text-sm text-gray-500 mb-4">{getSettingsSummary()}</p>

      <h3 className="text-xl font-semibold mb-2">
        Getting Started with Sovendus Optimize
      </h3>
      <h4 className="text-lg font-semibold">
        1. Activate the Sovendus App Storefront Script
      </h4>
      <ol className="ml-4">
        <li>
          a. In your Shopify backend click on Online Store and then on Themes
        </li>
        <li>b. On your current theme click on Customize</li>
        <li>c. Click on App embeds on the left in the sidebar</li>
        <li>
          d. Enable the Storefront Script for the Sovendus App and click on save
        </li>
      </ol>
      <h4 className="text-lg font-semibold mb-2">
        2. Enter your ID's below and you're ready to go
      </h4>

      <Tabs
        defaultValue={
          currentOptimizeSettings.useGlobalId ? "global" : "country-specific"
        }
        onValueChange={(value) =>
          handleGlobalOptimizeIdChange(value as "global" | "country-specific")
        }
        className="border rounded-md"
      >
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger
            value="global"
            className={cn(
              "data-[state=active]:bg-green-100 data-[state=active]:text-green-800",
              "data-[state=active]:border-b-2"
            )}
          >
            Use Global Optimize ID
          </TabsTrigger>
          <TabsTrigger
            value="country-specific"
            className={cn(
              "data-[state=active]:bg-green-100 data-[state=active]:text-green-800",
              "data-[state=active]:border-b-2"
            )}
          >
            Country-specific Optimize ID's
          </TabsTrigger>
        </TabsList>
        <TabsContent value="global">
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="global-id-enabled"
                checked={currentOptimizeSettings.globalEnabled}
                onCheckedChange={(checked) =>
                  handleGlobalChange("globalEnabled", checked)
                }
              />
              <Label htmlFor="global-id-enabled">Enable Global ID</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="global-id">Global Optimize ID</Label>
              <Input
                id="global-id"
                value={currentOptimizeSettings.globalId}
                onChange={(e) => handleGlobalChange("globalId", e.target.value)}
                placeholder="Enter Global Optimize ID"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="country-specific">
          <div className="space-y-4 mt-4">
            <CountryOptions
              currentSettings={currentOptimizeSettings}
              setCurrentSettings={setCurrentSettings}
            />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
