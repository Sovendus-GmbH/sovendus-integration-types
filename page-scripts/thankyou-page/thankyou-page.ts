import type {
  SovendusAppSettings,
  VoucherNetworkLanguage,
  VoucherNetworkSettings,
} from "../../settings/app-settings";
import {
  type CountryCodes,
  type LanguageCodes,
  LANGUAGES_BY_COUNTRIES,
} from "../../settings/sovendus-countries";
import { getOptimizeConfig, handleCheckoutProductsConversion } from "../utils";

export interface SovendusThankYouPageConfig {
  settings: SovendusAppSettings;
  sessionId: string | undefined;
  timestamp: string | undefined;
  orderId: string | undefined;
  orderValue: string | undefined;
  orderCurrency: string | undefined;
  usedCouponCodes: string | undefined;
  iframeContainerId: string;
  integrationType: string;
  consumerFirstName: string | undefined;
  consumerLastName: string | undefined;
  consumerEmail: string | undefined;
  consumerStreet: string | undefined;
  consumerStreetNumber: string | undefined;
  consumerZipcode: string | undefined;
  consumerCity: string | undefined;
  consumerCountry: CountryCodes;
  consumerLanguage: LanguageCodes | undefined;
  consumerPhone: string | undefined;
}

interface ThankYouWindow extends Window {
  sovThankyouConfig: SovendusThankYouPageConfig;
  sovIframes: {
    trafficSourceNumber: string;
    trafficMediumNumber: string;
    sessionId: string | undefined;
    timestamp: string | undefined;
    orderId: string | undefined;
    orderValue: string | undefined;
    orderCurrency: string | undefined;
    usedCouponCode: string | undefined;
    iframeContainerId: string;
    integrationType: string;
  }[];
  sovConsumer: {
    consumerFirstName: string | undefined;
    consumerLastName: string | undefined;
    consumerEmail: string | undefined;
    consumerStreet: string | undefined;
    consumerStreetNumber: string | undefined;
    consumerZipcode: string | undefined;
    consumerCity: string | undefined;
    consumerCountry: CountryCodes;
    consumerPhone: string | undefined;
  };
  sovThankyouStatus: {
    loadedOptimize?: boolean;
    loadedVoucherNetwork?: boolean;
    executedCheckoutProducts?: boolean;
    sovThankyouConfigFound?: boolean;
    countryCodePassedOnByPlugin?: boolean;
  };
}

declare let window: ThankYouWindow;

async function sovendusThankYou(): Promise<void> {
  const config = window.sovThankyouConfig;
  window.sovThankyouStatus = {};
  if (!config) {
    window.sovThankyouStatus.sovThankyouConfigFound = false;
    // eslint-disable-next-line no-console
    console.error("sovThankyouConfig is not defined");
    return;
  }
  window.sovThankyouStatus.sovThankyouConfigFound = true;
  const { optimizeId, checkoutProducts, voucherNetwork } = getSovendusConfig(
    config.settings,
    config.consumerCountry,
    config.consumerLanguage,
  );
  handleVoucherNetwork(voucherNetwork, config);
  window.sovThankyouStatus.executedCheckoutProducts =
    await handleCheckoutProductsConversion(
      checkoutProducts,
      getCookie,
      setCookie,
    );
  handleOptimizeConversion(optimizeId, config);
}

function handleOptimizeConversion(
  optimizeId: string | undefined,
  config: SovendusThankYouPageConfig,
): void {
  if (optimizeId) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://www.sovopt.com/${optimizeId}/conversion/?ordervalue=${
      config.orderValue
    }&ordernumber=${config.orderId}&vouchercode=${
      config.usedCouponCodes?.[0]
    }&email=${config.consumerEmail}`;
    window.sovThankyouStatus.loadedOptimize = true;
  }
}

function handleVoucherNetwork(
  voucherNetworkConfig: VoucherNetworkLanguage | undefined,
  config: SovendusThankYouPageConfig,
): void {
  if (
    voucherNetworkConfig?.trafficSourceNumber &&
    voucherNetworkConfig.trafficMediumNumber
  ) {
    window.sovIframes = window.sovIframes || [];
    window.sovIframes.push({
      trafficSourceNumber: voucherNetworkConfig.trafficSourceNumber,
      trafficMediumNumber: voucherNetworkConfig.trafficMediumNumber,
      sessionId: config.sessionId,
      timestamp: config.timestamp,
      orderId: config.orderId,
      orderValue: config.orderValue,
      orderCurrency: config.orderCurrency,
      usedCouponCode: config.usedCouponCodes?.[0],
      iframeContainerId: config.iframeContainerId,
      integrationType: config.integrationType,
    });
    window.sovConsumer = {
      consumerFirstName: config.consumerFirstName,
      consumerLastName: config.consumerLastName,
      consumerEmail: config.consumerEmail,
      consumerStreet: config.consumerStreet,
      consumerStreetNumber: config.consumerStreetNumber,
      consumerZipcode: config.consumerZipcode,
      consumerCity: config.consumerCity,
      consumerCountry: config.consumerCountry,
      consumerPhone: config.consumerPhone,
    };
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `${
      window.location.protocol
    }//api.sovendus.com/sovabo/common/js/flexibleIframe.js`;
    document.body.appendChild(script);
    window.sovThankyouStatus.loadedVoucherNetwork = true;
  }
}

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
};

const setCookie = (name: string): string => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  return "";
};

interface ParsedThankYouPageConfig {
  optimizeId: string | undefined;
  voucherNetwork: VoucherNetworkLanguage | undefined;
  checkoutProducts: boolean;
}

function getSovendusConfig(
  settings: SovendusAppSettings,
  country: CountryCodes,
  language: LanguageCodes | undefined,
): ParsedThankYouPageConfig {
  return {
    optimizeId: getOptimizeConfig(settings.optimize, country),
    voucherNetwork: getVoucherNetworkConfig(
      settings.voucherNetwork,
      country,
      language,
    ),
    checkoutProducts: settings.checkoutProducts,
  };
}

function getVoucherNetworkConfig(
  settings: VoucherNetworkSettings,
  country: CountryCodes | undefined,
  language: LanguageCodes | undefined,
): VoucherNetworkLanguage | undefined {
  const languageSettings = getLanguageSettings(settings, country, language);
  if (
    !languageSettings ||
    !languageSettings.isEnabled ||
    !languageSettings.trafficMediumNumber ||
    !languageSettings.trafficSourceNumber
  ) {
    return undefined;
  }
  return languageSettings;
}

function getLanguageSettings(
  settings: VoucherNetworkSettings,
  country: CountryCodes | undefined,
  language: LanguageCodes | undefined,
): VoucherNetworkLanguage | undefined {
  if (!country) {
    window.sovThankyouStatus.countryCodePassedOnByPlugin = false;
    return undefined;
  }
  window.sovThankyouStatus.countryCodePassedOnByPlugin = true;
  const countrySettings = settings.countries[country];
  const languagesSettings = countrySettings?.languages;
  if (!languagesSettings) {
    return undefined;
  }
  const languagesAvailable = Object.keys(LANGUAGES_BY_COUNTRIES[country]);
  if (languagesAvailable?.length === 1) {
    const language = languagesAvailable[0] as LanguageCodes;
    const languageSettings = languagesSettings[language];
    return languageSettings;
  }
  if (languagesAvailable?.length > 1) {
    const languageKey = language || detectLanguageCode();
    const languageSettings = languagesSettings[languageKey];
    if (!languageSettings) {
      return undefined;
    }
    return languageSettings;
  }
  return undefined;
}

function detectLanguageCode(): LanguageCodes {
  const htmlLang = document.documentElement.lang.split("-")[0];
  if (htmlLang) {
    return htmlLang as LanguageCodes;
  }
  return navigator.language.split("-")[0] as LanguageCodes;
}

void sovendusThankYou();
