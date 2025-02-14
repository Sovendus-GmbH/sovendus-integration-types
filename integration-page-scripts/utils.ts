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
