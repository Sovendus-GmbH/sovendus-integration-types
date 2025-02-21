import { motion } from "framer-motion";
import {
  CheckCircle,
  Cog,
  ExternalLink,
  Gift,
  ShoppingBag,
} from "lucide-react";
import type { Dispatch, JSX, SetStateAction } from "react";
import type {
  CountryCodes,
  SovendusAppSettings,
  VoucherNetworkSettings,
} from "sovendus-integration-types";
import { LANGUAGES_BY_COUNTRIES } from "sovendus-integration-types";

import { cn } from "../utils/utils";
import { type AdditionalSteps, DEMO_REQUEST_URL } from "./backend-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./shadcn/accordion";
import { Alert, AlertDescription } from "./shadcn/alert";
import { Button } from "./shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "./shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./shadcn/tabs";
import {
  CountryOptions,
  EnabledVoucherNetworkCountries,
  isVnEnabled,
} from "./voucher-network-country-options";

interface SovendusVoucherNetworkProps {
  currentSettings: VoucherNetworkSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps?: AdditionalSteps["voucherNetwork"];
}

export function SovendusVoucherNetwork({
  currentSettings,
  setCurrentSettings,
  additionalSteps,
}: SovendusVoucherNetworkProps): JSX.Element {
  const vnEnabled = isVnEnabled(currentSettings);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-6 pb-8")}
    >
      <div
        className={cn(
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg",
        )}
      >
        <h2 className={cn("text-3xl font-bold mb-4 text-white")}>
          Voucher Network & Checkout Benefits: Dual Revenue Streams
        </h2>
        <p className={cn("text-xl mb-6")}>
          Boost traffic and sales with our closed voucher network, while
          rewarding customers at checkout and earning extra revenue.
        </p>
        <Button
          size="lg"
          onClick={(): void => void window.open(DEMO_REQUEST_URL, "_blank")}
          className={cn("bg-white text-blue-600 hover:bg-blue-100")}
        >
          Schedule Your Personalized Demo
          <ExternalLink className={cn("ml-2 h-4 w-4")} />
        </Button>
      </div>

      <Alert className={cn("mb-4 bg-blue-50 border-blue-200")}>
        <AlertDescription className={cn("text-blue-700 font-semibold")}>
          <strong>Important:</strong> To activate Voucher Network and/or
          Checkout Benefits, contact Sovendus for a personalized demo and setup.
          Our team will guide you through the entire process.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configure" className={cn("w-full")}>
        <TabsList className={cn("grid w-full grid-cols-3 mb-8")}>
          <TabsTrigger
            value="configure"
            className={cn(
              "text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
            )}
          >
            Configure
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className={cn(
              "text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
            )}
          >
            Key Benefits
          </TabsTrigger>
          <TabsTrigger
            value="how-it-works"
            className={cn(
              "text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
            )}
          >
            How It Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configure">
          <div className={cn("space-y-6")}>
            <Alert
              className={cn(
                `${
                  vnEnabled
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } mt-2`,
              )}
            >
              <AlertDescription
                className={cn(vnEnabled ? "text-green-700" : "text-red-700")}
              >
                <EnabledVoucherNetworkCountries
                  currentSettings={currentSettings}
                />
              </AlertDescription>
            </Alert>
            {additionalSteps && (
              <Card className={cn("border-2 border-blue-500")}>
                <CardHeader>
                  <CardTitle
                    className={cn("text-xl font-semibold flex items-center")}
                  >
                    <CheckCircle className={cn("w-6 h-6 mr-2 text-blue-500")} />
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
                value="step1"
                className={cn(
                  "border-2 border-blue-500 rounded-lg overflow-hidden",
                )}
              >
                <AccordionTrigger
                  className={cn("bg-blue-50 p-4 text-xl font-semibold")}
                >
                  <div className={cn("flex items-center")}>
                    <Cog className={cn("w-6 h-6 mr-2 text-blue-500")} />
                    Configure Voucher Network & Checkout Benefits
                  </div>
                </AccordionTrigger>
                <AccordionContent className={cn("p-4 bg-white")}>
                  <p className={cn("mb-4 text-lg")}>
                    Maximize your revenue potential by setting up Voucher
                    Network and Checkout Benefits for multiple countries and
                    languages. This configuration applies to both products,
                    unlocking new markets and opportunities for growth.
                  </p>
                  <CountryOptions
                    currentSettings={currentSettings}
                    setCurrentSettings={setCurrentSettings}
                    countryCodes={
                      Object.keys(LANGUAGES_BY_COUNTRIES) as CountryCodes[]
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        <TabsContent value="benefits">
          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 mb-8")}>
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center")}>
                  <Gift className={cn("mr-2 h-5 w-5 text-blue-500")} />
                  Voucher Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Gain traffic and new sales through our closed voucher network
                  with over 7 million online shoppers every month.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center")}>
                  <ShoppingBag className={cn("mr-2 h-5 w-5 text-green-500")} />
                  Checkout Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Generate additional revenue by displaying offers from other
                  shops on your checkout page. Earn commissions when your
                  customers make purchases from these partner offers.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className={cn("bg-gray-100 p-6 rounded-lg mb-8")}>
            <h3 className={cn("text-2xl font-semibold mb-4")}>Key Benefits</h3>
            <ul className={cn("list-disc list-inside space-y-2")}>
              <li>
                <strong>Massive Reach:</strong> Connect with 7 million online
                shoppers monthly through our network of 2,300+ European
                partners.
              </li>
              <li>
                <strong>Performance-Based:</strong> Pay only for generated
                purchases in your shop, with no minimum contract duration.
              </li>
              <li>
                <strong>Dual Revenue Streams:</strong> Attract new customers
                through Voucher Network and earn additional revenue with
                Checkout Benefits.
              </li>
              <li>
                <strong>Seamless Integration:</strong> Easy setup process for
                both products with a single configuration.
              </li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="how-it-works">
          <div className={cn("bg-gray-50 p-6 rounded-lg mt-6 space-y-4")}>
            <h3 className={cn("text-2xl font-semibold mb-4")}>
              How Voucher Network & Checkout Benefits Work
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
                    Voucher Network Integration:
                  </strong>
                  <p>
                    After setup, your shop's vouchers are displayed on partner
                    checkout pages, attracting new customers to your store.
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
                    Checkout Benefits Display:
                  </strong>
                  <p>
                    Partner offers are shown on your checkout page, providing
                    additional value to your customers and generating commission
                    for you.
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
                    Dual Revenue Generation:
                  </strong>
                  <p>
                    Benefit from new customer acquisitions through your vouchers
                    and earn commissions from partner sales.
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
                    Our team works with you to refine your offers and placements
                    for maximum performance and revenue.
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
