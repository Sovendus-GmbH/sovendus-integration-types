import type { CountryCodes } from "sovendus-integration-types";

export function getPerformanceTime(): number {
  return window.performance?.now?.() || 0;
}

export function loggerError(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  ...other: unknown[]
): void {
  // eslint-disable-next-line no-console
  console.error(`Sovendus App [${pageType}] - ${message}`, ...other);
}

function getCountryCodeFromHtmlTag(): CountryCodes | undefined {
  const lang = document.documentElement.lang;
  const countryCode = lang.split("-")[1];
  return countryCode ? (countryCode.toUpperCase() as CountryCodes) : undefined;
}

function getCountryFromDomain(): CountryCodes | undefined {
  const domainToCountry: {
    [key: string]: string | undefined;
  } = {
    "de": "DE",
    "at": "AT",
    "ch": "CH",
    "uk": "GB",
    "co.uk": "GB",
    "com": undefined,
    "se": "SE",
    "no": "NO",
    "dk": "DK",
    "fi": "FI",
    "fr": "FR",
    "be": "BE",
    "nl": "NL",
    "it": "IT",
    "es": "ES",
    "pt": "PT",
    "pl": "PL",
    "cz": "CZ",
    "sk": "SK",
    "hu": "HU",
  };
  const domain = window.location.hostname;
  const domainParts = domain.split(".");
  const domainPart = domainParts[domainParts.length - 1];
  return (domainPart ? domainToCountry[domainPart] : undefined) as
    | CountryCodes
    | undefined;
}

function getCountryFromPagePath(): CountryCodes | undefined {
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const country = pathParts[1];
  return country?.toUpperCase() as CountryCodes | undefined;
}

export function detectCountryCode(): CountryCodes | undefined {
  return (
    getCountryCodeFromHtmlTag() ||
    getCountryFromDomain() ||
    getCountryFromPagePath()
  );
}
