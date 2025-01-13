"use client";

import { motion } from "framer-motion";
import { Gift, ShoppingBag, Cog, CheckCircle, ArrowRight } from "lucide-react";
import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  EnabledVoucherNetworkCountries,
  SovendusAppSettings,
  VoucherNetworkSettings,
} from "../../settings/app-settings";
import { AdditionalSteps } from "./backend-form";
import { CountryOptions } from "./voucher-network-country-options";
import {
  CountryCodes,
  LANGUAGES_BY_COUNTRIES,
} from "../../settings/sovendus-countries";

interface SovendusVoucherNetworkProps {
  currentSettings: VoucherNetworkSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps?: AdditionalSteps["voucherNetwork"];
}

const DEMO_REQUEST_URL =
  "https://online.sovendus.com/kontakt/demo-tour-kontaktformular/#";

export function SovendusVoucherNetwork({
  currentSettings,
  setCurrentSettings,
  additionalSteps,
}: SovendusVoucherNetworkProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">
          Voucher Network & Checkout Benefits: Dual Revenue Streams
        </h2>
        <p className="text-xl mb-6">
          Boost sales with post-purchase vouchers and earn revenue from partner
          offers - a win-win solution for your e-commerce business.
        </p>
        <Button
          size="lg"
          onClick={() => window.open(DEMO_REQUEST_URL, "_blank")}
          className="bg-white text-blue-600 hover:bg-blue-100"
        >
          Schedule Your Personalized Demo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-yellow-700 font-semibold">
          <strong>Important:</strong> To activate Voucher Network & Checkout
          Benefits, contact Sovendus for a personalized demo and setup. Our team
          will guide you through the entire process.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="configure"
            className="text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Configure
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Key Benefits
          </TabsTrigger>
          <TabsTrigger
            value="how-it-works"
            className="text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            How It Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configure">
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700">
                <strong>Remember:</strong> To fully activate and configure
                Voucher Network & Checkout Benefits, you must contact Sovendus
                for a personalized setup.
              </AlertDescription>
            </Alert>

            {additionalSteps && (
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-blue-500" />
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

            <EnabledVoucherNetworkCountries currentSettings={currentSettings} />
            <Accordion type="single" collapsible className="w-full mt-8">
              <AccordionItem
                value="step1"
                className="border-2 border-blue-500 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="bg-blue-50 p-4 text-xl font-semibold">
                  <div className="flex items-center">
                    <Cog className="w-6 h-6 mr-2 text-blue-500" />
                    Configure Voucher Network & Checkout Benefits
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                  <p className="mb-4 text-lg">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5 text-blue-500" />
                  Voucher Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Attract new customers by offering vouchers from our extensive
                  network on your checkout page. Increase your brand visibility
                  and acquire new customers from partner shops.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-green-500" />
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
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-semibold mb-4">Key Benefits</h3>
            <ul className="list-disc list-inside space-y-2">
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
          <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
            <h3 className="text-2xl font-semibold mb-4">
              How Voucher Network & Checkout Benefits Work
            </h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">
                    Voucher Network Integration:
                  </strong>
                  <p>
                    After setup, your shop's vouchers are displayed on partner
                    checkout pages, attracting new customers to your store.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">
                    Checkout Benefits Display:
                  </strong>
                  <p>
                    Partner offers are shown on your checkout page, providing
                    additional value to your customers and generating commission
                    for you.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Dual Revenue Generation:</strong>
                  <p>
                    Benefit from new customer acquisitions through your vouchers
                    and earn commissions from partner sales.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Continuous Optimization:</strong>
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

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg mt-8">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Maximize Your Revenue?
        </h3>
        <p className="text-lg mb-6">
          Join thousands of successful e-commerce businesses leveraging Sovendus
          Voucher Network & Checkout Benefits. Our team is ready to create a
          tailored solution for your shop.
        </p>
        <Button
          size="lg"
          variant="outline"
          onClick={() => window.open(DEMO_REQUEST_URL, "_blank")}
          className="bg-white text-green-600 hover:bg-green-100"
        >
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}
