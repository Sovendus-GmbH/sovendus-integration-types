export enum CountryCodes {
  AT = "AT",
  BE = "BE",
  DK = "DK",
  FI = "FI",
  FR = "FR",
  DE = "DE",
  IE = "IE",
  IT = "IT",
  NL = "NL",
  NO = "NO",
  PL = "PL",
  PT = "PT",
  ES = "ES",
  SE = "SE",
  CH = "CH",
  GB = "GB",
}

export enum LanguageCodes {
  DA = "DA",
  FI = "FI",
  FR = "FR",
  DE = "DE",
  EN = "EN",
  IT = "IT",
  NL = "NL",
  NB = "NB",
  PL = "PL",
  PT = "PT",
  ES = "ES",
  SV = "SV",
}

export type CountryMap = {
  [key in CountryCodes]: string;
};

export type LanguageMap = Partial<{
  [key in LanguageCodes]: string;
}>;

export type CountryLanguageMap = {
  [key in CountryCodes]: LanguageMap;
};

export const COUNTRIES: CountryMap = {
  [CountryCodes.AT]: "Austria",
  [CountryCodes.BE]: "Belgium",
  [CountryCodes.DK]: "Denmark",
  [CountryCodes.FI]: "Finland",
  [CountryCodes.FR]: "France",
  [CountryCodes.DE]: "Germany",
  [CountryCodes.IE]: "Ireland",
  [CountryCodes.IT]: "Italy",
  [CountryCodes.NL]: "Netherlands",
  [CountryCodes.NO]: "Norway",
  [CountryCodes.PL]: "Poland",
  [CountryCodes.PT]: "Portugal",
  [CountryCodes.ES]: "Spain",
  [CountryCodes.SE]: "Sweden",
  [CountryCodes.CH]: "Switzerland French",
  [CountryCodes.GB]: "United Kingdom",
};

export const LANGUAGES_BY_COUNTRIES: CountryLanguageMap = {
  [CountryCodes.AT]: { [LanguageCodes.DE]: "Austria" },
  [CountryCodes.BE]: {
    [LanguageCodes.FR]: "Belgium French",
    [LanguageCodes.NL]: "Belgium Dutch",
  },
  [CountryCodes.DK]: { [LanguageCodes.DA]: "Denmark" },
  [CountryCodes.FI]: { [LanguageCodes.FI]: "Finland" },
  [CountryCodes.FR]: { [LanguageCodes.FR]: "France" },
  [CountryCodes.DE]: { [LanguageCodes.DE]: "Germany" },
  [CountryCodes.IE]: { [LanguageCodes.EN]: "Ireland" },
  [CountryCodes.IT]: { [LanguageCodes.IT]: "Italy" },
  [CountryCodes.NL]: { [LanguageCodes.NL]: "Netherlands" },
  [CountryCodes.NO]: { [LanguageCodes.NB]: "Norway" },
  [CountryCodes.PL]: { [LanguageCodes.PL]: "Poland" },
  [CountryCodes.PT]: { [LanguageCodes.PT]: "Portugal" },
  [CountryCodes.ES]: { [LanguageCodes.ES]: "Spain" },
  [CountryCodes.SE]: { [LanguageCodes.SV]: "Sweden" },
  [CountryCodes.CH]: {
    [LanguageCodes.FR]: "Switzerland French",
    [LanguageCodes.DE]: "Switzerland German",
    [LanguageCodes.IT]: "Switzerland Italian",
  },
  [CountryCodes.GB]: { [LanguageCodes.EN]: "United Kingdom" },
};
