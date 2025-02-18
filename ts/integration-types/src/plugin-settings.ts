import type { CountryCodes, LanguageCodes } from "./countries";

export interface SovendusAppSettings {
  voucherNetwork: VoucherNetworkSettings;
  optimize: OptimizeSettings;
  checkoutProducts: boolean;
  version: Versions.THREE;
}

export interface VoucherNetworkSettings {
  settingType: SettingsType;
  countries?: VoucherNetworkSettingsCountries;
  simple?: VoucherNetworkLanguage;
  cookieTracking: boolean;
}

export interface VoucherNetworkSettingsCountries {
  fallBackIds: VoucherNetworkLanguage | undefined;
  ids: { [key in CountryCodes]?: VoucherNetworkCountry };
}

export interface OptimizeSettings {
  settingsType: SettingsType;
  simple?: OptimizeCountry;
  countries?: OptimizeSettingsCountries;
}

export interface OptimizeSettingsCountries {
  fallBackEnabled: boolean;
  fallBackId: string | undefined;
  ids: { [key in CountryCodes]?: OptimizeCountry };
}

export type SettingsType = "simple" | "country" | undefined;

export interface VoucherNetworkCountry {
  languages: { [key in LanguageCodes]?: VoucherNetworkLanguage };
}

export interface OptimizeCountry {
  isEnabled: boolean;
  optimizeId: string;
}

export interface VoucherNetworkLanguage {
  isEnabled: boolean;
  trafficSourceNumbers: string[];
  trafficMediumNumbers: string[];
  iframeContainerId: string;
}

export enum Versions {
  ONE = "1",
  TWO = "2",
  THREE = "3",
}
