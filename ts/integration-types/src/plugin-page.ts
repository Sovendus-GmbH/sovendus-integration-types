import type { CountryCodes } from "./countries";
import type { SovDebugLevel } from "./general";
import { type SovendusAppSettings, Versions } from "./plugin-settings";

export const sovendusPageApis = {
  // this only gets called when a optimize id is set
  // you don't have to whitelist this domain if you don't want to use Sovendus Optimize
  optimize: "https://www.sovopt.com/",
} as const;

export const defaultSovendusPageConfig: SovendusPageConfig = {
  settings: {
    voucherNetwork: {
      countries: undefined,
      simple: undefined,
      settingType: undefined,
      cookieTracking: true,
    },
    optimize: {
      settingsType: undefined,
      simple: {
        globalEnabled: false,
        globalId: undefined,
      },
      countries: undefined,
    },
    checkoutProducts: true,
    version: Versions.THREE,
  },
  country: undefined,
  integrationType: "",
} as const;

export interface SovendusPageData {
  sovPageConfig: SovendusPageConfig;
  sovPageStatus: SovPageStatus;
}

export interface SovendusPageConfig {
  settings: SovendusAppSettings;
  integrationType: string;
  country: CountryCodes | undefined | "UK"; // UK is a special case, can be GB or UK;
}

export type SovendusPageUrlParams = {
  sovCouponCode: string | undefined;
  sovReqToken: string | undefined;
  sovReqProductId: string | undefined;
  puid: string | undefined;
  sovDebugLevel: SovDebugLevel;
};

export type SovendusPageUrlParamKeys = keyof SovendusPageUrlParams;
export interface SovPageStatus {
  integrationScriptVersion: string;
  urlData: SovendusPageUrlParams;
  status: {
    sovPageConfigFound: boolean;
    loadedOptimize: boolean;
    storedCookies: boolean;
  };
  times: {
    integrationLoaderStart: number;
    integrationLoaderDone?: number;
  };
}
