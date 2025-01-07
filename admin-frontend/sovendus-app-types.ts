import type {
  OptimizeCountryCode,
  VoucherNetworkCountryCode,
} from "./components/form-types";

export type SovendusFormDataType = {
  voucherNetwork: VoucherNetworkFormType;
  optimize: OptimizeSettingsFormType;
  checkoutProducts: boolean;
};

export type StoredOptimizeSettingsFormType = {
  checkoutProducts: boolean;
  optimize: {
    useGlobalId: boolean;
    globalId: string;
    globalEnabled: boolean;
    countrySpecificIds: {
      [key in OptimizeCountryCode]?: OptimizerSettingsElementType;
    };
  };
};

export type OptimizeSettingsFormType = {
  useGlobalId: boolean;
  globalId: string;
  globalEnabled: boolean;
  countrySpecificIds: {
    [key in OptimizeCountryCode]?: OptimizerSettingsElementType;
  };
};

export type OptimizerSettingsElementType = {
  isEnabled?: boolean;
  id?: string;
};

export type VoucherNetworkFormType = {
  [key in VoucherNetworkCountryCode]?: VoucherNetworkFormElementType;
};

export type VoucherNetworkFormElementType = {
  isEnabled?: boolean;
  trafficSourceNumber?: string;
  trafficMediumNumber?: string;
};

export type StoredVNFormDataArray = [
  VoucherNetworkCountryCode,
  [string | undefined, string | undefined, boolean | undefined],
];
export type StoredVNFormData = {
  [key in VoucherNetworkCountryCode]?: [
    string | undefined,
    string | undefined,
    boolean | undefined,
  ];
};

export interface SovendusPixelSettings {
  useGlobalId: boolean;
  checkoutProducts: boolean;
  globalEnabled: boolean;
  countrySpecificIds: {
    [key in OptimizeCountryCode]?: OptimizerSettingsElementType;
  };
}
