import type { SovendusPluginSettings } from "page-scripts/thankyou-page/thankyou-page";

interface Window {
  sovPluginConfig: {
    settings: SovendusPluginSettings;
    integrationType: string;
  };
}

const script = document.createElement("script");
script.type = "text/javascript";
script.async = true;
script.src = "https://api.sovendus.com/js/landing.js";
document.body.appendChild(script);
