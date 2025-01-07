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
import { OptimizeSettingsFormType, SovendusFormDataType } from "../sovendus-app-types";
import { optimizeCountries, OptimizeCountryCode } from "./form-types";


type CountryOptionsProps = {
  currentSettings: OptimizeSettingsFormType;
  setCurrentSettings: Dispatch<SetStateAction<SovendusFormDataType>>;
};

export function CountryOptions({
  currentSettings,
  setCurrentSettings,
}: CountryOptionsProps) {
  const getCountryStatus = (countryKey: OptimizeCountryCode) => {
    const country = currentSettings.countrySpecificIds[countryKey];
    if (!country?.id) return "Not configured";
    if (!country.isEnabled) return "Disabled";
    return `Optimize ID: ${country.id}`;
  };

  const isCountryEnabled = (
    country: OptimizeSettingsFormType["countrySpecificIds"][OptimizeCountryCode]
  ): boolean => {
    return (
      (country?.isEnabled && country.id && /^\d+$/.test(country.id)) || false
    );
  };
  const handleEnabledChange = (
    countryKey: OptimizeCountryCode,
    checked: boolean
  ) => {
    setCurrentSettings((prevState) => {
      if (
        !!prevState.optimize.countrySpecificIds[countryKey]?.id &&
        prevState.optimize.countrySpecificIds[countryKey].isEnabled !== checked
      )
        return {
          ...prevState,
          optimize: {
            ...prevState.optimize,
            countrySpecificIds: {
              ...prevState.optimize.countrySpecificIds,
              [countryKey]: {
                ...prevState.optimize.countrySpecificIds[countryKey],
                id: prevState.optimize.countrySpecificIds[countryKey]?.id || "",
                isEnabled:
                  !!prevState.optimize.countrySpecificIds[countryKey]?.id &&
                  checked,
              },
            },
          },
        };
      return prevState;
    });
  };

  const handleCountryChange = (
    countryKey: OptimizeCountryCode,
    field: "isEnabled" | "id",
    value: boolean | string
  ) => {
    setCurrentSettings((prevState) => {
      if (prevState.optimize.countrySpecificIds[countryKey] !== value) {
        return {
          ...prevState,
          optimize: {
            ...prevState.optimize,
            countrySpecificIds: {
              ...prevState.optimize.countrySpecificIds,
              [countryKey]: {
                ...prevState.optimize.countrySpecificIds[countryKey],
                [field]: value,
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
      {Object.entries(optimizeCountries).map(([countryKey, countryName]) => (
        <AccordionItem value={countryKey} key={countryKey}>
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full">
              <span>{countryName}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {getCountryStatus(countryKey as OptimizeCountryCode)}
                </span>
                {isCountryEnabled(
                  currentSettings.countrySpecificIds[
                    countryKey as OptimizeCountryCode
                  ]
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
                      countryKey as OptimizeCountryCode
                    ]?.isEnabled
                  }
                  onCheckedChange={(checked) =>
                    handleEnabledChange(
                      countryKey as OptimizeCountryCode,
                      checked
                    )
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
                      countryKey as OptimizeCountryCode
                    ]?.id || ""
                  }
                  onChange={(e) =>
                    handleCountryChange(
                      countryKey as OptimizeCountryCode,
                      "id",
                      e.target.value
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
