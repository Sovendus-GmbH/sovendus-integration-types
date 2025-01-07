"use client";

import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { CountryOptions } from "./voucher-network-country-options";
import {
  SovendusFormDataType,
  VoucherNetworkFormType,
} from "../sovendus-app-types";
import {
  voucherNetworkCountries,
  VoucherNetworkCountryCode,
} from "./form-types";

interface SovendusVoucherNetworkProps {
  currentSettings: VoucherNetworkFormType;
  setCurrentSettings: Dispatch<SetStateAction<SovendusFormDataType>>;
}

export function SovendusVoucherNetwork({
  currentSettings,
  setCurrentSettings,
}: SovendusVoucherNetworkProps) {
  const getEnabledCountriesSummary = () => {
    const enabledCountries = Object.entries(currentSettings)
      .filter(
        ([countryKey, data]) =>
          data.isEnabled &&
          data.trafficMediumNumber &&
          data.trafficSourceNumber &&
          !!voucherNetworkCountries[countryKey as VoucherNetworkCountryCode]
      )
      .map(
        ([country]) =>
          voucherNetworkCountries[country as VoucherNetworkCountryCode]
      );
    return enabledCountries.length > 0 ? (
      <>
        <span className="text-lg">Enabled for: </span>
        {enabledCountries.join(", ")}
      </>
    ) : (
      <span className="text-lg">No countries enabled</span>
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">Voucher Network Settings</h2>
      <p className="text-md text-gray-500 mb-4">
        {getEnabledCountriesSummary()}
      </p>
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
