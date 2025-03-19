import type { CountryCodes, LanguageCodes } from "./countries";
import type { ExplicitAnyType, SovDebugLevel } from "./general";
import type { SovendusPageUrlParams } from "./plugin-page";
import {
  defaultSovendusAppSettings,
  type SovendusAppSettings,
} from "./plugin-settings";
import type {
  SovCbVnApplicationType,
  VariableIdentifiersType,
} from "./thank-you";

export const defaultSovendusThankyouPageConfig: SovendusThankYouPageConfig = {
  settings: defaultSovendusAppSettings,
  integrationType: "",
  sovDebugLevel: undefined,
  iframeContainerId: undefined,
  orderData: {},
  customerData: {},
} as const;

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

export interface SovendusThankyouPageData {
  sovThankyouConfig: SovendusThankYouPageConfig;
  sovThankyouStatus: IntegrationData;
}

export interface SovendusThankyouWindow
  extends Window,
    SovendusThankyouPageData {}

export interface SovendusThankYouPageConfig {
  settings: SovendusAppSettings;
  integrationType: string;
  iframeContainerId?: string | undefined;
  sovDebugLevel: SovDebugLevel | undefined;
  orderData: SovendusConversionsData;
  customerData: SovendusConsumerData;
}

export interface SovendusConversionsData {
  sessionId?: string | undefined;
  orderId?: string | undefined;
  // either define netOrderValue
  netOrderValue?: number | string | undefined;
  // or define grossOrderValue, shippingValue and taxValue
  grossOrderValue?: number | string | undefined;
  shippingValue?: number | string | undefined;
  taxValue?: number | string | undefined;

  orderCurrency?: SovendusOrderCurrencies | undefined;
  // multiple coupon codes can be used
  usedCouponCodes?: string[] | undefined;
  // or only one
  usedCouponCode?: string | undefined;
}

export interface IntegrationData {
  integrationScriptVersion: string;
  data: PublicThankYouCookieData | undefined;
  status: {
    integrationLoaderStarted: boolean;
    sovThankyouConfigFound: boolean;
    countryCodePassedOnByPlugin: boolean;
    integrationParametersLoaded: boolean;
    checkoutProductsPixelFired: boolean;
    loadedOptimize: boolean;
    voucherNetworkLinkTrackingSuccess: boolean;
    voucherNetworkIframeContainerFound: boolean;
    voucherNetworkIframeContainerIdFound: boolean;
    integrationLoaderVnCbStarted: boolean;
    integrationLoaderDone: boolean;
  };
  times: {
    integrationLoaderStart: number | undefined;
    integrationLoaderVnCbStart?: number;
    integrationLoaderDone?: number;
  };
}

export interface SovendusThankYouPageStatus {
  loadedOptimize: boolean;
  loadedVoucherNetwork: boolean;
  executedCheckoutProducts: boolean;
  sovThankyouConfigFound: boolean;
  countryCodePassedOnByPlugin: boolean;
}

export interface SovendusVNConversion {
  trafficSourceNumber?: string | undefined | number;
  // shopId?: string | undefined | number;
  // shopNumber?: string | undefined | number;
  trafficMediumNumber?: string | undefined | number;
  sessionId?: string | undefined;
  orderId?: string | undefined | number;
  orderValue?: string | undefined | number;
  orderCurrency?: SovendusOrderCurrencies | undefined;
  couponCode?: string | undefined;
  usedCouponCode?: string | undefined;
  iframeContainerId?: string;
  integrationType?: string;
  // alreadyExecuted?: boolean;
}

export type RedemptionApiRequestData = {
  trafficSourceNumber: string;
  couponCode: string;
  orderValue: number | undefined;
  orderCurrency: SovendusOrderCurrencies | undefined;
  orderId: string | undefined;
  sessionId: string | undefined;
};

export interface PublicThankYouCookieData extends SovendusPageUrlParams {
  orderValue: number | undefined;
  orderCurrency: SovendusOrderCurrencies | undefined;
  orderId: string | undefined;
}

export type PublicThankYouCookieInterface = {
  [interfaceKey in keyof PublicThankYouCookieData]: {
    cookieName: string;
    persistent?: boolean;
  };
};

export type PublicThankYouVariableInterface = {
  [interfaceKey in keyof SovendusVNConversion]: {
    alias: string[];
    storeAll?: true;
  };
};

export interface SovendusPublicConversionWindow extends Window {
  // from partner provided
  sovIframes?: SovendusVNConversion[];
  sovConsumer?: SovendusConsumerData;
  AWIN?: AwinConversion;

  // legacy
  [VariableIdentifiersType.legacy_integrationIdentifier_sovAbo]?:
    | SovendusVNConversion[]
    | SovendusVNConversion;
  [VariableIdentifiersType.legacy_integrationIdentifier_gconData]?: [
    string,
    ExplicitAnyType,
  ][];
  // profity?: ProfityAppType;

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

export interface SovendusConsumerData {
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

  consumerCountry?: undefined | CountryCodes | "UK"; // UK is a special case, can be GB or UK
  // if possible pass on the language, we have a fallback but it might not be as accurate
  consumerLanguage?: LanguageCodes | undefined;
}

export type SovendusSalutation = "Mr." | "Mrs.";

export type SovendusOrderCurrencies =
  | "EUR"
  | "GBP"
  | "CHF"
  | "SEK"
  | "DKK"
  | "PLN";
