import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";
import type {
  CountryCodes,
  OptimizeCountry,
  OptimizeSettings,
  SovendusAppSettings,
} from "sovendus-integration-types";
import { COUNTRIES } from "sovendus-integration-types";

import { cn } from "../lib/utils";
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
  countryCodes: CountryCodes[];
};

export function CountryOptions({
  currentSettings,
  setCurrentSettings,
  countryCodes,
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

  const isCountryEnabled = (country: OptimizeCountry | undefined): boolean => {
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
    newOptimizeId: string,
  ): void => {
    setCurrentSettings((prevState) => {
      if (
        prevState.optimize.countrySpecificIds[countryKey]?.optimizeId !==
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
    <Accordion type="single" collapsible className={cn("w-full")}>
      {countryCodes.map((countryKey) => (
        <AccordionItem value={countryKey} key={countryKey}>
          <AccordionTrigger>
            <div className={cn("flex items-center justify-between w-full")}>
              <span>{COUNTRIES[countryKey]}</span>
              <div className={cn("flex items-center space-x-2")}>
                <span className={cn("text-sm text-muted-foreground")}>
                  {getCountryStatus(countryKey)}
                </span>
                {isCountryEnabled(
                  currentSettings.countrySpecificIds[countryKey],
                ) && (
                  <Badge variant="outline" className={cn("ml-2")}>
                    Enabled
                  </Badge>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={cn("space-y-4 mx-1")}>
              <div className={cn("flex items-center space-x-2")}>
                <Switch
                  id={`${countryKey}-enabled`}
                  checked={
                    currentSettings.countrySpecificIds[countryKey]?.isEnabled ||
                    false
                  }
                  onCheckedChange={(checked): void =>
                    handleEnabledChange(countryKey, checked)
                  }
                />
                <label htmlFor={`${countryKey}-enabled`}>
                  Enable for {COUNTRIES[countryKey]}
                </label>
              </div>
              <div className={cn("space-y-2")}>
                <Label htmlFor={`${countryKey}-id`}>Optimize ID</Label>
                <Input
                  id={`${countryKey}-id`}
                  value={
                    currentSettings.countrySpecificIds[countryKey]
                      ?.optimizeId || ""
                  }
                  onChange={(e): void =>
                    handleCountryChange(countryKey, e.target.value)
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
