"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Cog,
  Globe,
  ShoppingCart,
  Target,
  Users,
  Zap,
} from "lucide-react";
import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import type {
  OptimizeSettings,
  SovendusAppSettings,
} from "../../settings/app-settings";
import { EnabledOptimizeCountries } from "../../settings/app-settings";
import type { CountryCodes } from "../../settings/sovendus-countries";
import { COUNTRIES } from "../../settings/sovendus-countries";
import type { AdditionalStep } from "./backend-form";
import { CountryOptions } from "./optimize-country-options";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold mb-4">
        Optimize: Supercharge Your Conversions
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Transform passive visitors into active customers and reduce bounce rates
        with Sovendus Optimize. Boost your conversion rates and build long-term
        customer relationships.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-red-500" />
              Precision Targeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Deliver the right offer to the right customer at the perfect
              moment, based on user behavior and traffic sources.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-blue-500" />
              Data-Driven Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Leverage advanced analytics to continuously improve your
              performance and understand customer behavior.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-green-500" />
              Seamless Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Easy copy/paste integration into any online shop, with customized
              design to match your brand.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4">Key Benefits</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Increase conversion rates by up to 10%</li>
          <li>Reduce cart abandonment by 5%</li>
          <li>Boost newsletter sign-ups by 15%</li>
          <li>Performance-based pricing with no hidden costs</li>
          <li>No minimum contract duration</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-purple-500" />
              Reduce Cart Abandonment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Detect potential cart abandonment and offer incentives or email
              reminders to complete the purchase.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Lower Bounce Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Engage users with targeted overlays and attractive offers to keep
              them on your site longer.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-indigo-500" />
              Solve Customer Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Understand and address customer concerns in real-time with
              tailored solutions and support.
            </p>
          </CardContent>
        </Card>
      </div>

      <EnabledOptimizeCountries currentSettings={currentOptimizeSettings} />

      <Accordion type="single" collapsible className="w-full mt-8">
        <AccordionItem
          value="optimize-settings"
          className="border-2 border-green-500 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="bg-green-50 p-4 text-xl font-semibold">
            <div className="flex items-center">
              <Cog className="w-6 h-6 mr-2 text-green-500" />
              Configure Optimize Settings
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-white">
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
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=active]:border-b-2"
                >
                  Global Optimize ID
                </TabsTrigger>
                <TabsTrigger
                  value="country-specific"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=active]:border-b-2"
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
                    countryCodes={Object.keys(COUNTRIES) as CountryCodes[]}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
        {additionalSteps && (
          <AccordionItem
            value="additional-steps"
            className="border-2 border-blue-500 rounded-lg overflow-hidden mt-4"
          >
            <AccordionTrigger className="bg-blue-50 p-4 text-xl font-semibold">
              <div className="flex items-center">
                <Cog className="w-6 h-6 mr-2 text-blue-500" />
                {additionalSteps.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white">
              <ol className="list-decimal list-inside space-y-2">
                {additionalSteps.subSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
}
