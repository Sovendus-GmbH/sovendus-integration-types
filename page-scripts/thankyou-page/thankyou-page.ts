import type { SovendusAppSettings } from "settings/app-settings";

interface ThankYouWindow extends Window {
  sovThankyouConfig: {
    settings: SovendusAppSettings;
    sessionId: string;
    timestamp: string;
    orderId: string;
    orderValue: string;
    orderCurrency: string;
    usedCouponCodes: string;
    iframeContainerId: string;
    integrationType: string;
    consumerFirstName: string;
    consumerLastName: string;
    consumerEmail: string;
    consumerStreet: string;
    consumerStreetNumber: string;
    consumerZipcode: string;
    consumerCity: string;
    consumerCountry: string;
    consumerLanguage: string;
    consumerPhone: string;
  };
}

declare let window: ThankYouWindow;

function sovendusThankYou() {
  const config = window.sovThankyouConfig;
  let isActive = false;
  let trafficSourceNumber = "";
  let trafficMediumNumber = "";
  const multiLangCountries = ["CH", "BE"];
  if (multiLangCountries.includes(config.country)) {
    const lang = document.documentElement.lang.split("-")[0];
    isActive = JSON.parse(config.sovendusActive)[lang];
    trafficSourceNumber = JSON.parse(config.trafficSourceNumber)[lang];
    trafficMediumNumber = JSON.parse(config.trafficMediumNumber)[lang];
  } else {
    isActive = true;
    trafficSourceNumber = config.trafficSourceNumber;
    trafficMediumNumber = config.trafficMediumNumber;
  }
  if (
    isActive &&
    Number(trafficSourceNumber) > 0 &&
    Number(trafficMediumNumber) > 0
  ) {
    window.sovIframes = window.sovIframes || [];
    window.sovIframes.push({
      trafficSourceNumber: trafficSourceNumber,
      trafficMediumNumber: trafficMediumNumber,
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
  }
}

sovendusThankYou();
