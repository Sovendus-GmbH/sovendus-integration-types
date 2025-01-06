function sovendusThankYou() {
  const config = window.sovPluginConfig;
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
      sessionId: config.cartHash,
      timestamp: config.currentTime,
      orderId: config.orderNumber,
      orderValue: config.netValue,
      orderCurrency: config.currency,
      usedCouponCode: config.usedCouponCode,
      iframeContainerId: "sovendus-integration-container",
      integrationType: "woocommerce-1.3.0",
    });
    window.sovConsumer = {
      consumerFirstName: config.first_name,
      consumerLastName: config.last_name,
      consumerEmail: config.email,
      consumerStreet: config.streetName,
      consumerStreetNumber: config.streetNumber,
      consumerZipcode: config.postcode,
      consumerCity: config.city,
      consumerCountry: config.country,
      consumerPhone: config.consumerPhone,
    };
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      window.location.protocol +
      "//api.sovendus.com/sovabo/common/js/flexibleIframe.js";
    document.body.appendChild(script);
  }
}

sovendusThankYou();
