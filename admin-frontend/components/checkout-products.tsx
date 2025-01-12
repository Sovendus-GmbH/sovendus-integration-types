"use client";

import { motion } from "framer-motion";
import { Cog, CreditCard, Package, Users } from "lucide-react";
import React, { type Dispatch, type JSX, type SetStateAction } from "react";

import type { SovendusAppSettings } from "../../settings/app-settings";
import type { AdditionalStep } from "./backend-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface SovendusCheckoutProductsProps {
  enabled: boolean;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps: AdditionalStep | undefined;
}

export function SovendusCheckoutProducts({
  enabled,
  setCurrentSettings,
  additionalSteps,
}: SovendusCheckoutProductsProps): JSX.Element {
  const onStateChange = (checked: boolean): void => {
    setCurrentSettings((prevState) => ({
      ...prevState,
      checkoutProducts: checked,
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
        Checkout Products: Receive Traffic from Other Shops
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Boost your customer acquisition by receiving high-quality traffic from
        other shops' success pages.
      </p>

      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-yellow-700">
          <strong>Note:</strong> Enabling Checkout Products requires activation
          on both your side and Sovendus' side. After configuring here, please
          contact Sovendus support to complete the activation process.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Massive Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Access to over 300 partner shops and 185 million ad impressions
              per year.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-green-500" />
              High Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Enjoy a 1-3% order rate, resulting in 3.6 million orders annually
              across our network.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-purple-500" />
              Risk-Free Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Generate additional revenue without any risk, setup costs, or
              minimum contract duration.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
        <ol className="list-decimal list-inside space-y-4">
          <li>
            <strong>Partner Network:</strong> Your offers appear on other shops'
            checkout pages as a thank-you gift to their customers.
          </li>
          <li>
            <strong>Targeted Display:</strong> Our system intelligently displays
            your offers to the most relevant customers based on their shopping
            behavior.
          </li>
          <li>
            <strong>Increased Traffic:</strong> Interested customers click
            through to your shop, potentially becoming new customers and
            increasing your sales.
          </li>
          <li>
            <strong>Activation Process:</strong> Configure your settings here,
            then contact Sovendus support to complete the activation on our
            servers.
          </li>
        </ol>
      </div>

      <Accordion type="single" collapsible className="w-full mt-8">
        <AccordionItem
          value="checkout-products-settings"
          className="border-2 border-green-500 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="bg-green-50 p-4 text-xl font-semibold">
            <div className="flex items-center">
              <Cog className="w-6 h-6 mr-2 text-green-500" />
              Configure Checkout Products
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-white">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="checkout-products-enabled"
                checked={enabled}
                onCheckedChange={onStateChange}
              />
              <Label
                htmlFor="checkout-products-enabled"
                className="text-lg font-semibold"
              >
                Enable Sovendus Checkout Products
              </Label>
            </div>
            <p className="text-base text-gray-600 mb-4">
              By enabling Checkout Products, you're indicating your interest in
              receiving high-quality traffic from other shops' success pages.
              This can potentially increase your customer base and sales without
              any upfront costs.
            </p>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700">
                Remember: After enabling this option, contact Sovendus support
                to complete the activation process on our servers.
              </AlertDescription>
            </Alert>
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
