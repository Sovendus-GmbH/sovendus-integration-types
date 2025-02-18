import type {
  IntegrationDataType,
  LanguageCodes,
  SovendusConsumerType,
  SovendusPageUrlParams,
  SovendusThankYouPageConfig,
  SovendusThankyouPageData,
  SovendusVNConversionsType,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";
import {
  CountryCodes,
  defaultIframeContainerId,
  LANGUAGES_BY_COUNTRIES,
} from "sovendus-integration-types";

import { integrationScriptVersion } from "../constants";
import { getOptimizeId } from "../optimize-utils";
import { detectCountryCode, getPerformanceTime, loggerError } from "../utils";

export class SovendusThankyouPage {
  async main(
    sovThankyouConfig: SovendusThankYouPageConfig,
    onDone: ({
      sovThankyouConfig,
      sovThankyouStatus,
    }: Partial<SovendusThankyouPageData>) => void,
  ): Promise<void> {
    const sovThankyouStatus = this.initializeStatus();
    try {
      if (!sovThankyouConfig) {
        sovThankyouStatus.status.sovThankyouConfigFound = false;
        loggerError("sovThankyouConfig is not defined", "ThankyouPage");
        onDone({ sovThankyouStatus, sovThankyouConfig });
        return;
      }
      sovThankyouStatus.status.sovThankyouConfigFound = true;
      this.processConfig(sovThankyouConfig, sovThankyouStatus);

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

  processConfig(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationDataType,
  ): void {
    this.handleVoucherCode(sovThankyouConfig);
    this.handleStreet(sovThankyouConfig);
    this.handleCountryCode(sovThankyouConfig, sovThankyouStatus);
  }

  handleCountryCode(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationDataType,
  ): void {
    // using string literal "UK" intentionally despite type mismatch as some systems might return UK instead of GB
    if (sovThankyouConfig.customerData.consumerCountry === "UK") {
      sovThankyouConfig.customerData.consumerCountry = CountryCodes.GB;
    }
    if (!sovThankyouConfig.customerData.consumerCountry) {
      sovThankyouStatus.status.countryCodePassedOnByPlugin = false;
      sovThankyouConfig.customerData.consumerCountry =
        sovThankyouConfig.customerData.consumerCountry || detectCountryCode();
    }
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
    const numberRegex = /(\d[\d\s/-]*[a-zA-Z]?)$/;
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
        voucherNetworkIframeContainerIdFound: false,
        voucherNetworkIframeContainerFound: false,
        countryCodePassedOnByPlugin: false,
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
    const voucherNetworkConfig =
      this.getVoucherNetworkConfig(sovThankyouConfig);
    // TODO handle multiple coupon codes
    const couponCode = sovThankyouConfig.orderData.usedCouponCodes?.[0];
    if (
      voucherNetworkConfig?.trafficSourceNumber &&
      voucherNetworkConfig?.trafficMediumNumber
    ) {
      const iframeContainerId = this.handleSovendusVoucherNetworkDivContainer(
        voucherNetworkConfig,
        sovThankyouStatus,
      );
      window.sovIframes = window.sovIframes || [];
      window.sovIframes.push({
        trafficSourceNumber: voucherNetworkConfig.trafficSourceNumber,
        trafficMediumNumber: voucherNetworkConfig.trafficMediumNumber,
        sessionId: sovThankyouConfig.orderData.sessionId,
        timestamp: sovThankyouConfig.orderData.timestamp,
        orderId: sovThankyouConfig.orderData.orderId,
        orderValue: sovThankyouConfig.orderData.orderValue,
        orderCurrency: sovThankyouConfig.orderData.orderCurrency,
        usedCouponCode: couponCode,
        iframeContainerId: iframeContainerId,
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

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
      document.body.appendChild(script);
      sovThankyouStatus.status.integrationLoaderVnCbStarted = true;
      sovThankyouStatus.times.integrationLoaderVnCbStart = getPerformanceTime();
    }
  }

  handleSovendusVoucherNetworkDivContainer(
    voucherNetworkConfig: VoucherNetworkLanguage,
    sovThankyouStatus: IntegrationDataType,
  ): string {
    const iframeContainerId = defaultIframeContainerId;
    const rootElement =
      iframeContainerId && document.getElementById(iframeContainerId);
    if (!rootElement) {
      if (voucherNetworkConfig.iframeContainerQuerySelector) {
        const iframeContainer = document.querySelector(
          voucherNetworkConfig.iframeContainerQuerySelector,
        ) as HTMLElement | null;
        if (iframeContainer) {
          const sovendusDiv = document.createElement("div");
          sovendusDiv.id = defaultIframeContainerId;
          iframeContainer.appendChild(sovendusDiv);
          sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = true;
          sovThankyouStatus.status.voucherNetworkIframeContainerFound = true;
        } else {
          sovThankyouStatus.status.voucherNetworkIframeContainerFound = false;
          sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = true;
          loggerError(
            `Voucher Network custom iframe container ${voucherNetworkConfig.iframeContainerQuerySelector} not found`,
            "ThankyouPage",
          );
          return "";
        }
      } else {
        sovThankyouStatus.status.voucherNetworkIframeContainerFound = false;
        sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = false;
        loggerError(
          "Voucher Network iframe container not found",
          "ThankyouPage",
        );
        return "";
      }
    } else {
      sovThankyouStatus.status.voucherNetworkIframeContainerFound = true;
      sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = true;
    }
    return iframeContainerId;
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
  ): VoucherNetworkLanguage | undefined {
    if (sovThankyouConfig.settings.voucherNetwork.settingType === "simple") {
      return sovThankyouConfig.settings.voucherNetwork.simple;
    }
    if (sovThankyouConfig.settings.voucherNetwork.settingType === "country") {
      return this.getVoucherNetworkCountryBasedSettings(sovThankyouConfig);
    }
    return undefined;
  }

  getVoucherNetworkCountryBasedSettings(
    sovThankyouConfig: SovendusThankYouPageConfig,
  ): VoucherNetworkLanguage | undefined {
    const country = sovThankyouConfig.customerData
      .consumerCountry as CountryCodes;
    if (!sovThankyouConfig.customerData.consumerCountry) {
      return undefined;
    }
    const countrySettings =
      sovThankyouConfig.settings.voucherNetwork.countries?.ids?.[country];
    const languagesSettings = countrySettings?.languages;
    if (!languagesSettings) {
      return undefined;
    }
    const languagesAvailable = Object.keys(LANGUAGES_BY_COUNTRIES[country]);
    if (languagesAvailable?.length === 1) {
      const language = languagesAvailable[0] as LanguageCodes;
      const languageSettings = languagesSettings[language];
      return {
        isEnabled: languageSettings?.isEnabled || false,
        trafficSourceNumber: languageSettings?.trafficSourceNumber || "",
        trafficMediumNumber: languageSettings?.trafficMediumNumber || "",
        ...languageSettings,
        iframeContainerQuerySelector:
          sovThankyouConfig.settings.voucherNetwork.countries
            ?.iframeContainerQuerySelector ||
          languageSettings?.iframeContainerQuerySelector,
      };
    }
    if (languagesAvailable?.length > 1) {
      const languageKey =
        sovThankyouConfig.customerData.consumerLanguage ||
        this.detectLanguageCode();
      const languageSettings = languagesSettings[languageKey];
      if (!languageSettings) {
        return undefined;
      }
      return {
        ...languageSettings,
        iframeContainerQuerySelector:
          sovThankyouConfig.settings.voucherNetwork.countries
            ?.iframeContainerQuerySelector ||
          languageSettings?.iframeContainerQuerySelector,
      };
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
