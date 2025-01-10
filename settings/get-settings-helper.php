<?php




class SettingsKeys
{
    public string|int $active_value;
    public bool $uses_lower_case;
    public string $newSettingsKey;
    public string $active;
    public string $trafficSourceNumber;
    public string $trafficMediumNumber;
    public string $multiLangCountryActive;
    public string $multiLangCountryTrafficSourceNumber;
    public string $multiLangCountryTrafficMediumNumber;

    public function __construct(
        string|int $active_value,
        bool $uses_lower_case = false,
        string $newSettingsKey = "sovendus_settings",
        string $active = "{country}_sovendus_activated",
        string $trafficSourceNumber = "{country}_sovendus_trafficSourceNumber",
        string $trafficMediumNumber = "{country}_sovendus_trafficMediumNumber",
        string $multiLangCountryActive = "{lang}_{country}_sovendus_activated",
        string $multiLangCountryTrafficSourceNumber = "{lang}_{country}_sovendus_trafficSourceNumber",
        string $multiLangCountryTrafficMediumNumber = "{lang}_{country}_sovendus_trafficMediumNumber"
    ) {
        $this->uses_lower_case = $uses_lower_case;
        $this->active_value = $active_value;
        $this->newSettingsKey = $newSettingsKey;
        $this->active = $active;
        $this->trafficSourceNumber = $trafficSourceNumber;
        $this->trafficMediumNumber = $trafficMediumNumber;
        $this->multiLangCountryActive = $multiLangCountryActive;
        $this->multiLangCountryTrafficSourceNumber = $multiLangCountryTrafficSourceNumber;
        $this->multiLangCountryTrafficMediumNumber = $multiLangCountryTrafficMediumNumber;
    }
}

class Get_Settings_Helper
{
    public static function get_settings(
        string|null $countryCode,
        callable $get_option_callback,
        SettingsKeys $settings_keys
    ): Sovendus_App_Settings {
        $settingsJson = $get_option_callback(option: $settings_keys->newSettingsKey);
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
                            ? self::get_multilang_country_settings(
                                countryCode: $countryKey,
                                langs: $countriesLanguages,
                                get_option_callback: $get_option_callback,
                                settings_keys: $settings_keys
                            )
                            : self::get_country_settings(
                                countryCode: $countryKey,
                                lang: $countriesLanguages[0],
                                get_option_callback: $get_option_callback,
                                settings_keys: $settings_keys
                            )
                    )
                );
            }
            return $settings;
        }
    }

    private static function get_country_settings(
        $countryCode,
        $lang,
        callable $get_option_callback,
        SettingsKeys $settings_keys
    ) {
        $sovendusActive = $get_option_callback(option: str_replace(
            $settings_keys->active,
            ["{country}", "{lang}"],
            $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang]
        ));
        $trafficSourceNumber = (int) $get_option_callback(option: str_replace(
            $settings_keys->trafficSourceNumber,
            ["{country}", "{lang}"],
            $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang]
        ));
        $trafficMediumNumber = (int) $get_option_callback(option: str_replace(
            $settings_keys->trafficMediumNumber,
            ["{country}", "{lang}"],
            $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang]
        ));
        return [
            $lang => new VoucherNetworkLanguage(
                isEnabled: $sovendusActive === $settings_keys->active_value && $trafficSourceNumber && $trafficMediumNumber ? true : false,
                trafficSourceNumber: $trafficSourceNumber,
                trafficMediumNumber: $trafficMediumNumber,
            )
        ];
    }

    private static function get_multilang_country_settings(
        $countryCode,
        $langs,
        callable $get_option_callback,
        SettingsKeys $settings_keys
    ) {
        $languageSettings = [];
        foreach ($langs as $lang) {
            $sovendusActive = $get_option_callback(option: str_replace(
                $settings_keys->multiLangCountryActive,
                ["{country}", "{lang}"],
                $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang]
            ));
            $trafficSourceNumber = (int) $get_option_callback(option: str_replace(
                $settings_keys->multiLangCountryTrafficSourceNumber,
                ["{country}", "{lang}"],
                $settings_keys->uses_lower_case ? [strtolower(string: $countryCode), strtolower($lang)] : [$countryCode, $lang]
            ));
            $trafficMediumNumber = (int) $get_option_callback(option: str_replace(
                $settings_keys->multiLangCountryTrafficMediumNumber,
                ["{country}", "{lang}"],
                $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang]
            ));
            $languageSettings[$lang] = new VoucherNetworkLanguage(
                isEnabled: $sovendusActive === $settings_keys->active_value && $trafficSourceNumber && $trafficMediumNumber ? true : false,
                trafficSourceNumber: $trafficSourceNumber,
                trafficMediumNumber: $trafficMediumNumber,
            );
        }
        return $languageSettings;
    }
}
