"use client";

import { motion } from "framer-motion";
import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import type {
  SovendusAppSettings,
  VoucherNetworkSettings,
} from "../../settings/app-settings";
import { EnabledVoucherNetworkCountries } from "../../settings/app-settings";
import type { AdditionalStep } from "./backend-form";
import { ContactForm } from "./contact-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
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
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">Voucher Network Settings</h2>
      <EnabledVoucherNetworkCountries currentSettings={currentSettings} />
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
            Step {additionalSteps ? 3 : 2}: Enter your ID's
          </AccordionTrigger>
          <AccordionContent>
            <CountryOptions
              currentSettings={currentSettings}
              setCurrentSettings={setCurrentSettings}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}

export function AdditionalSteps({
  additionalSteps,
}: {
  additionalSteps: AdditionalStep | undefined;
}): JSX.Element {
  return additionalSteps ? (
    <AccordionItem value="step2">
      <AccordionTrigger>Step 2: {additionalSteps.title}</AccordionTrigger>
      <AccordionContent>
        <ol className="ml-4">
          {additionalSteps.subSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </AccordionContent>
    </AccordionItem>
  ) : (
    <></>
  );
}
