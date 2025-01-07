"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";

import type { Dispatch, SetStateAction } from "react";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  voucherNetworkCountries,
  VoucherNetworkCountryCode,
} from "./form-types";
import {
  SovendusFormDataType,
  VoucherNetworkFormType,
} from "../sovendus-app-types";

type CountryOptionsProps = {
  currentSettings: VoucherNetworkFormType;
  setCurrentSettings: Dispatch<SetStateAction<SovendusFormDataType>>;
};

export function CountryOptions({
  currentSettings,
  setCurrentSettings,
}: CountryOptionsProps) {
  const getCountryStatus = (countryKey: VoucherNetworkCountryCode) => {
    const country = currentSettings[countryKey];
    if (!country?.trafficMediumNumber || !country?.trafficSourceNumber)
      return "Not configured";
    if (!country.isEnabled) return "Disabled";
    return `Source: ${country.trafficSourceNumber}, Medium: ${country.trafficMediumNumber}`;
  };

  const isCountryEnabled = (
    country: VoucherNetworkFormType[VoucherNetworkCountryCode]
  ): boolean => {
    return (
      (country?.isEnabled &&
        country.trafficSourceNumber &&
        /^\d+$/.test(country.trafficSourceNumber) &&
        country.trafficMediumNumber &&
        /^\d+$/.test(country.trafficMediumNumber)) ||
      false
    );
  };
  const handleEnabledChange = (
    countryKey: VoucherNetworkCountryCode,
    checked: boolean
  ) => {
    setCurrentSettings((prevState) => {
      if (
        prevState.voucherNetwork[countryKey]?.trafficMediumNumber &&
        prevState.voucherNetwork[countryKey].trafficSourceNumber &&
        checked !== prevState.voucherNetwork[countryKey].isEnabled
      )
        return {
          ...prevState,
          voucherNetwork: {
            ...prevState.voucherNetwork,
            [countryKey]: {
              ...prevState.voucherNetwork[countryKey],
              isEnabled:
                prevState.voucherNetwork[countryKey]?.trafficMediumNumber &&
                prevState.voucherNetwork[countryKey].trafficSourceNumber &&
                checked,
            },
          },
        };
      return prevState;
    });
  };
  const handleIdChange = (
    countryKey: VoucherNetworkCountryCode,
    field: "trafficSourceNumber" | "trafficMediumNumber",
    value: number | string
  ) => {
    setCurrentSettings((prevState) => {
      const newValue = parseInt(`${value}`, 10);
      if (prevState.voucherNetwork[countryKey] !== newValue) {
        const newState = {
          ...prevState,
          voucherNetwork: {
            ...prevState.voucherNetwork,
            [countryKey]: {
              ...prevState.voucherNetwork[countryKey],
              [field]: String(parseInt(`${value}`, 10)),
            },
          },
        };
        return newState;
      }
      return prevState;
    });
  };
  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(voucherNetworkCountries).map(
        ([countryKey, countryName]) => (
          <CountrySettings
            key={countryKey}
            countryKey={countryKey as VoucherNetworkCountryCode}
            countryName={countryName}
            currentSettings={currentSettings}
            getCountryStatus={getCountryStatus}
            isCountryEnabled={isCountryEnabled}
            handleEnabledChange={handleEnabledChange}
            handleIdChange={handleIdChange}
          />
        )
      )}
    </Accordion>
  );
}

function CountrySettings({
  countryName,
  currentSettings,
  countryKey,
  getCountryStatus,
  isCountryEnabled,
  handleEnabledChange,
  handleIdChange,
}: {
  countryKey: VoucherNetworkCountryCode;
  countryName: string;
  currentSettings: VoucherNetworkFormType;
  getCountryStatus: (countryKey: VoucherNetworkCountryCode) => string;
  isCountryEnabled: (
    country: VoucherNetworkFormType[VoucherNetworkCountryCode]
  ) => boolean;
  handleEnabledChange: (
    countryKey: VoucherNetworkCountryCode,
    checked: boolean
  ) => void;
  handleIdChange: (
    countryKey: VoucherNetworkCountryCode,
    field: "trafficSourceNumber" | "trafficMediumNumber",
    value: number | string
  ) => void;
}): JSX.Element {
  const isEnabled = isCountryEnabled(currentSettings[countryKey]);
  const trafficSourceNumber = parseInt(
    currentSettings[countryKey as VoucherNetworkCountryCode]
      ?.trafficSourceNumber || ""
  );
  const trafficMediumNumber = parseInt(
    currentSettings[countryKey as VoucherNetworkCountryCode]
      ?.trafficMediumNumber || ""
  );
  return (
    <AccordionItem value={countryKey} key={countryKey}>
      <AccordionTrigger>
        <div className="flex items-center justify-between w-full">
          <span>{countryName}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {getCountryStatus(countryKey)}
            </span>
            {isEnabled && (
              <Badge variant="outline" className="ml-2">
                Enabled
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id={`${countryKey}-enabled`}
              checked={isEnabled}
              onCheckedChange={(checked) =>
                handleEnabledChange(
                  countryKey as VoucherNetworkCountryCode,
                  checked
                )
              }
            />
            <label htmlFor={`${countryKey}-enabled`}>
              Enable for {countryName}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${countryKey}-source`}>
                Traffic Source Number
              </Label>
              <Input
                id={`${countryKey}-source`}
                value={
                  isNaN(trafficSourceNumber) ? undefined : trafficSourceNumber
                }
                onChange={(e) =>
                  handleIdChange(
                    countryKey as VoucherNetworkCountryCode,
                    "trafficSourceNumber",
                    e.target.value
                  )
                }
                placeholder="Enter Traffic Source Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${countryKey}-medium`}>
                Traffic Medium Number
              </Label>
              <Input
                id={`${countryKey}-medium`}
                value={
                  isNaN(trafficMediumNumber) ? undefined : trafficMediumNumber
                }
                onChange={(e) =>
                  handleIdChange(
                    countryKey as VoucherNetworkCountryCode,
                    "trafficMediumNumber",
                    e.target.value
                  )
                }
                placeholder="Enter Traffic Medium Number"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
