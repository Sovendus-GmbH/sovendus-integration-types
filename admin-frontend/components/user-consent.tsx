import type { ConsentSettings } from "settings/app-settings";

export enum UserConsent {
  WithCustomerData = "WithCustomerData",
  WithoutCustomerData = "WithoutCustomerData",
  Off = "Off",
}

export const predefinedConsentScripts: ConsentSettings[] = [
  {
    title: "With customer data",
    key: "WithCustomerData",
    type: "predefined",
    script: `
        async () => {
            return "WithCustomerData";
            
            // available options:
            // return "WithCustomerData";
            // return "WithoutCustomerData";
            // return "Off";
        };

    `,
  },
  {
    title: "Custom",
    key: "Custom",
    type: "predefined",
    script: `
        async () => {
          // handle your consent logic here
          return "WithCustomerData";
          
          // this script will get executed before our Sovendus integration,
            // you can decide if you want to execute the Sovendus integration
            // based on your own custom logic
            
          // available return options:

          // return "WithCustomerData";
            // will execute the Sovendus integration with customer data

          // return "WithoutCustomerData";
            // only used for voucher network
            // will execute the Sovendus integration without customer data

          // return "Off";
            // will not execute the Sovendus integration
            // e.g. if the user has opted out of sovendus
        };

    `,
  },
  {
    title: "Without customer data",
    key: "WithoutCustomerData",
    type: "predefined",
    script: `
        async () => {
            return "WithoutCustomerData";
        };

    `,
  },
];

export interface UserConsentFnParams {
  pageType: "page" | "thankyouPage";
}
