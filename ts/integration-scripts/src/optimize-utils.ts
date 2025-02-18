import type { SovendusAppSettings } from "sovendus-integration-types";
import { CountryCodes } from "sovendus-integration-types";

import { detectCountryCode } from "./utils";

export function getOptimizeId(
  settings: SovendusAppSettings,
  country: CountryCodes | "UK" | undefined,
): string | undefined {
  if (settings?.optimize?.settingsType === "simple") {
    if (
      settings?.optimize?.simple?.globalEnabled !== false &&
      settings?.optimize?.simple?.globalId
    ) {
      return settings.optimize.simple.globalId;
    }
  } else {
    if (settings.optimize?.countries?.ids) {
      const uncleanedCountryCode: CountryCodes | "UK" | undefined =
        country || detectCountryCode();
      const countryCode =
        uncleanedCountryCode === "UK" ? CountryCodes.GB : uncleanedCountryCode;
      if (countryCode) {
        const countryElement = settings.optimize.countries?.ids?.[countryCode];
        return countryElement?.isEnabled
          ? countryElement?.optimizeId
          : undefined;
      }
      const fallbackId: string | undefined =
        settings?.optimize?.countries?.fallBackId;
      if (settings.optimize?.countries.fallBackEnabled && fallbackId) {
        return fallbackId;
      }
    }
  }
  return undefined;
}
