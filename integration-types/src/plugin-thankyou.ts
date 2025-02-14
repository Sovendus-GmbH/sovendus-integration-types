import type { CountryCodes, LanguageCodes } from "./countries";
import type { SovDebugLevel } from "./general";
import type { SovendusAppSettings } from "./plugin-settings";

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
  customerData: SovConsumerType;
}

export interface IntegrationDataType {
  data: IntegrationParameters | undefined;
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
    optimizeId: { cookieName: "sovOptimizeId", persistent: true },
    couponCode: { cookieName: "sovCouponCode" },
    orderValue: { cookieName: "sovOrderValue" },
    orderCurrency: { cookieName: "sovOrderCurrency" },
    orderId: { cookieName: "sovOrderId" },
    sessionId: { cookieName: "sovSessionId" },
    checkoutProductsToken: { cookieName: "sovReqToken" },
    checkoutProductsId: { cookieName: "sovReqProductId" },
    legacy_profityId: { cookieName: "puid" },
    debug: { cookieName: "sovDebugLevel", persistent: true },
  },
  // keys that are used to look for values in window[VariableIdentifiersType]
  windowVariableData: {
    optimizeId: { alias: ["optimizeId"] },
    trafficSourceNumber: {
      alias: ["trafficSourceNumber", "shopId", "shopNumber"],
    },
    couponCode: { alias: ["couponCode", "usedCouponCode"] },
    orderValue: { alias: ["orderValue"] },
    orderCurrency: { alias: ["orderCurrency"] },
    orderId: { alias: ["orderId"] },
    sessionId: { alias: ["sessionId"] },
    checkoutProductsToken: { alias: ["sovReqToken"] },
    iframeContainerId: { alias: ["iframeContainerId"], storeAll: true },
  },
};

export interface SovendusVNConversionsType {
  trafficSourceNumber?: string | undefined | number;
  shopId?: string | undefined | number;
  shopNumber?: string | undefined | number;
  trafficMediumNumber?: string | undefined | number;
  optimizeId?: string | undefined | number;
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

export type IntegrationParameters = {
  [key in IntegrationParameterKeysType]?: string;
};

export type IntegrationParameterKeysType =
  | RedemptionApiRequestDataKeys
  | "optimizeId"
  | "checkoutProductsToken"
  | "checkoutProductsId"
  | "legacy_profityId"
  | "iframeContainerId"
  | "debug";

export type RedemptionApiRequestData = {
  trafficSourceNumber: string;
  couponCode: string;
  orderValue: number | undefined;
  orderCurrency: SovendusOrderCurrencies | undefined;
  orderId: string | undefined;
  sessionId: string | undefined;
};

export interface PublicThankYouCookieInterface extends SovendusPageUrlParams {
  sovCouponCode: string | undefined;
  sovReqToken: string | undefined;
  sovReqProductId: string | undefined;
  puid: string | undefined;
  sovDebugLevel: SovDebugLevel;
  optimizeId: string | undefined;
}

export type PublicThankYouCookieInterfaceKeys =
  | "optimizeId"
  | "orderValue"
  | "orderCurrency"
  | "orderId"
  | "sessionId";

export type PublicThankYouCookieInterface = {
  [interfaceKey in PublicThankYouCookieInterfaceKeys]: {
    cookieName: string;
    persistent?: boolean;
  };
};

export type StorageType = {
  setItem: (key: string, value: ExplicitAnyType) => void;
  getItem: (key: string) => ExplicitAnyType;
  [key: string]: ExplicitAnyType;
};

export type PublicThankYouVariableInterfaceKeys =
  | "optimizeId"
  | "trafficSourceNumber"
  | "couponCode"
  | "orderValue"
  | "orderCurrency"
  | "orderId"
  | "sessionId"
  | "iframeContainerId"
  | "checkoutProductsToken";

export type PublicThankYouVariableInterface = {
  [interfaceKey in PublicThankYouVariableInterfaceKeys]: {
    alias: string[];
    storeAll?: true;
  };
};

export interface SovendusPublicConversionWindow extends Window {
  // from partner provided
  sovIframes?: SovConversionsType[];
  sovConsumer?: SovConsumerType;
  AWIN?: AwinConversion;

  // legacy
  [VariableIdentifiersType.legacy_integrationIdentifier_sovAbo]?:
    | SovConversionsType[]
    | SovConversionsType;
  [VariableIdentifiersType.legacy_integrationIdentifier_gconData]?: [
    string,
    ExplicitAnyType,
  ][];
  profity?: ProfityAppType;

  // diagnostic infos
  sovIntegrationInfo?: IntegrationDataType;
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
