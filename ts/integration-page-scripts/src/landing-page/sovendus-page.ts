import { defaultSovendusPageConfig } from "integration-types/src";
import type {
  CountryCodes,
  OptimizeSettings,
  SovendusAppSettings,
  SovendusPageConfig,
  SovendusPageUrlParams,
  SovPageData,
  SovPageStatus,
  VoucherNetworkSettings,
} from "sovendus-integration-types";
import { Versions } from "sovendus-integration-types";

export class SovendusPage {
  // Standard implementation of the Sovendus page script
  // You can extend this class and override the methods to customize the behavior
  // You can find example overrides in any of our Sovendus plugins
  // Also make sure to check out our docs for more information

  UrlParamAndCookieKeys = [
    // These are the keys that Sovendus uses to store the url params as cookies
    // Without these url params the Sovendus cookies will not be set
    //
    // key only passed on in Switzerland Voucher Network
    "puid",
    // Optional link based conversion tracking for Sovendus Voucher Network
    "sovCouponCode",
    // Keys used for Sovendus Checkout Products
    "sovReqToken",
    "sovReqProductId",
    // used to enable debug mode for the testing process.
    "sovDebugLevel",
  ] as const as (keyof SovendusPageUrlParams)[];

  // make it async to avoid blocking the main thread
  // eslint-disable-next-line @typescript-eslint/require-await
  async main(
    settings: SovendusPageConfig,
    onDone: ({ sovPageConfig, sovPageStatus }: Partial<SovPageData>) => void,
  ): Promise<void> {
    const sovPageStatus = this.initializeStatus();
    if (!settings) {
      sovPageStatus.sovPageConfigFound = false;
      onDone({ sovPageStatus });
      console.error("sovPageConfig is not defined");
      return;
    }
    const sovPageConfig: SovendusPageConfig = this.getSovendusConfig(settings);
    sovPageConfig.urlData = this.lookForUrlParamsToStore(sovPageStatus);
    this.sovendusOptimize(sovPageConfig, sovPageStatus);
    onDone({ sovPageStatus, sovPageConfig });
  }

  initializeStatus(): SovPageStatus {
    return {
      sovPageConfigFound: false,
      loadedOptimize: false,
      storedCookies: false,
    };
  }
  getCookieKeys(): (keyof SovendusPageUrlParams)[] {
    return this.UrlParamAndCookieKeys;
  }

  getSearchParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  getScriptParams(): URLSearchParams | undefined {
    const currentScript = document.currentScript as HTMLScriptElement | null;
    return currentScript ? new URL(currentScript.src).searchParams : undefined;
  }

  getSovendusUrlParameters(): SovendusPageUrlParams {
    const pageViewData: SovendusPageUrlParams = {
      sovCouponCode: undefined,
      sovReqToken: undefined,
      sovReqProductId: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    };
    const scriptUrlParams = this.getScriptParams();
    const urlParams = this.getSearchParams();
    this.getCookieKeys().forEach((dataKey) => {
      const paramValue =
        urlParams?.get(dataKey) || scriptUrlParams?.get(dataKey);
      if (paramValue) {
        pageViewData[dataKey] = paramValue;
      }
    });
    return pageViewData;
  }

  lookForUrlParamsToStore(sovPageStatus: SovPageStatus): SovendusPageUrlParams {
    try {
      const pageViewData: SovendusPageUrlParams =
        this.getSovendusUrlParameters();
      Object.entries(pageViewData).forEach(([cookieKey, cookieValue]) => {
        if (cookieValue) {
          // for simplicity we store all supported url params as cookies
          // as without the url params the cookies would not be set
          // you can add your custom logic here if you limit to certain url params
          this.setCookie(cookieKey, cookieValue);
          sovPageStatus.storedCookies = true;
        }
      });
      return pageViewData;
    } catch (error) {
      console.error("Sovendus App - Error while storing url params", error);
    }
    return defaultSovendusPageConfig.urlData;
  }

  shouldSetCookie(
    _cookieKey: keyof SovendusPageUrlParams,
    _cookieValue: string,
  ): boolean {
    // for simplicity we store all supported url params as cookies
    // as without the url params the cookies would not be set anyway
    // each url param requires separate opt in on Sovendus side, so this is safe to use
    // you can add your custom logic here if you want to limit to certain url params
    return true;
  }

  setCookie(cookieName: string, value: string): string {
    const path = "/";
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 24 * 60 * 60 * 1000 * 30); // 30 days
    const domain = window.location.hostname;
    const cookieString = `${cookieName}=${value};secure;samesite=strict;expires=${expireDate.toUTCString()};domain=${domain};path=${path}`;
    document.cookie = cookieString;
    return value || "";
  }

  detectCountryCode(): CountryCodes | undefined {
    const getCountryCodeFromHtmlTag = (): CountryCodes | undefined => {
      const lang = document.documentElement.lang;
      const countryCode = lang.split("-")[1];
      return countryCode
        ? (countryCode.toUpperCase() as CountryCodes)
        : undefined;
    };
    const getCountryFromDomain = (): CountryCodes | undefined => {
      const domainToCountry: {
        [key: string]: string | undefined;
      } = {
        "de": "DE",
        "at": "AT",
        "ch": "CH",
        "uk": "GB",
        "co.uk": "GB",
        "com": undefined,
        "se": "SE",
        "no": "NO",
        "dk": "DK",
        "fi": "FI",
        "fr": "FR",
        "be": "BE",
        "nl": "NL",
        "it": "IT",
        "es": "ES",
        "pt": "PT",
        "pl": "PL",
        "cz": "CZ",
        "sk": "SK",
        "hu": "HU",
      };
      const domain = window.location.hostname;
      const domainParts = domain.split(".");
      const domainPart = domainParts[domainParts.length - 1];
      return (domainPart ? domainToCountry[domainPart] : undefined) as
        | CountryCodes
        | undefined;
    };
    const getCountryFromPagePath = (): CountryCodes | undefined => {
      const path = window.location.pathname;
      const pathParts = path.split("/");
      const country = pathParts[1];
      return country?.toUpperCase() as CountryCodes | undefined;
    };
    return (
      getCountryCodeFromHtmlTag() ||
      getCountryFromDomain() ||
      getCountryFromPagePath()
    );
  }

  getSovendusConfig(config: Partial<SovendusPageConfig>): SovendusPageConfig {
    return {
      settings: {
        voucherNetwork: this.getVnCbConfig(config),
        optimize: this.getOptimizeConfig(config),
        checkoutProducts: getRightSettingValue<
          SovendusAppSettings["checkoutProducts"]
        >(
          config?.settings?.checkoutProducts,
          defaultSovendusPageConfig.settings.checkoutProducts,
        ),
        version: Versions.TWO,
      },
      integrationType: getRightSettingValue<
        SovendusPageConfig["integrationType"]
      >(config?.integrationType, defaultSovendusPageConfig.integrationType),
      country: getRightSettingValue<SovendusPageConfig["country"]>(
        config?.country,
        defaultSovendusPageConfig.country,
      ),
      urlData: getRightSettingValue<SovendusPageConfig["urlData"]>(
        config?.urlData,
        defaultSovendusPageConfig.urlData,
      ),
    } satisfies SovendusPageConfig;
  }

  getVnCbConfig(config: Partial<SovendusPageConfig>): VoucherNetworkSettings {
    return {
      countries: getRightSettingValue<VoucherNetworkSettings["countries"]>(
        config?.settings?.voucherNetwork?.countries,
        defaultSovendusPageConfig.settings.voucherNetwork.countries,
      ),
      simple: getRightSettingValue<VoucherNetworkSettings["simple"]>(
        config?.settings?.voucherNetwork?.simple,
        defaultSovendusPageConfig.settings.voucherNetwork.simple,
      ),
      settingType: getRightSettingValue<VoucherNetworkSettings["settingType"]>(
        config?.settings?.voucherNetwork?.settingType,
        defaultSovendusPageConfig.settings.voucherNetwork.settingType,
      ),
      anyCountryEnabled: getRightSettingValue<
        VoucherNetworkSettings["anyCountryEnabled"]
      >(
        config?.settings?.voucherNetwork?.anyCountryEnabled,
        defaultSovendusPageConfig.settings.voucherNetwork.anyCountryEnabled,
      ),
      iframeContainerId: getRightSettingValue<
        VoucherNetworkSettings["iframeContainerId"]
      >(
        config?.settings?.voucherNetwork?.iframeContainerId,
        defaultSovendusPageConfig.settings.voucherNetwork.iframeContainerId,
      ),
      cookieTracking: getRightSettingValue<
        VoucherNetworkSettings["cookieTracking"]
      >(
        config?.settings?.voucherNetwork?.cookieTracking,
        defaultSovendusPageConfig.settings.voucherNetwork.cookieTracking,
      ),
    };
  }

  getOptimizeConfig(config: Partial<SovendusPageConfig>): OptimizeSettings {
    const globalId = getRightSettingValue<OptimizeSettings["globalId"]>(
      config?.settings?.optimize?.globalId,
      defaultSovendusPageConfig.settings.optimize.globalId,
    );
    const useGlobalId = getRightSettingValue<OptimizeSettings["useGlobalId"]>(
      config?.settings?.optimize?.useGlobalId,
      defaultSovendusPageConfig.settings.optimize.useGlobalId,
    );
    const globalEnabled = getRightSettingValue<
      OptimizeSettings["globalEnabled"]
    >(config?.settings?.optimize?.globalEnabled, !!(globalId && useGlobalId));
    return {
      useGlobalId,
      globalId,
      globalEnabled,
      fallBackId: getRightSettingValue<OptimizeSettings["fallBackId"]>(
        config?.settings?.optimize?.fallBackId,
        defaultSovendusPageConfig.settings.optimize.fallBackId,
      ),
      fallBackEnabled: getRightSettingValue<
        OptimizeSettings["fallBackEnabled"]
      >(
        config?.settings?.optimize?.fallBackEnabled,
        !!config?.settings?.optimize?.fallBackId,
      ),
      anyCountryEnabled: getRightSettingValue<
        OptimizeSettings["anyCountryEnabled"]
      >(
        config?.settings?.optimize?.anyCountryEnabled,
        globalEnabled || !!config?.settings?.optimize?.countrySpecificIds,
      ),
      countrySpecificIds: getRightSettingValue<
        OptimizeSettings["countrySpecificIds"]
      >(
        config?.settings?.optimize?.countrySpecificIds,
        defaultSovendusPageConfig.settings.optimize.countrySpecificIds,
      ),
    };
  }

  sovendusOptimize(
    sovPageConfig: SovendusPageConfig,
    sovPageStatus: SovPageStatus,
  ): void {
    const optimizeId = this.getOptimizeId(sovPageConfig);
    if (!optimizeId) {
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.type = "application/javascript";
    script.src = `${pageApis.optimize}${optimizeId}`;
    document.head.appendChild(script);
    sovPageStatus.loadedOptimize = true;
  }

  getOptimizeId(sovPageConfig: SovendusPageConfig): string | undefined {
    if (sovPageConfig?.settings?.optimize?.useGlobalId) {
      if (
        sovPageConfig?.settings?.optimize?.globalEnabled !== false &&
        sovPageConfig?.settings?.optimize?.globalId
      ) {
        return sovPageConfig.settings.optimize.globalId;
      }
    } else {
      if (sovPageConfig.settings.optimize.countrySpecificIds) {
        const countryCode: CountryCodes | undefined =
          sovPageConfig.country || this.detectCountryCode();
        if (countryCode) {
          const countryElement =
            sovPageConfig.settings.optimize.countrySpecificIds[countryCode];
          return countryElement?.isEnabled
            ? countryElement?.optimizeId
            : undefined;
        }
        const fallbackId: string | undefined =
          sovPageConfig?.settings?.optimize?.fallBackId;
        if (sovPageConfig.settings.optimize.fallBackEnabled && fallbackId) {
          return fallbackId;
        }
      }
    }
    return undefined;
  }

  getParamFromUrl(pageHref: string, key: string): string | undefined {
    const url = new URL(pageHref);
    return url.searchParams.get(key) || undefined;
  }
}

function getRightSettingValue<ValueType>(
  storedValue: ValueType | undefined,
  defaultValue: ValueType,
): ValueType {
  return storedValue !== undefined ? storedValue : defaultValue;
}
