import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";
import type {
  CountryCodes,
  LanguageCodes,
  SovendusAppSettings,
  VoucherNetworkLanguage,
  VoucherNetworkSettings,
} from "sovendus-integration-types";
import { LANGUAGES_BY_COUNTRIES } from "sovendus-integration-types";

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
  currentSettings: VoucherNetworkSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  countryCodes: CountryCodes[];
};

export function CountryOptions({
  currentSettings,
  setCurrentSettings,
  countryCodes,
}: CountryOptionsProps): JSX.Element {
  const getCountryStatus = (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
  ): string => {
    const country =
      currentSettings.countries?.ids?.[countryKey]?.languages[languageKey];
    if (
      !cleanTrafficNumbers(country?.trafficMediumNumbers)?.length ||
      !cleanTrafficNumbers(country?.trafficSourceNumbers)?.length
    ) {
      return "Not configured";
    }
    if (!country?.isEnabled) {
      return "Disabled";
    }
    return `Source: ${country.trafficSourceNumbers[0]}, Medium: ${country.trafficMediumNumbers[0]}`;
  };

  const isCountryEnabled = (
    country: VoucherNetworkLanguage | undefined,
    isEnabled?: boolean,
  ): boolean => {
    return (
      !!(
        (isEnabled !== undefined ? isEnabled : country?.isEnabled) &&
        cleanTrafficNumbers(country?.trafficSourceNumbers)?.length &&
        cleanTrafficNumbers(country?.trafficMediumNumbers)?.length
      ) || false
    );
  };
  const handleEnabledChange = (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
    checked: boolean,
  ): void => {
    setCurrentSettings((prevState) => {
      const element =
        prevState.voucherNetwork.countries?.ids?.[countryKey]?.languages?.[
          languageKey
        ];
      if (element && isCountryEnabled(element)) {
        const newState = {
          ...prevState,
          voucherNetwork: {
            ...prevState.voucherNetwork,
            countries: {
              ...prevState.voucherNetwork.countries,
              [countryKey]: {
                ...prevState.voucherNetwork.countries,
                ids: {
                  ...prevState.voucherNetwork.countries?.ids?.[countryKey],
                  languages: {
                    ...prevState.voucherNetwork.countries?.ids?.[countryKey]
                      ?.languages,
                    [languageKey]: {
                      ...element,
                      isEnabled:
                        cleanTrafficNumbers(element.trafficMediumNumbers)
                          ?.length &&
                        cleanTrafficNumbers(element.trafficSourceNumbers)
                          ?.length &&
                        checked,
                    },
                  },
                },
              },
            },
          },
        } as SovendusAppSettings;
        return newState;
      }
      return prevState;
    });
  };
  const handleIdChange = (
    countryKey: CountryCodes,
    languageKey: LanguageCodes,
    field: "trafficSourceNumbers" | "trafficMediumNumbers",
    values: string[],
  ): void => {
    setCurrentSettings((prevState) => {
      const newValues = values.map((value) => String(parseInt(`${value}`, 10)));
      const element =
        prevState.voucherNetwork.countries?.ids?.[countryKey]?.languages?.[
          languageKey
        ];
      if (JSON.stringify(element?.[field]) !== JSON.stringify(newValues)) {
        const newElement: VoucherNetworkLanguage = {
          iframeContainerId: "",
          trafficMediumNumbers: [],
          trafficSourceNumbers: [],
          isEnabled: false,
          ...element,
          [field]: newValues,
        };
        const isEnabled = isCountryEnabled(newElement, true);
        const newState: SovendusAppSettings = {
          ...prevState,
          voucherNetwork: {
            ...prevState.voucherNetwork,
            settingType: "country",
            cookieTracking: true,
            countries: {
              ...prevState.voucherNetwork.countries,
              fallBackIds: undefined,
              ids: {
                ...prevState.voucherNetwork.countries?.ids,
                [countryKey]: {
                  ...prevState.voucherNetwork.countries?.ids?.[countryKey],
                  languages: {
                    ...prevState.voucherNetwork.countries?.ids?.[countryKey]
                      ?.languages,
                    [languageKey]: {
                      ...newElement,
                      isEnabled,
                    },
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
    <Accordion type="single" collapsible className={cn("w-full")}>
      {countryCodes.map((countryKey) =>
        Object.entries(LANGUAGES_BY_COUNTRIES[countryKey]).map(
          ([languageKey, countryName]) => (
            <CountrySettings
              key={`${countryKey}-${languageKey}`}
              countryKey={countryKey}
              languageKey={languageKey as LanguageCodes}
              countryName={countryName}
              currentSettings={currentSettings}
              getCountryStatus={getCountryStatus}
              isCountryEnabled={isCountryEnabled}
              handleEnabledChange={handleEnabledChange}
              handleIdChange={handleIdChange}
            />
          ),
        ),
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
    field: "trafficSourceNumbers" | "trafficMediumNumbers",
    value: string[],
  ) => void;
}): JSX.Element {
  const currentElement =
    currentSettings.countries?.ids?.[countryKey]?.languages[languageKey];
  const isEnabled = isCountryEnabled(currentElement);
  const trafficSourceNumber = parseInt(
    cleanTrafficNumbers(currentElement?.trafficSourceNumbers)?.[0] || "",
  );
  const trafficMediumNumber = parseInt(
    cleanTrafficNumbers(currentElement?.trafficMediumNumbers)?.[0] || "",
  );
  return (
    <AccordionItem value={countryKey} key={countryKey}>
      <AccordionTrigger>
        <div className={cn("flex items-center justify-between w-full")}>
          <span>{countryName}</span>
          <div className={cn("flex items-center space-x-2")}>
            <span className={cn("text-sm text-muted-foreground")}>
              {getCountryStatus(countryKey, languageKey)}
            </span>
            {isEnabled && (
              <Badge
                variant={"default"}
                className={cn(
                  "ml-2",
                  "bg-green-100 text-green-800 hover:bg-green-100",
                )}
              >
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
              checked={isEnabled}
              onCheckedChange={(checked): void =>
                handleEnabledChange(countryKey, languageKey, checked)
              }
            />
            <label htmlFor={`${countryKey}-enabled`}>
              Enable for {countryName}
            </label>
          </div>
          <div className={cn("grid grid-cols-2 gap-4")}>
            <div className={cn("space-y-2")}>
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
                    "trafficSourceNumbers",
                    [e.target.value],
                  )
                }
                placeholder="Enter Traffic Source Number"
              />
            </div>
            <div className={cn("space-y-2")}>
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
                    "trafficMediumNumbers",
                    [e.target.value],
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

export function EnabledVoucherNetworkCountries({
  currentSettings,
}: {
  currentSettings: VoucherNetworkSettings;
}): JSX.Element {
  const enabledLocales: string[] = [];
  if (currentSettings.countries?.ids) {
    for (const [countryCode, country] of Object.entries(
      currentSettings.countries.ids,
    )) {
      if (country.languages) {
        for (const [languageKey, language] of Object.entries(
          country.languages,
        )) {
          if (
            language.isEnabled &&
            cleanTrafficNumbers(language.trafficMediumNumbers)?.length &&
            cleanTrafficNumbers(language.trafficSourceNumbers)?.length
          ) {
            const countryName = LANGUAGES_BY_COUNTRIES[
              countryCode as CountryCodes
            ][languageKey as LanguageCodes] as string;

            enabledLocales.push(countryName);
          }
        }
      }
    }
  }
  return (
    <p
      className={cn(
        "text-sm",
        isVnEnabled(currentSettings) ? "text-green-600" : "text-red-600",
      )}
    >
      {enabledLocales.length > 0 ? (
        <>
          <span>Enabled for: </span>
          {enabledLocales.join(", ")}
        </>
      ) : (
        <span>No countries enabled</span>
      )}
    </p>
  );
}

export function isVnEnabled(
  currentSettings: VoucherNetworkSettings,
  isEnabled?: boolean,
): boolean {
  return currentSettings.countries?.ids
    ? Object.values(currentSettings.countries?.ids).some((country) =>
        Object.values(country.languages)?.some(
          (lang) =>
            (isEnabled !== undefined ? isEnabled : lang.isEnabled) &&
            cleanTrafficNumbers(lang.trafficMediumNumbers)?.length &&
            cleanTrafficNumbers(lang.trafficSourceNumbers)?.length,
        ),
      )
    : false;
}

function cleanTrafficNumbers(
  trafficNumbers: string[] | undefined,
): string[] | undefined {
  return trafficNumbers
    ?.map((num) => num.trim())
    .filter((num) => num && /^\d+$/.test(num) && !isNaN(Number(String(num))));
}
