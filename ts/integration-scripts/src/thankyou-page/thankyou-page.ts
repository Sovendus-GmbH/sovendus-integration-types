import type {
  IntegrationDataType,
  LanguageCodes,
  SovendusConsumerType,
  SovendusPageUrlParams,
  SovendusThankYouPageConfig,
  SovendusThankyouPageData,
  SovendusVNConversionsType,
  VoucherNetworkLanguage,
  VoucherNetworkSettings,
  VoucherNetworkSettingsSimple,
} from "sovendus-integration-types";
import {
  CountryCodes,
  LANGUAGES_BY_COUNTRIES,
} from "sovendus-integration-types";

import { integrationScriptVersion } from "../constants";
import { getOptimizeId } from "../optimize-utils";
import { getPerformanceTime, loggerError } from "../utils";

// interface ParsedThankYouPageConfig {
//   optimizeId: string | undefined;
//   voucherNetwork: VoucherNetworkLanguage | undefined;
//   checkoutProducts: boolean;
// }

export class SovendusThankyouPage {
  async main(
    sovThankyouConfig: SovendusThankYouPageConfig,
    onDone: ({
      sovThankyouConfig,
      sovThankyouStatus,
    }: Partial<SovendusThankyouPageData>) => void,
  ): Promise<void> {
    const sovThankyouStatus = this.initializeStatus();
    this.processConfig(sovThankyouConfig, sovThankyouStatus);
    try {
      if (!sovThankyouConfig) {
        sovThankyouStatus.status.sovThankyouConfigFound = false;
        loggerError("sovThankyouConfig is not defined", "ThankyouPage");
        onDone({ sovThankyouStatus, sovThankyouConfig });
        return;
      }
      sovThankyouStatus.status.sovThankyouConfigFound = true;
      // using string literal "UK" intentionally despite type mismatch as some systems might return UK instead of GB
      if (sovThankyouConfig.customerData?.consumerCountry === "UK") {
        sovThankyouConfig.customerData.consumerCountry = CountryCodes.GB;
      }

      this.handleVoucherNetwork(sovThankyouConfig, sovThankyouStatus);
      await this.handleCheckoutProductsConversion(
        sovThankyouConfig,
        sovThankyouStatus,
      );
      this.handleOptimizeConversion(sovThankyouConfig, sovThankyouStatus);
      sovThankyouStatus.times.integrationLoaderDone = getPerformanceTime();
    } catch (error) {
      loggerError("Error in SovendusThankyouPage.main", "ThankyouPage", error);
    }
    onDone({ sovThankyouConfig, sovThankyouStatus });
  }

  processConfig(sovThankyouConfig: SovendusThankYouPageConfig): void {
    this.handleVoucherCode(sovThankyouConfig);
    this.handleStreet(sovThankyouConfig);
  }

  handleOptimizeConversion(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationDataType,
  ): void {
    const optimizeId = getOptimizeId(
      sovThankyouConfig.settings,
      sovThankyouConfig.customerData.consumerCountry,
    );
    if (!optimizeId) {
      return;
    }
    // TODO handle multiple coupon codes
    const couponCode = sovThankyouConfig.orderData.usedCouponCodes?.[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://www.sovopt.com/${optimizeId}/conversion/?ordervalue=${
      sovThankyouConfig.orderData.orderValue
    }&ordernumber=${sovThankyouConfig.orderData.orderId}&vouchercode=${
      couponCode
    }&email=${sovThankyouConfig.customerData.consumerEmail}`;
    document.body.appendChild(script);
    sovThankyouStatus.status.loadedOptimize = true;
  }

  handleStreet(sovThankyouConfig: SovendusThankYouPageConfig): void {
    if (sovThankyouConfig.customerData.consumerStreetWithNumber) {
      const [street, streetNumber] = this.splitStreetAndStreetNumber(
        sovThankyouConfig.customerData.consumerStreetWithNumber,
      );
      sovThankyouConfig.customerData.consumerStreet = street;
      sovThankyouConfig.customerData.consumerStreetNumber = streetNumber;
    }
  }

  splitStreetAndStreetNumber(street: string): [string, string] {
    const trimmedStreet = street.trim();
    // This regex looks for a street number at the end of the string.
    // It expects the number to start with at least one digit, possibly followed by digits, spaces, dashes, or slashes,
    // and optionally ending with a letter.
    const numberRegex = /(\d[\d\s\/-]*[a-zA-Z]?)$/;
    const match = trimmedStreet.match(numberRegex);

    if (match && match.index !== undefined) {
      const streetNumber = match[1] ? match[1].trim() : "";
      const streetName = trimmedStreet.slice(0, match.index).trim();
      return [streetName, streetNumber];
    }
    return [street, ""];
  }

  handleVoucherCode(sovThankyouConfig: SovendusThankYouPageConfig): void {
    const couponFromCookie = this.getCookie("sovCouponCode");
    if (couponFromCookie) {
      sovThankyouConfig.orderData.usedCouponCode = couponFromCookie;
      return;
    }
    if (sovThankyouConfig.orderData.usedCouponCode) {
      if (!sovThankyouConfig.orderData.usedCouponCodes?.length) {
        sovThankyouConfig.orderData.usedCouponCodes = [];
      }
      sovThankyouConfig.orderData.usedCouponCodes.push(
        sovThankyouConfig.orderData.usedCouponCode,
      );
    }
  }

  initializeStatus(): IntegrationDataType {
    const sovThankyouStatus: IntegrationDataType = {
      integrationScriptVersion,
      status: {
        sovThankyouConfigFound: false,
        integrationLoaderStarted: false,
        integrationParametersLoaded: false,
        checkoutProductsPixelFired: false,
        loadedOptimize: false,
        voucherNetworkLinkTrackingSuccess: false,
        integrationLoaderVnCbStarted: false,
        integrationLoaderDone: false,
      },
      data: {
        orderValue: undefined,
        orderCurrency: undefined,
        orderId: undefined,
        sovCouponCode: undefined,
        sovReqToken: undefined,
        sovReqProductId: undefined,
        puid: undefined,
        sovDebugLevel: undefined,
      },
      times: {
        integrationLoaderStart: getPerformanceTime(),
      },
    };
    return sovThankyouStatus;
  }

  handleVoucherNetwork(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationDataType,
  ): void {
    const { trafficSourceNumber, trafficMediumNumber, iframeContainerId } =
      this.getVoucherNetworkConfig(sovThankyouConfig);
    // TODO handle multiple coupon codes
    const couponCode = sovThankyouConfig.orderData.usedCouponCodes?.[0];
    if (trafficSourceNumber && trafficMediumNumber) {
      window.sovIframes = window.sovIframes || [];
      window.sovIframes.push({
        trafficSourceNumber: trafficSourceNumber,
        trafficMediumNumber: trafficMediumNumber,
        sessionId: sovThankyouConfig.orderData.sessionId,
        timestamp: sovThankyouConfig.orderData.timestamp,
        orderId: sovThankyouConfig.orderData.orderId,
        orderValue: sovThankyouConfig.orderData.orderValue,
        orderCurrency: sovThankyouConfig.orderData.orderCurrency,
        usedCouponCode: couponCode,
        iframeContainerId: config.iframeContainerId,
        integrationType: sovThankyouConfig.integrationType,
      });
      window.sovConsumer = {
        consumerFirstName: sovThankyouConfig.customerData.consumerFirstName,
        consumerLastName: sovThankyouConfig.customerData.consumerLastName,
        consumerEmail: sovThankyouConfig.customerData.consumerEmail,
        consumerStreet: sovThankyouConfig.customerData.consumerStreet,
        consumerStreetNumber:
          sovThankyouConfig.customerData.consumerStreetNumber,
        consumerZipcode: sovThankyouConfig.customerData.consumerZipcode,
        consumerCity: sovThankyouConfig.customerData.consumerCity,
        consumerCountry: sovThankyouConfig.customerData.consumerCountry,
        consumerPhone: sovThankyouConfig.customerData.consumerPhone,
        consumerLanguage: sovThankyouConfig.customerData.consumerLanguage,
      };

      const sovendusDiv = document.createElement("div");
      sovendusDiv.id = "sovendus-integration-container";
      const rootElement =
        config.settings.voucherNetwork.iframeContainerId &&
        document.querySelector(
          config.settings.voucherNetwork.iframeContainerId,
        );
      if (rootElement) {
        rootElement.appendChild(sovendusDiv);
      } else {
        document.body.appendChild(sovendusDiv);
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
      document.body.appendChild(script);
      window.sovThankyouStatus.loadedVoucherNetwork = true;
      sovThankyouStatus.times.integrationLoaderVnCbStart = getPerformanceTime();
    }
  }

  async handleCheckoutProductsConversion(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationDataType,
  ): Promise<boolean> {
    const { checkoutProducts } = sovThankyouConfig.settings;
    if (checkoutProducts) {
      const sovReqToken = this.getCookie("sovReqToken");
      const sovReqProductId = this.getCookie("sovReqProductId");
      if (sovReqToken && sovReqProductId) {
        // remove the cookies
        this.clearCookie("sovReqToken");
        this.clearCookie("sovReqProductId");
        const pixelUrl = `https://press-order-api.sovendus.com/ext/${decodeURIComponent(
          sovReqProductId,
        )}/image?sovReqToken=${decodeURIComponent(sovReqToken)}`;
        await fetch(pixelUrl);
        sovThankyouStatus.status.checkoutProductsPixelFired = true;
      }
    }
    return false;
  }
  getCookie(name: keyof SovendusPageUrlParams): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return undefined;
  }

  clearCookie(name: keyof SovendusPageUrlParams): string {
    // only capable clearing a cookie
    const path = "/";
    const domain = window.location.hostname;
    const cookieString = `${name}=;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${domain};path=${path}`;

    document.cookie = cookieString;
    return "";
  }

  getVoucherNetworkConfig(
    sovThankyouConfig: SovendusThankYouPageConfig,
  ): VoucherNetworkSettingsSimple | undefined {
    const languageSettings = this.getLanguageSettings(
      settings,
      country,
      language,
    );
    if (
      !languageSettings ||
      !languageSettings.isEnabled ||
      !languageSettings.trafficMediumNumber ||
      !languageSettings.trafficSourceNumber
    ) {
      return undefined;
    }
    return {
      trafficMediumNumber: languageSettings.trafficMediumNumber,
      trafficSourceNumber: languageSettings.trafficSourceNumber,
    };
  }

  getLanguageSettings(
    settings: VoucherNetworkSettings,
    country: CountryCodes | undefined,
    language: LanguageCodes | undefined,
  ): VoucherNetworkLanguage | undefined {
    if (!country) {
      window.sovThankyouStatus.countryCodePassedOnByPlugin = false;
      return undefined;
    }
    window.sovThankyouStatus.countryCodePassedOnByPlugin = true;
    const countrySettings = settings.countries?.[country];
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
      const languageKey = language || this.detectLanguageCode();
      const languageSettings = languagesSettings[languageKey];
      if (!languageSettings) {
        return undefined;
      }
      return languageSettings;
    }
    return undefined;
  }

  detectLanguageCode(): LanguageCodes {
    const htmlLang = document.documentElement.lang.split("-")[0];
    if (htmlLang) {
      return htmlLang as LanguageCodes;
    }
    return navigator.language.split("-")[0] as LanguageCodes;
  }
}

interface ThankYouWindow extends Window {
  sovIframes: SovendusVNConversionsType[];
  sovConsumer: SovendusConsumerType;
}
declare let window: ThankYouWindow;
