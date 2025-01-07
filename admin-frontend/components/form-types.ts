export type VoucherNetworkCountryCode =
  | "de-AT"
  | "fr-BE"
  | "nl-BE"
  | "da-DK"
  | "fr-FR"
  | "de-DE"
  | "en-IE"
  | "it-IT"
  | "nl-NL"
  | "nb-NO"
  | "pl-PL"
  | "es-ES"
  | "sv-SE"
  | "de-CH"
  | "fr-CH"
  | "it-CH"
  | "en-GB";

export const voucherNetworkCountries: {
  [key in VoucherNetworkCountryCode]: string;
} = {
  "de-AT": "Austria",
  "fr-BE": "Belgium French",
  "nl-BE": "Belgium Dutch",
  "da-DK": "Denmark",
  "fr-FR": "France",
  "de-DE": "Germany",
  "en-IE": "Ireland",
  "it-IT": "Italy",
  "nl-NL": "Netherlands",
  "nb-NO": "Norway",
  "pl-PL": "Poland",
  "es-ES": "Spain",
  "sv-SE": "Sweden",
  "de-CH": "Switzerland German",
  "fr-CH": "Switzerland French",
  "it-CH": "Switzerland Italian",
  "en-GB": "United Kingdom",
};



export type OptimizeCountryCode =
  | "AT"
  | "BE"
  | "DK"
  | "FR"
  | "DE"
  | "IE"
  | "IT"
  | "NL"
  | "NO"
  | "PL"
  | "ES"
  | "SE"
  | "CH"
  | "GB";

export const optimizeCountries: { [key in OptimizeCountryCode]: string } = {
  AT: "Austria",
  BE: "Belgium",
  DK: "Denmark",
  FR: "France",
  DE: "Germany",
  IE: "Ireland",
  IT: "Italy",
  NL: "Netherlands",
  NO: "Norway",
  PL: "Poland",
  ES: "Spain",
  SE: "Sweden",
  CH: "Switzerland",
  GB: "United Kingdom",
};
