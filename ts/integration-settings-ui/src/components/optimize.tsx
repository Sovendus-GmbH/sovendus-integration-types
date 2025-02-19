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
import type {
  CountryCodes,
  OptimizeSettings,
  SovendusAppSettings,
} from "sovendus-integration-types";
import { COUNTRIES } from "sovendus-integration-types";

import { cn } from "../lib/utils";
import { type AdditionalSteps, DEMO_REQUEST_URL } from "./backend-form";
import {
  CountryOptions,
  EnabledOptimizeCountries,
  isOptimizeEnabled,
} from "./optimize-country-options";
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
    field: "optimizeId" | "isEnabled",
    value: string | boolean,
  ): void => {
    setCurrentSettings(
      (prevState) =>
        ({
          ...prevState,
          optimize: {
            ...prevState.optimize,
            settingsType: "simple",
            simple: {
              optimizeId: "",
              isEnabled: false,
              ...prevState.optimize.simple,
              [field]: value,
            },
          },
        }) satisfies SovendusAppSettings,
    );
  };

  const handleGlobalOptimizeIdChange = (
    value: "global" | "country-specific",
  ): void => {
    setCurrentSettings(
      (prevState) =>
        ({
          ...prevState,
          optimize: {
            ...prevState.optimize,
            settingsType: value === "global" ? "simple" : "country",
          },
        }) satisfies SovendusAppSettings,
    );
  };
  const optimizeEnabled = isOptimizeEnabled(currentOptimizeSettings);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-6 pb-8")}
    >
      <div
        className={cn(
          "bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-lg shadow-lg",
        )}
      >
        <h2 className={cn("text-3xl font-bold mb-4 text-white")}>
          Optimize: Supercharge Your Conversions
        </h2>
        <p className={cn("text-xl mb-6")}>
          Transform passive visitors into active customers and reduce bounce
          rates with Sovendus Optimize. Boost your conversion rates and build
          long-term customer relationships.
        </p>
        <Button
          size="lg"
          onClick={(): void => void window.open(DEMO_REQUEST_URL, "_blank")}
          className={cn("w-full sm:w-auto mt-4")}
        >
          Schedule Your Personalized Demo
          <ExternalLink className={cn("ml-2 h-4 w-4")} />
        </Button>
      </div>

      <Alert className={cn("mb-4 bg-blue-50 border-blue-200")}>
        <AlertDescription className={cn("text-blue-700 font-semibold")}>
          <strong>Important:</strong> To activate and configure Optimize,
          contact Sovendus for a personalized demo and setup. Our team will
          guide you through the entire process.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configure" className={cn("w-full")}>
        <TabsList className={cn("grid w-full grid-cols-3 mb-8")}>
          <TabsTrigger
            value="configure"
            className={cn(
              "text-lg font-semibold py-3 bg-green-100 data-[state=active]:bg-green-600 data-[state=active]:text-white",
            )}
          >
            Configure
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className={cn(
              "text-lg font-semibold py-3 bg-green-100 data-[state=active]:bg-green-600 data-[state=active]:text-white",
            )}
          >
            Key Benefits
          </TabsTrigger>
          <TabsTrigger
            value="how-it-works"
            className={cn(
              "text-lg font-semibold py-3 bg-green-100 data-[state=active]:bg-green-600 data-[state=active]:text-white",
            )}
          >
            How It Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configure">
          <div className={cn("space-y-6")}>
            <Alert
              className={`${
                optimizeEnabled
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } mt-2`}
            >
              <AlertDescription
                className={optimizeEnabled ? "text-green-700" : "text-red-700"}
              >
                <EnabledOptimizeCountries
                  currentSettings={currentOptimizeSettings}
                />
              </AlertDescription>
            </Alert>
            {additionalSteps && (
              <Card className={cn("border-2 border-green-500")}>
                <CardHeader>
                  <CardTitle
                    className={cn("text-xl font-semibold flex items-center")}
                  >
                    <CheckCircle
                      className={cn("w-6 h-6 mr-2 text-green-500")}
                    />
                    Additional Setup Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className={cn("font-semibold mb-2")}>
                    {additionalSteps.title}
                  </h4>
                  <ol className={cn("list-decimal list-inside space-y-2")}>
                    {additionalSteps.subSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            <Accordion type="single" collapsible className={cn("w-full mt-8")}>
              <AccordionItem
                value="optimize-settings"
                className={cn(
                  "border-2 border-green-500 rounded-lg overflow-hidden",
                )}
              >
                <AccordionTrigger
                  className={cn("bg-green-50 p-4 text-xl font-semibold")}
                >
                  <div className={cn("flex items-center")}>
                    <Cog className={cn("w-6 h-6 mr-2 text-green-500")} />
                    Configure Optimize Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className={cn("p-4 bg-white")}>
                  <Tabs
                    defaultValue={
                      currentOptimizeSettings.settingsType === "simple"
                        ? "global"
                        : "country-specific"
                    }
                    onValueChange={(value): void =>
                      handleGlobalOptimizeIdChange(
                        value as "global" | "country-specific",
                      )
                    }
                    className={cn("border rounded-md")}
                  >
                    <TabsList className={cn("grid w-full grid-cols-2 mb-2")}>
                      <TabsTrigger
                        value="global"
                        className={cn(
                          "data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=active]:border-b-2",
                        )}
                      >
                        Global Optimize ID
                      </TabsTrigger>
                      <TabsTrigger
                        value="country-specific"
                        className={cn(
                          "data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=active]:border-b-2",
                        )}
                      >
                        Country-specific Optimize ID's
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="global" className={cn("p-4")}>
                      <Alert className={cn("bg-blue-50 border-blue-200")}>
                        <AlertDescription className={cn("text-blue-700")}>
                          Use one Optimize ID for all countries
                        </AlertDescription>
                      </Alert>
                      <div className={cn("space-y-4 mt-4")}>
                        <div className={cn("flex items-center space-x-2")}>
                          <Switch
                            id="global-id-enabled"
                            checked={
                              currentOptimizeSettings.settingsType === "simple"
                            }
                            onCheckedChange={(checked): void =>
                              handleGlobalChange("isEnabled", checked)
                            }
                          />
                          <Label htmlFor="global-id-enabled">
                            Enable Global ID
                          </Label>
                        </div>
                        <div className={cn("space-y-2")}>
                          <Label htmlFor="global-id">Global Optimize ID</Label>
                          <Input
                            id="global-id"
                            value={
                              currentOptimizeSettings.simple?.optimizeId || ""
                            }
                            onChange={(e): void =>
                              handleGlobalChange("optimizeId", e.target.value)
                            }
                            placeholder="Enter Global Optimize ID"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="country-specific" className={cn("p-4")}>
                      <Alert className={cn("bg-blue-50 border-blue-200")}>
                        <AlertDescription className={cn("text-blue-700")}>
                          Use different Optimize ID's for each country
                        </AlertDescription>
                      </Alert>
                      <div className={cn("space-y-4 mt-4")}>
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
          </div>
        </TabsContent>
        <TabsContent value="benefits">
          <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 mb-8")}>
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center")}>
                  <Target className={cn("mr-2 h-5 w-5 text-red-500")} />
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
                <CardTitle className={cn("flex items-center")}>
                  <BarChart className={cn("mr-2 h-5 w-5 text-blue-500")} />
                  Data-Driven Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Leverage powerful analytics to gain deeper insights, optimize
                  your strategies, and continuously enhance your shop's
                  performance by understanding customer behavior.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center")}>
                  <Globe className={cn("mr-2 h-5 w-5 text-green-500")} />
                  Seamless Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Easy integration into any online shop, with customized design
                  to match your brand.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className={cn("bg-gray-100 p-6 rounded-lg mb-8")}>
            <h3 className={cn("text-2xl font-semibold mb-4")}>Key Benefits</h3>
            <ul className={cn("list-disc list-inside space-y-2")}>
              <li>Increase conversion rates by up to 10%</li>
              <li>Reduce cart abandonment by 5%</li>
              <li>Boost newsletter sign-ups by 15%</li>
              <li>Performance-based pricing with no hidden costs</li>
              <li>No minimum contract duration</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="how-it-works">
          <div className={cn("bg-gray-50 p-6 rounded-lg mt-6 space-y-4")}>
            <h3 className={cn("text-2xl font-semibold mb-4")}>
              How Optimize Works
            </h3>
            <ol className={cn("space-y-4")}>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>
                    Intelligent Analysis:
                  </strong>
                  <p>
                    Our system analyzes user behavior, traffic sources, and
                    on-site interactions in real-time.
                  </p>
                </div>
              </li>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>
                    Targeted Interventions:
                  </strong>
                  <p>
                    Sovendus Optimize is designed to intelligently analyze user
                    behavior and implement targeted interventions to enhance
                    user engagement and reduce bounce and cart abandonment
                    rates.
                  </p>
                </div>
              </li>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>Conversion Boost:</strong>
                  <p>
                    By focusing on personalized strategies, Sovendus Optimize
                    helps businesses reduce bounce and cart abandonment rates,
                    driving higher conversions and improving overall customer
                    retention.
                  </p>
                </div>
              </li>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>
                    Continuous Optimization:
                  </strong>
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
