"use client";

import { motion } from "framer-motion";
import React, { type Dispatch, type SetStateAction } from "react";

import type { SovendusFormDataType } from "../sovendus-app-types";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface SovendusCheckoutProductsProps {
  enabled: boolean;
  setCurrentSettings: Dispatch<SetStateAction<SovendusFormDataType>>;
}

export function SovendusCheckoutProducts({
  enabled,
  setCurrentSettings,
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
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">
        Checkout Products Settings
      </h2>
      <h3 className="text-xl font-semibold mb-2">
        Getting Started with Sovendus Checkout Products
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
        2. Enable Checkout Products below and make sure to save the settings
      </h4>
      <div className="flex items-center space-x-2">
        <Switch
          id="checkout-products-enabled"
          checked={enabled}
          onCheckedChange={onStateChange}
        />
        <Label htmlFor="checkout-products-enabled">
          Enable Sovendus Checkout Products
        </Label>
      </div>
    </motion.div>
  );
}
