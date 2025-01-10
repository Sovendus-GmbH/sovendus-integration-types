<?php

class Get_Settings_Helper
{
    public static function get_settings(string|null $countryCode, callable $get_option_callback ): Sovendus_App_Settings
    {
        $settingsJson = $get_option_callback(option: "sovendus_settings");
        if ($settingsJson) {
            $decodedSettings = json_decode($settingsJson, true);
            return Sovendus_App_Settings::fromJson($decodedSettings);
        } else {
            $anyCountryEnabled = true; // TODO
            $settings = new Sovendus_App_Settings(
                voucherNetwork: new VoucherNetwork(
                    anyCountryEnabled: $anyCountryEnabled,
                ),
                optimize: new Optimize(
                    useGlobalId: true,
                    globalId: null,
                    globalEnabled: false,
                    countrySpecificIds: [],
                ),
                checkoutProducts: false,
                version: Versions::TWO,
            );
            $countries = $countryCode
                ? [$countryCode => LANGUAGES_BY_COUNTRIES[$countryCode]]
                : LANGUAGES_BY_COUNTRIES;
            foreach ($countries as $countryKey => $countryData) {
                $countriesLanguages = array_keys($countryData);
                $settings->voucherNetwork->addCountry(
                    countryCode: CountryCodes::from($countryKey),
                    country: new VoucherNetworkCountry(
                        languages: count(LANGUAGES_BY_COUNTRIES[$countryKey]) > 1
                        ? self::get_multilang_country_settings(countryCode: $countryKey, langs: $countriesLanguages, get_option_callback: $get_option_callback)
                        : self::get_country_settings(countryCode: $countryKey, lang: $countriesLanguages[0], get_option_callback: $get_option_callback)
                    )
                );
            }
            return $settings;
        }
    }

    private static function get_country_settings($countryCode, $lang, callable $get_option_callback)
    {
        $sovendusActive = $get_option_callback(option: "{$countryCode}_sovendus_activated");
        $trafficSourceNumber = (int) $get_option_callback(option: "{$countryCode}_sovendus_trafficSourceNumber");
        $trafficMediumNumber = (int) $get_option_callback(option: "{$countryCode}_sovendus_trafficMediumNumber");
        return [
            $lang => new VoucherNetworkLanguage(
                isEnabled: $sovendusActive === "yes" && $trafficSourceNumber && $trafficMediumNumber ? true : false,
                trafficSourceNumber: $trafficSourceNumber,
                trafficMediumNumber: $trafficMediumNumber,
            )
        ];
    }

    private static function get_multilang_country_settings($countryCode, $langs, callable $get_option_callback)
    {
        $languageSettings = [];
        foreach ($langs as $lang) {
            $languageSettings[$lang] = new VoucherNetworkLanguage(
                isEnabled: $get_option_callback(option: "{$lang}_{$countryCode}_sovendus_activated"),
                trafficSourceNumber: (int) $get_option_callback(option: "{$lang}_{$countryCode}_sovendus_trafficSourceNumber"),
                trafficMediumNumber: (int) $get_option_callback(option: "{$lang}_{$countryCode}_sovendus_trafficMediumNumber"),
            );
        }
        return $languageSettings;
    }
}