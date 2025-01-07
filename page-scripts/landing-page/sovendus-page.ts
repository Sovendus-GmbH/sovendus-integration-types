import { SovendusAppSettings } from "settings/app-settings";

interface Window {
  sovPageConfig: {
    settings: SovendusAppSettings;
    integrationType: string;
  };
}

declare let window: Window;

if (typeof window.sovPageConfig !== "undefined") {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = "https://api.sovendus.com/js/landing.js";
  document.body.appendChild(script);
} else {
  console.error("sovPageConfig is not defined");
}
