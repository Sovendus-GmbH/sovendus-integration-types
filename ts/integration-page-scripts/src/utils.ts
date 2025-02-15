import { sovReqProductIdKey, sovReqTokenKey } from "./constants";

export async function handleCheckoutProductsConversion(
  checkoutProducts: boolean,
  getCookie: (
    name: string,
  ) => Promise<string | undefined> | (string | undefined),
  setCookie: (name: string, value?: string) => Promise<string> | string,
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

export function getPerformanceTime(): number {
  return window.performance?.now?.() || 0;
}
