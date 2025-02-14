import type { CountryCodes, LanguageCodes } from "./countries";

export interface SovendusAppSettings {
  voucherNetwork: VoucherNetworkSettings;
  optimize: OptimizeSettings;
  checkoutProducts: boolean;
  version: Versions.THREE;
}

export interface VoucherNetworkSettings {
  countries?: { [key in CountryCodes]?: VoucherNetworkCountry } | undefined;
  simple?: VoucherNetworkSettingsSimple | undefined;
  settingType: SettingsType;
  cookieTracking: boolean;
}

export interface OptimizeSettings {
  settingsType: SettingsType;
  simple?: {
    globalId: string | undefined;
    globalEnabled: boolean;
  };
  countries?: {
    fallBackEnabled: boolean;
    fallBackId: string | undefined;
    ids: { [key in CountryCodes]?: OptimizeCountry };
  };
}

export interface VoucherNetworkSettingsSimple {
  trafficSourceNumber: string | undefined;
  trafficMediumNumber: string | undefined;
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
