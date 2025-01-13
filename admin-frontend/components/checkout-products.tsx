"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Package,
  Users,
} from "lucide-react";
import React, { type Dispatch, type JSX, type SetStateAction } from "react";

import type { SovendusAppSettings } from "../../settings/app-settings";
import { cn } from "../lib/utils";
import { type AdditionalSteps, DEMO_REQUEST_URL } from "./backend-form";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface SovendusCheckoutProductsProps {
  enabled: boolean;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps?: AdditionalSteps["checkoutProducts"];
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
      className="space-y-6 pb-8"
    >
      <div
        className={cn(
          "bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg",
        )}
      >
        <h2 className="text-3xl font-bold mb-4 text-white">
          Checkout Products: Your Gateway to Exponential Growth
        </h2>
        <p className="text-xl mb-6">
          Transform your e-commerce success with high-quality traffic from our
          vast network of partner shops.
        </p>
        <Button
          size="lg"
          onClick={(): void => window.open(DEMO_REQUEST_URL, "_blank")}
          className="bg-white text-purple-600 hover:bg-purple-100"
        >
          Schedule Your Personalized Demo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-yellow-700 font-semibold">
          <strong>Important:</strong> The first step to activate Checkout
          Products is to contact Sovendus for a personalized demo and setup. Our
          team will guide you through the entire process.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="configure"
            className="text-lg font-semibold py-3 bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Configure
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="text-lg font-semibold py-3 bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Key Benefits
          </TabsTrigger>
          <TabsTrigger
            value="how-it-works"
            className="text-lg font-semibold py-3 bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            How It Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configure">
          <div className="space-y-6">
            {additionalSteps && (
              <Card className="border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-purple-500" />
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

            <div className="flex items-center space-x-4 pt-4 ml-2">
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
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700">
                <strong>Remember:</strong> To fully activate and configure
                Checkout Products, you must contact Sovendus for a personalized
                setup.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        <TabsContent value="benefits">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Users className="mr-2 h-5 w-5" />
                  Massive Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Tap into a network of 300+ partner shops and 185 million
                  annual ad impressions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Package className="mr-2 h-5 w-5" />
                  High Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Experience a 1-3% order rate, contributing to 3.6 million
                  orders across our network yearly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Risk-Free Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Generate additional income with zero risk, no setup costs, and
                  no minimum contract duration.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="how-it-works">
          <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
            <h3 className="text-2xl font-semibold mb-4">
              How Checkout Products Works
            </h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Seamless Integration:</strong>
                  <p>
                    After your personalized setup with Sovendus, your offers
                    will appear on partner shops' checkout pages, presented as
                    exclusive deals to their customers.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Smart Targeting:</strong>
                  <p>
                    Our advanced system displays your offers to the most
                    relevant customers based on their shopping behavior and
                    preferences.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Traffic Boost:</strong>
                  <p>
                    Interested customers click through to your shop, potentially
                    becoming new, high-intent customers and increasing your
                    sales.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-lg">Continuous Optimization:</strong>
                  <p>
                    Our team works with you to continuously refine and optimize
                    your campaigns for maximum performance.
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
