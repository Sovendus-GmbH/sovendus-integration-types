"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  CheckCircle,
  Cog,
  ExternalLink,
  Globe,
  Target,
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
import { type AdditionalSteps, DEMO_REQUEST_URL } from "./backend-form";
import { CountryOptions } from "./optimize-country-options";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface SovendusOptimizeProps {
  currentOptimizeSettings: OptimizeSettings;
  savedOptimizeSettings: OptimizeSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps?: AdditionalSteps["optimize"];
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
      className="space-y-6 pb-8"
    >
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Optimize: Supercharge Your Conversions
        </h2>
        <p className="text-xl mb-6">
          Transform passive visitors into active customers and reduce bounce
          rates with Sovendus Optimize. Boost your conversion rates and build
          long-term customer relationships.
        </p>
      </div>

      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-yellow-700 font-semibold">
          <strong>Important:</strong> To activate and configure Optimize,
          contact Sovendus for a personalized demo and setup. Our team will
          guide you through the entire process.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="configure"
            className="text-lg font-semibold py-3 bg-green-100 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Configure
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="text-lg font-semibold py-3 bg-green-100 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Key Benefits
          </TabsTrigger>
          <TabsTrigger
            value="how-it-works"
            className="text-lg font-semibold py-3 bg-green-100 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            How It Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configure">
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-green-200 mt-2">
              <AlertDescription className="text-green-700">
                <EnabledOptimizeCountries
                  currentSettings={currentOptimizeSettings}
                />
              </AlertDescription>
            </Alert>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700">
                <strong>Remember:</strong> To fully activate and configure
                Optimize, you must contact Sovendus for a personalized setup.
              </AlertDescription>
            </Alert>

            {additionalSteps && (
              <Card className="border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                    Additional Setup Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2">
                    {additionalSteps.title}
                  </h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {additionalSteps.subSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

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
                          <Label htmlFor="global-id-enabled">
                            Enable Global ID
                          </Label>
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
                          countryCodes={
                            Object.keys(COUNTRIES) as CountryCodes[]
                          }
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button
              size="lg"
              onClick={() => window.open(DEMO_REQUEST_URL, "_blank")}
              className="w-full sm:w-auto mt-4"
            >
              Schedule Your Personalized Demo
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="benefits">
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
                  Easy copy/paste integration into any online shop, with
                  customized design to match your brand.
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
        </TabsContent>
        <TabsContent value="how-it-works">
          <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
            <h3 className="text-2xl font-semibold mb-4">How Optimize Works</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Intelligent Analysis:</strong>
                  <p>
                    Our system analyzes user behavior, traffic sources, and
                    on-site interactions in real-time.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Targeted Interventions:</strong>
                  <p>
                    Based on the analysis, Optimize deploys personalized
                    interventions to engage users at critical moments.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Conversion Boost:</strong>
                  <p>
                    These interventions help reduce bounce rates, increase
                    engagement, and drive more conversions.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Continuous Optimization:</strong>
                  <p>
                    Our team works with you to refine strategies and improve
                    performance based on ongoing data analysis.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
