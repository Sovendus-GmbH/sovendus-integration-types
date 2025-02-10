// ------------------------------------------------------------
// IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
// ------------------------------------------------------------

import type { JSX } from "react";
import React from "react";
import type {
  CountryCodes,
  LanguageCodes,
  OptimizeSettings,
  VoucherNetworkSettings,
} from "sovendus-integration-types";
import { COUNTRIES, LANGUAGES_BY_COUNTRIES } from "sovendus-integration-types";

import { cn } from "../admin-frontend/lib/utils";

export function EnabledVoucherNetworkCountries({
  currentSettings,
}: {
  currentSettings: VoucherNetworkSettings;
}): JSX.Element {
  const enabledLocales: string[] = [];
  for (const [countryCode, country] of Object.entries(
    currentSettings.countries,
  )) {
    for (const [languageKey, language] of Object.entries(country.languages)) {
      if (
        language.isEnabled &&
        language.trafficMediumNumber &&
        language.trafficSourceNumber
      ) {
        const countryName = LANGUAGES_BY_COUNTRIES[countryCode as CountryCodes][
          languageKey as LanguageCodes
        ] as string;

        enabledLocales.push(countryName);
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

export function isVnEnabled(currentSettings: VoucherNetworkSettings): boolean {
  return Object.values(currentSettings.countries).some((country) =>
    Object.values(country.languages)?.some(
      (lang) =>
        lang.isEnabled && lang.trafficMediumNumber && lang.trafficSourceNumber,
    ),
  );
}

export function EnabledOptimizeCountries({
  currentSettings,
}: {
  currentSettings: OptimizeSettings;
}): JSX.Element {
  let statusMessage: string;
  if (currentSettings.useGlobalId && currentSettings.globalEnabled) {
    statusMessage = `Enabled in all Countries (${currentSettings.globalId})`;
  } else if (!currentSettings.useGlobalId) {
    const enabledCountries = Object.entries(currentSettings.countrySpecificIds)
      .filter(
        ([countryKey, data]) =>
          data.isEnabled &&
          data.optimizeId &&
          COUNTRIES[countryKey as CountryCodes],
      )
      .map(([countryKey]) => COUNTRIES[countryKey as CountryCodes])
      .join(", ");
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
  return (
    (currentSettings.useGlobalId && currentSettings.globalEnabled) ||
    (!currentSettings.useGlobalId &&
      Object.values(currentSettings.countrySpecificIds).some(
        (country) => country.isEnabled,
      ))
  );
}
