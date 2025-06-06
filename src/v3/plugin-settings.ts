import type { CountryCodes, LanguageCodes } from "./countries";
import type { IframeContainerQuerySelectorSettings } from "./plugin-thankyou";

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
  version: Versions.THREE,
} as const;

export const defaultIframeContainerQuerySelector: IframeContainerQuerySelectorSettings =
  { selector: "#sovendus-container", where: "none" } as const;

export interface SovendusAppSettings {
  voucherNetwork?: VoucherNetworkSettings;
  rewards?: RewardsSettings;
  optimize?: OptimizeSettings;
  checkoutProducts?: boolean;
  employeeBenefits?: EmployeeBenefitsSettings;
  version: Versions.THREE;
}

export interface EmployeeBenefitsSettings {
  isEnabled: boolean;
  showWidgetOnDashboard: boolean;
  addToSidebar: boolean;
}

export enum TriggerPages {
  MY_ACCOUNT_DASHBOARD = "myAccountDashboard",
  MY_ORDERS = "myOrders",
  MY_ORDERS_DETAIL = "myOrdersDetail",
  CUSTOM = "custom",
}

export type RewardsSettings<TSettingsType extends SettingsType = SettingsType> =
  {
    pages: {
      [triggerPage in TriggerPages]: RewardsTriggerSettings<TSettingsType>;
    };
  };

export type RewardsTriggerSettings<TSettingsType> =
  TSettingsType extends SettingsType.SIMPLE
    ? RewardsSettingsSimple
    : RewardsSettingsCountries;

export type RewardsBaseSettings = {
  trigger: RewardsTriggerMatchSettings | RewardsTriggerBuiltIn;
};

export type RewardsTriggerBuiltIn = "builtIn";
export interface RewardsTriggerMatchSettings extends RewardsBaseSettings {
  matchType: "contains" | "startsWith" | "endsWith" | "regex";
  matchValue: string;
}

export interface RewardsSettingsSimple extends RewardsBaseSettings {
  settingType: SettingsType.SIMPLE;
  simple: VoucherNetworkLanguage;
  countries?: never;
}

export interface RewardsSettingsCountries {
  settingType: SettingsType.COUNTRY;
  countries: {
    fallBackIds: VoucherNetworkLanguage | undefined;
    iframeContainerQuerySelector?:
      | IframeContainerQuerySelectorSettings
      | undefined;
    ids: { [key in CountryCodes]?: VoucherNetworkCountry };
  };
  simple?: never;
}

export type VoucherNetworkSettings<
  TSettingsType extends SettingsType = SettingsType,
> = TSettingsType extends SettingsType.SIMPLE
  ? VoucherNetworkSettingsSimple
  : VoucherNetworkSettingsCountries;

export type VoucherNetworkSettingsSimple = {
  settingType: SettingsType.SIMPLE;
  simple: VoucherNetworkLanguage;
  countries?: never;
  cookieTracking?: boolean;
};

export interface VoucherNetworkSettingsCountries {
  settingType: SettingsType.COUNTRY;
  cookieTracking?: boolean;
  countries: {
    fallBackIds: VoucherNetworkLanguage | undefined;
    iframeContainerQuerySelector?:
      | IframeContainerQuerySelectorSettings
      | undefined;
    ids: { [key in CountryCodes]?: VoucherNetworkCountry };
  };
  simple?: never;
}

export type OptimizeSettings<
  TSettingsType extends SettingsType = SettingsType,
> = TSettingsType extends SettingsType.SIMPLE
  ? OptimizeSettingsSimple
  : OptimizeSettingsCountries;

export interface OptimizeSettingsSimple {
  settingsType: SettingsType.SIMPLE;
  simple: OptimizeCountry;
  countries?: never;
}

export interface OptimizeSettingsCountries {
  settingsType: SettingsType.COUNTRY;
  countries: {
    fallBackEnabled: boolean;
    fallBackId: string | undefined;
    ids: { [key in CountryCodes]?: OptimizeCountry };
  };
  simple?: never;
}

export enum SettingsType {
  SIMPLE = "simple",
  COUNTRY = "country",
}

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
  iframeContainerQuerySelector?:
    | IframeContainerQuerySelectorSettings
    | undefined;
}
