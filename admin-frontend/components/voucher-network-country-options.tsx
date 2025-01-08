"use client";

import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import type {
  SovendusAppSettings,
  VoucherNetworkLanguage,
  VoucherNetworkSettings,
} from "../../settings/app-settings";
import type {
  CountryCodes,
  LanguageCodes,
} from "../../settings/sovendus-countries";
import { LANGUAGES_BY_COUNTRIES } from "../../settings/sovendus-countries";
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

export function CountryOptions({
  currentSettings,
  setCurrentSettings,
}: {
  currentSettings: VoucherNetworkSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
}): JSX.Element {
  const getCountryStatus = (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
  ): string => {
    const country =
      currentSettings.countries[countryKey]?.languages[languageKey];
    if (!country?.trafficMediumNumber || !country?.trafficSourceNumber) {
      return "Not configured";
    }
    if (!country.isEnabled) {
      return "Disabled";
    }
    return `Source: ${country.trafficSourceNumber}, Medium: ${country.trafficMediumNumber}`;
  };

  const isCountryEnabled = (
    country: VoucherNetworkLanguage | undefined,
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
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
    checked: boolean,
  ): void => {
    setCurrentSettings((prevState) => {
      const element =
        prevState.voucherNetwork.countries[countryKey]?.languages?.[
          languageKey
        ];
      if (
        element?.trafficMediumNumber &&
        element?.trafficSourceNumber &&
        checked !== element.isEnabled
      ) {
        return {
          ...prevState,
          voucherNetwork: {
            ...prevState.voucherNetwork,
            countries: {
              [countryKey]: {
                ...prevState.voucherNetwork.countries[countryKey],
                languages: {
                  ...prevState.voucherNetwork.countries[countryKey]?.languages,
                  [languageKey]: {
                    ...element,
                    isEnabled:
                      element.trafficMediumNumber &&
                      element.trafficSourceNumber &&
                      checked,
                  },
                },
              },
            },
          },
        } as SovendusAppSettings;
      }
      return prevState;
    });
  };
  const handleIdChange = (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
    field: "trafficSourceNumber" | "trafficMediumNumber",
    value: string,
  ): void => {
    setCurrentSettings((prevState) => {
      const newValue = String(parseInt(`${value}`, 10));
      const element =
        prevState.voucherNetwork.countries[countryKey]?.languages?.[
          languageKey
        ];
      if (element?.[field] !== newValue) {
        const newState = {
          ...prevState,
          voucherNetwork: {
            ...prevState.voucherNetwork,
            countries: {
              ...prevState.voucherNetwork.countries,
              [countryKey]: {
                ...prevState.voucherNetwork.countries[countryKey],
                languages: {
                  ...prevState.voucherNetwork.countries[countryKey]?.languages,
                  [languageKey]: {
                    ...element,
                    [field]: newValue,
                  },
                },
              },
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
      {Object.entries(LANGUAGES_BY_COUNTRIES).map(([countryKey, languages]) =>
        Object.entries(languages).map(([languageKey, countryName]) => (
          <CountrySettings
            key={countryKey}
            countryKey={countryKey as CountryCodes}
            languageKey={languageKey as LanguageCodes}
            countryName={countryName}
            currentSettings={currentSettings}
            getCountryStatus={getCountryStatus}
            isCountryEnabled={isCountryEnabled}
            handleEnabledChange={handleEnabledChange}
            handleIdChange={handleIdChange}
          />
        )),
      )}
    </Accordion>
  );
}

function CountrySettings({
  countryName,
  currentSettings,
  countryKey,
  languageKey,
  getCountryStatus,
  isCountryEnabled,
  handleEnabledChange,
  handleIdChange,
}: {
  countryKey: CountryCodes;
  languageKey: LanguageCodes;
  countryName: string;
  currentSettings: VoucherNetworkSettings;
  getCountryStatus: (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
  ) => string;
  isCountryEnabled: (language: VoucherNetworkLanguage | undefined) => boolean;
  handleEnabledChange: (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
    checked: boolean,
  ) => void;
  handleIdChange: (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
    field: "trafficSourceNumber" | "trafficMediumNumber",
    value: string,
  ) => void;
}): JSX.Element {
  const currentElement =
    currentSettings.countries[countryKey]?.languages[languageKey];
  const isEnabled = isCountryEnabled(currentElement);
  const trafficSourceNumber = parseInt(
    currentElement?.trafficSourceNumber || "",
  );
  const trafficMediumNumber = parseInt(
    currentElement?.trafficMediumNumber || "",
  );
  return (
    <AccordionItem value={countryKey} key={countryKey}>
      <AccordionTrigger>
        <div className="flex items-center justify-between w-full">
          <span>{countryName}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {getCountryStatus(countryKey, languageKey)}
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
              onCheckedChange={(checked): void =>
                handleEnabledChange(countryKey, languageKey, checked)
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
                onChange={(e): void =>
                  handleIdChange(
                    countryKey,
                    languageKey,
                    "trafficSourceNumber",
                    e.target.value,
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
                onChange={(e): void =>
                  handleIdChange(
                    countryKey,
                    languageKey,
                    "trafficMediumNumber",
                    e.target.value,
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
