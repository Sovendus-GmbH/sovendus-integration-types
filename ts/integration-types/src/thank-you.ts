import type {
  EnvironmentType,
  ExplicitAnyType,
  VersionsOptionsType,
  VersionsType,
} from "./general";
import type { SovendusPublicConversionWindow } from "./plugin-thankyou";

export enum VariableIdentifiersType {
  integrationIdentifier_sovIframes = "sovIframes",
  // legacy
  legacy_integrationIdentifier_sovAbo = "_sovAboData",
  legacy_integrationIdentifier_gconData = "_gconData",
}

export type ChannelsType = "overlay" | "integration";

export const version1: VersionsType = "v1";
export const latestVersion: VersionsType = version1;

export interface EventMessagePayloadType extends PublicApiSettingsType {
  version: VersionsType;
}

export type PublicApiSettingsType = {
  action: string;
  url?: string | undefined;
};

// legacy

export interface ProfityAppType {
  utils?: {
    getCookie?: undefined | (() => string | number);
  };
  run?: undefined | ((sourceNumber: string | number) => void);
}

export interface UrlConfigType {
  ENVIRONMENT: EnvironmentType | EnvironmentTypeTemplate;
  IDENTIFICATION_API_URL: string;
  SOVENDUS_LIST_API_URL: string;
  SOVENDUS_LOGGER_API_URL: string;
  SOVENDUS_SCRIPT_URL: string;
  TEMPLATE2ANGULAR_APP_LIST_URL: string;
  SOVENDUS_BANNER_SSR_URL: string;
  NEXT_DEAL_URL: string;
  APP_OVERLAY_URL: string;
  PROFITY_SCRIPT_URL: string;
  COUPON_API_URL: string;
  INTEGRATION_API_URL: string;
  OPTIMIZE_URL: string;
  CHECKOUT_PRODUCTS_PIXEL_URL: string;
  SELF_TESTER_URL: string;
}

type EnvironmentTypeTemplate = "${ENVIRONMENT}";

export interface SovendusCbVnConversionWindow
  extends SovendusPublicConversionWindow {
  sovApi?: VersionsOptionsType;
  sovApplication: InitializedSovApplicationType;
}

export type StorageType = {
  setItem: (key: string, value: ExplicitAnyType) => void;
  getItem: (key: string) => ExplicitAnyType;
  [key: string]: ExplicitAnyType;
};

export interface SovCbVnApplicationType {
  update?: (() => void) | undefined;
  endpointUrl?: (endpointName: EndpointUrlAlias) => string;
  implementationType?: string;
  consumer?: SovApplicationConsumer;
  instances?: Instance[];

  urlConfig: UrlConfigType & { CACHE_BUSTER: string };

  collapsableOverlay?: {
    closeInstance: (instance: Instance, unknown: boolean) => void;
  };
  sovCollector?: {
    init: () => boolean;
    clearProperties: () => void;
    consumerProps: ConsumerPropsType[];
  };
  stickyBanner?: { closeInstance: (instance: Instance) => void };
  messageListener?: (ev: MessageEvent<ExplicitAnyType>) => void;
  resizeListenerAdded?: boolean;
}

export interface InitializedSovApplicationType
  extends SovCbVnApplicationType,
    BasePropertiesType {
  update: (() => void) | undefined;
  endpointUrl: (endpointName: EndpointUrlAlias) => string;
  implementationType: string;
  consumer: SovApplicationConsumer;
  instances: Instance[];

  sovTracking: {
    startTime: number;
    init: () => void;
  };
  sovIdentification: {
    init: (object: object, callback: () => void) => void;
  };
  sovStorage: StorageType;
  sovCollector: {
    init: () => boolean;
    clearProperties: () => void;
    consumerProps: ConsumerPropsType[];
  };
  sovImplement: {
    init: () => void;
  };
  messageListener: (ev: MessageEvent<ExplicitAnyType>) => void;
  resizeListenerAdded: boolean;
}

export type ConsumerPropsType =
  | "salutation"
  | "firstName"
  | "lastName"
  | "yearOfBirth"
  | "dateOfBirth"
  | "email"
  | "emailHash"
  | "phone"
  | "street"
  | "streetNumber"
  | "zipCode"
  | "city"
  | "country"
  | "journeyUuid"
  | "initialTm";

export interface BasePropertiesType {
  determinedCountry: boolean;
  errorCounter: number;
  identified: boolean;
  identifiedSuccessFull: boolean;
  isListening: boolean;
  listMinHeight: number;
  noConsumerData: boolean;
  sovOptOut: boolean;
  noUserDataShopNumbers: string[];
  orderProps: {
    orderId: string;
    orderValue: string;
    orderCurrency: string;
    usedCouponCode: string;
    sessionId: string;
    processInstanceUuid: string;
  };
  origins: string[];
  processed: [];
  resizeListenerAdded: boolean;
  sessionUuid: string;
  sovTrackingForceSendTimeSpan: number;
  store: ExplicitAnyType;
  sovStorage: StorageType;
  timestamp: number;
}

export type EndpointUrlAlias =
  | "identification-api"
  | "template-ngx"
  | "template-ngx-fallback"
  | "list"
  | "logger-api"
  | "banner-ssr"
  | "banner-ssr-fallback"
  | "next-deal"
  | "overlay"
  | "redemption";

export interface SovApplicationConsumer {
  salutation: "Mr." | "Mrs." | "";
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  dateOfBirth: string;
  email: string | undefined;
  emailHash: string;
  phone: string;
  street: string;
  streetNumber: string;
  zipCode: string;
  city: string;
  country: string;
  journeyUuid: string;
  initialTm: string;
}

export interface Banner {
  bannerExists?: boolean;
}

export interface Config {
  overlay?: {
    showInOverlay?: boolean;
  };
  stickyBanner?: {
    bannerExists?: boolean;
  };
}

export interface Instance {
  banner?: Banner;
  stickyBanner?: Banner;
  selectBanner?: object;
  collapsableOverlayClosingType?: string;
  config?: Config;
  isCollapsableOverlay?: "" | true;
  isStickyBanner?: "" | true;
  list?: {
    listExists?: boolean;
  };
  isBanner?: "" | true;
}
