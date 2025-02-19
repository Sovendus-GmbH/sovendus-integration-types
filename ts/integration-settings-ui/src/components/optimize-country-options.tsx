import type { Dispatch, JSX, SetStateAction } from "react";
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
    const country = currentSettings.countries?.ids?.[countryKey];
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
        !!prevState.optimize.countries?.ids[countryKey]?.optimizeId &&
        prevState.optimize.countries?.ids[countryKey].isEnabled !== checked
      ) {
        return {
          ...prevState,
          optimize: {
            ...prevState.optimize,
            countrySpecificIds: {
              ...prevState.optimize.countries?.ids,
              [countryKey]: {
                ...prevState.optimize.countries?.ids[countryKey],
                isEnabled:
                  !!prevState.optimize.countries?.ids[countryKey]?.optimizeId &&
                  checked,
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
        prevState.optimize?.countries?.ids[countryKey]?.optimizeId !==
        newOptimizeId
      ) {
        return {
          ...prevState,
          optimize: {
            ...prevState.optimize,
            countrySpecificIds: {
              ...prevState.optimize?.countries?.ids,
              [countryKey]: {
                ...prevState.optimize?.countries?.ids[countryKey],
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
                  currentSettings?.countries?.ids[countryKey],
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
                    currentSettings?.countries?.ids[countryKey]?.isEnabled ||
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
                    currentSettings?.countries?.ids[countryKey]?.optimizeId ||
                    ""
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

export function EnabledOptimizeCountries({
  currentSettings,
}: {
  currentSettings: OptimizeSettings;
}): JSX.Element {
  let statusMessage: string;
  if (
    currentSettings.settingsType === "simple" &&
    currentSettings.simple?.isEnabled &&
    currentSettings.simple?.optimizeId
  ) {
    statusMessage = `Enabled in all Countries (${currentSettings.simple.optimizeId})`;
  } else if (
    currentSettings.countries?.ids &&
    currentSettings.settingsType === "country"
  ) {
    const enabledCountries = currentSettings?.countries?.ids
      ? Object.entries(currentSettings?.countries?.ids)
          .filter(
            ([countryKey, data]) =>
              data.isEnabled &&
              data.optimizeId &&
              COUNTRIES[countryKey as CountryCodes],
          )
          .map(([countryKey]) => COUNTRIES[countryKey as CountryCodes])
          .join(", ")
      : undefined;
    statusMessage = enabledCountries
      ? `Enabled for: ${enabledCountries}`
      : "No countries enabled";
  } else {
    statusMessage = "No countries enabled";
  }

  return (
    <p
      className={cn(
        "text-sm",
        isOptimizeEnabled(currentSettings) ? "text-green-600" : "text-red-600",
      )}
    >
      {statusMessage}
    </p>
  );
}

export function isOptimizeEnabled(currentSettings: OptimizeSettings): boolean {
  return !!(
    (currentSettings.settingsType === "simple" &&
      currentSettings.simple?.isEnabled) ||
    (currentSettings.settingsType === "country" &&
      currentSettings.countries?.ids &&
      Object.values(currentSettings.countries.ids).some(
        (country) => country.isEnabled,
      ))
  );
}
