"use client";

import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import React from "react";

import type {
  SovendusAppSettings,
  VoucherNetworkSettings,
} from "../../settings/app-settings";
import { EnabledVoucherNetworkCountries } from "../../settings/app-settings";
import { CountryOptions } from "./voucher-network-country-options";

interface SovendusVoucherNetworkProps {
  currentSettings: VoucherNetworkSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
}

export function SovendusVoucherNetwork({
  currentSettings,
  setCurrentSettings,
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
      <h3 className="text-xl font-semibold mb-2">
        Getting Started with Sovendus Voucher Network
      </h3>
      <h4 className="text-lg font-semibold">
        1. Add the Sovendus Voucher Network app to your checkout page
      </h4>
      <ol className="ml-4">
        <li>
          {
            "a. Go to Settings -> Checkout -> click on Customize to customize your checkout pages"
          }
        </li>
        <li>b. Click on Checkout in the top middle and then on Thank you</li>
        <li>
          c. Click on Add app block on the bottom left, then on Sovendus Voucher
          Network and then Save
        </li>
        <li>
          d. Click on Thank you in the top middle and then on Order status
        </li>
        <li>
          e. Click on Add app block on the bottom left, then on Sovendus Voucher
          Network and then Save
        </li>
      </ol>
      <h4 className="text-lg font-semibold mb-2">
        2. Enter your ID's below and you're ready to go
      </h4>
      <CountryOptions
        currentSettings={currentSettings}
        setCurrentSettings={setCurrentSettings}
      />
    </motion.div>
  );
}
