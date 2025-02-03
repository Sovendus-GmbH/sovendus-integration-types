<?php


require_once __DIR__ . '/app-settings.php';
require_once __DIR__ . '/sovendus-countries.php';

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

    /**
     * @param string|int $active_value
     * @param bool $uses_lower_case
     * @param string $newSettingsKey
     * @param string $active
     * @param string $trafficSourceNumber
     * @param string $trafficMediumNumber
     * @param string $multiLangCountryActive
     * @param string $multiLangCountryTrafficSourceNumber
     * @param string $multiLangCountryTrafficMediumNumber
     * @return void
     */
    public function __construct(
        $active_value,
        $uses_lower_case = false,
        $newSettingsKey = "sovendus_settings",
        $active = "{country}_sovendus_activated",
        $trafficSourceNumber = "{country}_sovendus_trafficSourceNumber",
        $trafficMediumNumber = "{country}_sovendus_trafficMediumNumber",
        $multiLangCountryActive = "{lang}_{country}_sovendus_activated",
        $multiLangCountryTrafficSourceNumber = "{lang}_{country}_sovendus_trafficSourceNumber",
        $multiLangCountryTrafficMediumNumber = "{lang}_{country}_sovendus_trafficMediumNumber"
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
        $countryCode,
        $get_option_callback,
        $settings_keys
    ) {
        $settingsJson = $get_option_callback($settings_keys->newSettingsKey);
        if ($settingsJson) {
            $decodedSettings = json_decode($settingsJson, true);
            if (is_array($decodedSettings)) {
                return Sovendus_App_Settings::fromJson($decodedSettings);
            } else {
                throw new Exception('Invalid settings JSON format.');
            }
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
                                $countryKey,
                                $countriesLanguages,
                                $get_option_callback,
                                $settings_keys
                            )
                            : [self::get_country_settings( // Wrap in array
                                $countryKey,
                                $countriesLanguages[0],
                                $get_option_callback,
                                $settings_keys
                            )]
                    )
                );
            }
            return $settings;
        }
    }

    /**
     * @param null|string $countryCode,
     * @param null|string $lang,
     * @param callable $get_option_callback,
     * @param SettingsKeys $settings_keys
     * @return VoucherNetworkLanguage
     */
    private static function get_country_settings(
        $countryCode,
        $lang,
        $get_option_callback,
        $settings_keys
    ) {
        return self::fetch_settings($countryCode, $lang, $get_option_callback, $settings_keys, false);
    }

    /**
     * @param null|string $countryCode,
     * @param null|string $lang,
     * @param callable $get_option_callback,
     * @param SettingsKeys $settings_keys
     * @return array
     */
    private static function get_multilang_country_settings(
        $countryCode,
        $langs,
        $get_option_callback,
        $settings_keys
    ) {
        $languageSettings = [];
        foreach ($langs as $lang) {
            $languageSettings[$lang] = self::fetch_settings($countryCode, $lang, $get_option_callback, $settings_keys, true);
        }
        return $languageSettings;
    }

    /**
     * @param null|string $countryCode,
     * @param null|string $lang,
     * @param callable $get_option_callback,
     * @param SettingsKeys $settings_keys
     * @param bool $isMultiLang
     * @return VoucherNetworkLanguage
     */
    private static function fetch_settings(
        $countryCode,
        $lang,
        $get_option_callback,
        $settings_keys,
        $isMultiLang
    ) {
        $activeKey = $isMultiLang ? $settings_keys->multiLangCountryActive : $settings_keys->active;
        $trafficSourceNumberKey = $isMultiLang ? $settings_keys->multiLangCountryTrafficSourceNumber : $settings_keys->trafficSourceNumber;
        $trafficMediumNumberKey = $isMultiLang ? $settings_keys->multiLangCountryTrafficMediumNumber : $settings_keys->trafficMediumNumber;

        $sovendusActive = $get_option_callback(str_replace(
            ["{country}", "{lang}"],
            $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang],
            $activeKey
        ));
        $trafficSourceNumber = $get_option_callback(str_replace(
            ["{country}", "{lang}"],
            $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang],
            $trafficSourceNumberKey
        ));
        $trafficSourceNumber = is_numeric($trafficSourceNumber) && (int)$trafficSourceNumber > 0 ? (string)$trafficSourceNumber : '';

        $trafficMediumNumber = $get_option_callback(str_replace(
            ["{country}", "{lang}"],
            $settings_keys->uses_lower_case ? [strtolower($countryCode), strtolower($lang)] : [$countryCode, $lang],
            $trafficMediumNumberKey
        ));
        $trafficMediumNumber = is_numeric($trafficMediumNumber) && (int)$trafficMediumNumber > 0 ? (string)$trafficMediumNumber : '';

        return new VoucherNetworkLanguage(
            isEnabled: $sovendusActive === $settings_keys->active_value && $trafficSourceNumber && $trafficMediumNumber,
            trafficSourceNumber: $trafficSourceNumber,
            trafficMediumNumber: $trafficMediumNumber,
        );
    }
}
