"use client";

import { motion } from "framer-motion";
import { Cog, Gift, ShoppingBag } from "lucide-react";
import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import {
  EnabledVoucherNetworkCountries,
  type SovendusAppSettings,
  type VoucherNetworkSettings,
} from "../../settings/app-settings";
import type { CountryCodes } from "../../settings/sovendus-countries";
import { LANGUAGES_BY_COUNTRIES } from "../../settings/sovendus-countries";
import type { AdditionalStep } from "./backend-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CountryOptions } from "./voucher-network-country-options";

interface SovendusVoucherNetworkProps {
  currentSettings: VoucherNetworkSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps: AdditionalStep | undefined;
}

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
      <h2 className="text-3xl font-bold mb-4">
        Voucher Network & Checkout Benefits: Two Powerful Products
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Sovendus offers two distinct products: Voucher Network and Checkout
        Benefits. While they are configured together in this interface, they
        serve different purposes to boost your sales and revenue.
      </p>

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
              network on your checkout page. Increase your brand visibility and
              acquire new customers from partner shops.
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
              Generate additional revenue by displaying offers from other shops
              on your checkout page. Earn commissions when your customers make
              purchases from these partner offers.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4">Key Benefits</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Massive Reach:</strong> Connect with 7 million online
            shoppers monthly through our network of 2,300+ European partners.
          </li>
          <li>
            <strong>Performance-Based:</strong> Pay only for generated purchases
            in your shop, with no minimum contract duration.
          </li>
          <li>
            <strong>Dual Revenue Streams:</strong> Attract new customers through
            Voucher Network and earn additional revenue with Checkout Benefits.
          </li>
          <li>
            <strong>Seamless Integration:</strong> Easy setup process for both
            products with a single configuration.
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-yellow-700">
          <strong>Note:</strong> While Voucher Network and Checkout Benefits are
          configured together in this interface, the actual enabling or
          disabling of each product is managed by Sovendus on our servers. Your
          configuration here applies to both products.
        </p>
      </div>

      <EnabledVoucherNetworkCountries currentSettings={currentSettings} />

      <Accordion type="single" collapsible className="w-full mt-8">
        <AccordionItem
          value="step1"
          className="border-2 border-green-500 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="bg-green-50 p-4 text-xl font-semibold">
            <div className="flex items-center">
              <Cog className="w-6 h-6 mr-2 text-green-500" />
              Configure Voucher Network & Checkout Benefits
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-white">
            <p className="mb-4 text-lg">
              Maximize your revenue potential by setting up Voucher Network and
              Checkout Benefits for multiple countries and languages. This
              configuration applies to both products, unlocking new markets and
              opportunities for growth.
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
