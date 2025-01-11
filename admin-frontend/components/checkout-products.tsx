"use client";

import { motion } from "framer-motion";
import React, { type Dispatch, type JSX, type SetStateAction } from "react";

import type { SovendusAppSettings } from "../../settings/app-settings";
import type { AdditionalStep } from "./backend-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { AdditionalSteps } from "./voucher-network";

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
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">
        Checkout Products Settings
      </h2>
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
        <AccordionItem value={`step${additionalSteps ? 3 : 2}`}>
          <AccordionTrigger>
            Step {additionalSteps ? 3 : 2}: Enable Checkout Products
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
