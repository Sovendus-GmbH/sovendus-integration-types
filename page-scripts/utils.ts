import type {
  CountryCodes,
  OptimizeSettings,
} from "sovendus-integration-types";

import { sovReqProductIdKey, sovReqTokenKey } from "../page-scripts/constants";

export async function handleCheckoutProductsConversion(
  checkoutProducts: boolean,
  getCookie: (
    name: string,
  ) => Promise<string | undefined> | (string | undefined),
  setCookie: (
    name: string,
    value?: string | undefined,
  ) => Promise<string> | string,
): Promise<boolean> {
  if (checkoutProducts) {
    const sovReqToken = await getCookie(sovReqTokenKey);
    const sovReqProductId = await getCookie(sovReqProductIdKey);
    if (sovReqToken && sovReqProductId) {
      // remove the cookies
      await setCookie(sovReqTokenKey, "");
      await setCookie(sovReqProductIdKey, "");
      const pixelUrl = `https://press-order-api.sovendus.com/ext/${decodeURIComponent(
        sovReqProductId,
      )}/image?sovReqToken=${decodeURIComponent(sovReqToken)}`;
      await fetch(pixelUrl);
      return true;
    }
  }
  return false;
}

export async function handleCheckoutProductsPage(
  checkoutProductsEnabled: boolean | undefined,
  pageHref: string,
  setCookie: (cookieOrName: string, value?: string) => Promise<string>,
): Promise<boolean> {
  if (checkoutProductsEnabled) {
    const sovReqToken = getParamFromUrl(pageHref, sovReqTokenKey);
    if (sovReqToken) {
      const sovReqProductId = getParamFromUrl(pageHref, sovReqProductIdKey);
      await setCookie(sovReqTokenKey, sovReqToken);
      if (sovReqProductId) {
        await setCookie(sovReqProductIdKey, sovReqProductId);
        return true;
      }
    }
  }
  return false;
}

function getParamFromUrl(pageHref: string, key: string): string | undefined {
  const url = new URL(pageHref);
  return url.searchParams.get(key) || undefined;
}

export function getOptimizeConfig(
  settings: OptimizeSettings,
  country: CountryCodes | undefined,
): string | undefined {
  if (
    settings.globalEnabled !== false &&
    settings.useGlobalId !== false &&
    settings.globalId
  ) {
    return settings.globalId;
  }
  if (country && settings.countrySpecificIds) {
    const countryElement = settings.countrySpecificIds[country];
    return countryElement?.isEnabled ? countryElement?.optimizeId : undefined;
  }
  return undefined;
}
