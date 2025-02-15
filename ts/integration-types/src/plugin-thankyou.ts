import type { CountryCodes, LanguageCodes } from "./countries";
import type { SovDebugLevel } from "./general";
import type { SovendusPageUrlParams } from "./plugin-page";
import type { SovendusAppSettings } from "./plugin-settings";
import type {
  ProfityAppType,
  SovCbVnApplicationType,
  VariableIdentifiersType,
} from "./thank-you";

export interface SovendusThankyouPageData {
  sovThankyouPageConfig: SovendusThankYouPageConfig;
  sovThankyouPageStatus: IntegrationDataType;
}

export interface SovendusThankYouPageConfig {
  settings: SovendusAppSettings;
  integrationType: string;
  sovDebugLevel: SovDebugLevel | undefined;
  orderData: {
    sessionId: string | undefined;
    timestamp: string | undefined;
    orderId: string | undefined;
    orderValue: string | undefined;
    orderCurrency: SovendusOrderCurrencies | undefined;
    // multiple coupon codes can be used
    usedCouponCodes: string[] | undefined;
    // or only one
    usedCouponCode: string | undefined;
  };
  customerData: SovendusConsumerType;
}

export interface IntegrationDataType {
  data: SovendusThankYouCookieData | undefined;
  status: {
    integrationLoaderStarted: boolean;
    integrationParametersLoaded: boolean;
    checkoutProductsPixelFired: boolean;
    integrationLoaderVnCbStarted: boolean;
    integrationLoaderDone: boolean;

    shouldSendRedemption?: boolean;
    RedemptionSent?: boolean;
  };
  times: {
    integrationLoaderStart: number | undefined;
    integrationLoaderVnCbStart?: number;
    integrationLoaderDone?: number;
    VnCbLoaderStart?: number;
    vnCbLoaderInitDone?: number;
    vnCbLoaderDone?: number;
  };
}

export interface SovendusThankYouPageStatus {
  loadedOptimize: boolean;
  loadedVoucherNetwork: boolean;
  executedCheckoutProducts: boolean;
  sovThankyouConfigFound: boolean;
  countryCodePassedOnByPlugin: boolean;
}

// don't remove from interface, only add to it
export const thankyouInterfaceData: {
  cookieData: PublicThankYouCookieInterface;
  windowVariableData: PublicThankYouVariableInterface;
} = {
  // keys that are used to look for values in cookies
  cookieData: {
    sovCouponCode: { cookieName: "sovCouponCode" },
    orderValue: { cookieName: "sovOrderValue" },
    orderCurrency: { cookieName: "sovOrderCurrency" },
    orderId: { cookieName: "sovOrderId" },
    sovReqToken: { cookieName: "sovReqToken" },
    sovReqProductId: { cookieName: "sovReqProductId" },
    puid: { cookieName: "puid" },
    sovDebugLevel: { cookieName: "sovDebugLevel", persistent: true },
  },
  // keys that are used to look for values in window[VariableIdentifiersType]
  windowVariableData: {
    trafficSourceNumber: {
      alias: ["trafficSourceNumber", "shopId", "shopNumber"],
    },
    couponCode: { alias: ["couponCode", "usedCouponCode"] },
    orderValue: { alias: ["orderValue"] },
    orderCurrency: { alias: ["orderCurrency"] },
    orderId: { alias: ["orderId"] },
    sessionId: { alias: ["sessionId"] },
    iframeContainerId: { alias: ["iframeContainerId"], storeAll: true },
  },
};

export interface SovendusVNConversionsType {
  trafficSourceNumber?: string | undefined | number;
  shopId?: string | undefined | number;
  shopNumber?: string | undefined | number;
  trafficMediumNumber?: string | undefined | number;
  sessionId?: string | undefined;
  timestamp?: string | undefined | number;
  orderId?: string | undefined | number;
  orderValue?: string | undefined | number;
  orderCurrency?: SovendusOrderCurrencies | undefined;
  couponCode?: string | undefined;
  usedCouponCode?: string | undefined;
  iframeContainerId?: string;
  integrationType?: string;
  alreadyExecuted?: boolean;
}

export type RedemptionApiRequestData = {
  trafficSourceNumber: string;
  couponCode: string;
  orderValue: number | undefined;
  orderCurrency: SovendusOrderCurrencies | undefined;
  orderId: string | undefined;
  sessionId: string | undefined;
};

export interface SovendusThankYouCookieData extends SovendusPageUrlParams {
  orderValue: string | undefined;
  orderCurrency: string | undefined;
  orderId: string | undefined;
}

export type PublicThankYouCookieInterface = {
  [interfaceKey in keyof SovendusThankYouCookieData]: {
    cookieName: string;
    persistent?: boolean;
  };
};

export type PublicThankYouVariableInterface = {
  [interfaceKey in keyof SovendusVNConversionsType]: {
    alias: string[];
    storeAll?: true;
  };
};

export interface SovendusPublicConversionWindow extends Window {
  // from partner provided
  sovIframes?: SovendusVNConversionsType[];
  sovConsumer?: SovendusConsumerType;
  AWIN?: AwinConversion;

  // legacy
  [VariableIdentifiersType.legacy_integrationIdentifier_sovAbo]?:
    | SovendusVNConversionsType[]
    | SovendusVNConversionsType;
  [VariableIdentifiersType.legacy_integrationIdentifier_gconData]?: [
    string,
    any,
  ][];
  profity?: ProfityAppType;

  // diagnostic infos
  // sovIntegrationInfo?: IntegrationDataType;
  sovApplication?: SovCbVnApplicationType;
}

export interface AwinConversion {
  Tracking?: {
    Sovendus?: { trafficSourceNumber?: string; trafficMediumNumber?: string };
    Sale?: object;
    iMerchantId: number;
  };
}

export interface SovendusConsumerType {
  consumerSalutation?: SovendusSalutation | undefined;
  consumerFirstName?: string | undefined;
  consumerLastName?: string | undefined;
  consumerPhone?: string | undefined;
  consumerYearOfBirth?: number | string | undefined;
  consumerDateOfBirth?: string | undefined;
  consumerEmail?: string | undefined;
  consumerEmailHash?: string | undefined; // md5 hash
  consumerZipcode?: string | undefined;
  // use either street and number separately or streetWithNumber
  consumerStreet?: string | undefined;
  consumerStreetNumber?: string | undefined;
  consumerStreetWithNumber?: string | undefined;
  consumerCity?: string | undefined;

  consumerCountry: CountryCodes | "UK"; // UK is a special case, can be GB or UK
  // if possible pass on the language, we have a fallback but it might not be as accurate
  consumerLanguage: LanguageCodes | undefined;
}

export type SovendusSalutation = "Mr." | "Mrs.";

export type SovendusOrderCurrencies =
  | "EUR"
  | "GBP"
  | "CHF"
  | "SEK"
  | "DKK"
  | "PLN";
