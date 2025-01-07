"use client";

import type { Dispatch, SetStateAction } from "react";
import React from "react";

import type {
  OptimizeCountry,
  OptimizeSettings,
  SovendusAppSettings,
} from "../../settings/app-settings";
import type { CountryCodes } from "../../settings/sovendus-countries";
import { COUNTRIES } from "../../settings/sovendus-countries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type CountryOptionsProps = {
  currentSettings: OptimizeSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
};

export function CountryOptions({
  currentSettings,
  setCurrentSettings,
}: CountryOptionsProps): JSX.Element {
  const getCountryStatus = (countryKey: CountryCodes): string => {
    const country = currentSettings.countrySpecificIds[countryKey];
    if (!country?.optimizeId) {
      return "Not configured";
    }
    if (!country.isEnabled) {
      return "Disabled";
    }
    return `Optimize ID: ${country.optimizeId}`;
  };

  const isCountryEnabled = (country: OptimizeCountry): boolean => {
    return (
      (country?.isEnabled &&
        country.optimizeId &&
        /^\d+$/.test(country.optimizeId)) ||
      false
    );
  };
  const handleEnabledChange = (
    countryKey: CountryCodes,
    checked: boolean,
  ): void => {
    setCurrentSettings((prevState) => {
      if (
        !!prevState.optimize.countrySpecificIds[countryKey]?.optimizeId &&
        prevState.optimize.countrySpecificIds[countryKey].isEnabled !== checked
      ) {
        return {
          ...prevState,
          optimize: {
            ...prevState.optimize,
            countrySpecificIds: {
              ...prevState.optimize.countrySpecificIds,
              [countryKey]: {
                ...prevState.optimize.countrySpecificIds[countryKey],
                id:
                  prevState.optimize.countrySpecificIds[countryKey]
                    ?.optimizeId || "",
                isEnabled:
                  !!prevState.optimize.countrySpecificIds[countryKey]
                    ?.optimizeId && checked,
              },
            },
          },
        };
      }
      return prevState;
    });
  };

  const handleCountryChange = (
    countryKey: CountryCodes,
    newOptimizeId: boolean | string,
  ): void => {
    setCurrentSettings((prevState) => {
      if (
        prevState.optimize.countrySpecificIds[countryKey].optimizeId !==
        newOptimizeId
      ) {
        return {
          ...prevState,
          optimize: {
            ...prevState.optimize,
            countrySpecificIds: {
              ...prevState.optimize.countrySpecificIds,
              [countryKey]: {
                ...prevState.optimize.countrySpecificIds[countryKey],
                optimizeId: newOptimizeId,
              },
            },
          },
        };
      }
      return prevState;
    });
  };
  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(COUNTRIES).map(([countryKey, countryName]) => (
        <AccordionItem value={countryKey} key={countryKey}>
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full">
              <span>{countryName}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {getCountryStatus(countryKey as CountryCodes)}
                </span>
                {isCountryEnabled(
                  currentSettings.countrySpecificIds[
                    countryKey as CountryCodes
                  ],
                ) && (
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
                  checked={
                    currentSettings.countrySpecificIds[
                      countryKey as CountryCodes
                    ]?.isEnabled || false
                  }
                  onCheckedChange={(checked) =>
                    handleEnabledChange(countryKey as CountryCodes, checked)
                  }
                />
                <label htmlFor={`${countryKey}-enabled`}>
                  Enable for {countryName}
                </label>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${countryKey}-id`}>Optimize ID</Label>
                <Input
                  id={`${countryKey}-id`}
                  value={
                    currentSettings.countrySpecificIds[
                      countryKey as CountryCodes
                    ]?.optimizeId || ""
                  }
                  onChange={(e) =>
                    handleCountryChange(
                      countryKey as CountryCodes,
                      e.target.value,
                    )
                  }
                  placeholder="Enter Optimize ID"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
