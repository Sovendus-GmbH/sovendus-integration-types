"use client";

import { motion } from "framer-motion";
import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import type {
  OptimizeSettings,
  SovendusAppSettings,
} from "../../settings/app-settings";
import { EnabledOptimizeCountries } from "../../settings/app-settings";
import { cn } from "../lib/utils";
import type { AdditionalStep } from "./backend-form";
import { CountryOptions } from "./optimize-country-options";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AdditionalSteps } from "./voucher-network";

interface SovendusOptimizeProps {
  currentOptimizeSettings: OptimizeSettings;
  savedOptimizeSettings: OptimizeSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps: AdditionalStep | undefined;
}

export function SovendusOptimize({
  currentOptimizeSettings,
  setCurrentSettings,
  additionalSteps,
}: SovendusOptimizeProps): JSX.Element {
  const handleGlobalChange = (
    field: "globalId" | "globalEnabled",
    value: string | boolean,
  ): void => {
    setCurrentSettings((prevState) => ({
      ...prevState,
      optimize: {
        ...prevState.optimize,
        [field]: value,
      },
    }));
  };

  const handleGlobalOptimizeIdChange = (
    value: "global" | "country-specific",
  ): void => {
    setCurrentSettings((prevState) => ({
      ...prevState,
      optimize: {
        ...prevState.optimize,
        useGlobalId: value === "global" ? true : false,
      },
    }));
  };
  let lastStep = 2;
  if (additionalSteps) {
    lastStep = 3;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Optimize Settings</h2>
      <EnabledOptimizeCountries currentSettings={currentOptimizeSettings} />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="step1">
          <AccordionTrigger>
            Step 1: Get in touch with Sovendus
          </AccordionTrigger>
          <AccordionContent>
            <p>
              If you don't have the necessary setup, please get in touch with
              your Sovendus representative.
            </p>
            {/* <ContactForm /> */}
          </AccordionContent>
        </AccordionItem>
        <AdditionalSteps additionalSteps={additionalSteps} />
        <AccordionItem value={`step${lastStep}`}>
          <AccordionTrigger>Step {lastStep}: Enter your ID's</AccordionTrigger>
          <AccordionContent>
            <Tabs
              defaultValue={
                currentOptimizeSettings.useGlobalId
                  ? "global"
                  : "country-specific"
              }
              onValueChange={(value): void =>
                handleGlobalOptimizeIdChange(
                  value as "global" | "country-specific",
                )
              }
              className="border rounded-md"
            >
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger
                  value="global"
                  className={cn(
                    "data-[state=active]:bg-green-100 data-[state=active]:text-green-800",
                    "data-[state=active]:border-b-2",
                  )}
                >
                  Use Global Optimize ID
                </TabsTrigger>
                <TabsTrigger
                  value="country-specific"
                  className={cn(
                    "data-[state=active]:bg-green-100 data-[state=active]:text-green-800",
                    "data-[state=active]:border-b-2",
                  )}
                >
                  Country-specific Optimize ID's
                </TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="p-4">
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="global-id-enabled"
                      checked={currentOptimizeSettings.globalEnabled}
                      onCheckedChange={(checked): void =>
                        handleGlobalChange("globalEnabled", checked)
                      }
                    />
                    <Label htmlFor="global-id-enabled">Enable Global ID</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global-id">Global Optimize ID</Label>
                    <Input
                      id="global-id"
                      value={currentOptimizeSettings.globalId || ""}
                      onChange={(e): void =>
                        handleGlobalChange("globalId", e.target.value)
                      }
                      placeholder="Enter Global Optimize ID"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="country-specific" className="p-4">
                <div className="space-y-4 mt-4">
                  <CountryOptions
                    currentSettings={currentOptimizeSettings}
                    setCurrentSettings={setCurrentSettings}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
