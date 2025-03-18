import type { CountryCodes, LanguageCodes } from "./countries";

export interface SettingsUiWindow extends Window {
  sovSettingsUi: {
    currentSettings: SovendusAppSettings;
    saveSettings: (
      saveSettings: SovendusAppSettings,
    ) => Promise<SovendusAppSettings>;
    settingsContainerId: string;
  };
}

export enum Versions {
  ONE = "1",
  TWO = "2",
  THREE = "3",
}

export const defaultSovendusAppSettings: SovendusAppSettings = {
  voucherNetwork: {
    settingType: undefined,
    cookieTracking: true,
  },
  optimize: {
    settingsType: undefined,
  },
  checkoutProducts: true,
  version: Versions.THREE,
  employeeBenefits: {
    isEnabled: false,
    showWidgetOnDashboard: false,
    addToSidebar: false,
  },
} as const;

export const defaultIframeContainerId = "sovendus-container";

export interface SovendusAppSettings {
  voucherNetwork: VoucherNetworkSettings;
  optimize: OptimizeSettings;
  checkoutProducts: boolean;
  employeeBenefits: EmployeeBenefitsSettings;
  version: Versions.THREE;
}

export interface EmployeeBenefitsSettings {
  isEnabled: false;
  showWidgetOnDashboard: false;
  addToSidebar: false;
}

export interface VoucherNetworkSettings {
  settingType: SettingsType;
  countries?: VoucherNetworkSettingsCountries;
  simple?: VoucherNetworkLanguage;
  cookieTracking: boolean;
}

export interface VoucherNetworkSettingsCountries {
  fallBackIds: VoucherNetworkLanguage | undefined;
  iframeContainerQuerySelector: string | undefined;
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
  trafficSourceNumber: string;
  trafficMediumNumber: string;
  iframeContainerQuerySelector: string | undefined;
}
