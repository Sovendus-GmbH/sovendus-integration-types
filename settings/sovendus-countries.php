<?php


// ------------------------------------------------------------
// IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
// ------------------------------------------------------------

class CountryCodes
{
    const AT = 'AT';
    const BE = 'BE';
    const DK = 'DK';
    const FI = 'FI';
    const FR = 'FR';
    const DE = 'DE';
    const IE = 'IE';
    const IT = 'IT';
    const NL = 'NL';
    const NO = 'NO';
    const PL = 'PL';
    const PT = 'PT';
    const ES = 'ES';
    const SE = 'SE';
    const CH = 'CH';
    const UK = 'UK';

    /**
     * Returns the country code in upper case if valid, otherwise returns null.
     *
     * @param string $country
     * @return string|null
     */
    public static function from($country)
    {
        $country = strtoupper($country);
        $codes = [
            self::AT,
            self::BE,
            self::DK,
            self::FI,
            self::FR,
            self::DE,
            self::IE,
            self::IT,
            self::NL,
            self::NO,
            self::PL,
            self::PT,
            self::ES,
            self::SE,
            self::CH,
            self::UK,
        ];
        return in_array($country, $codes, true) ? $country : null;
    }
}

class LanguageCodes
{
    const DA = "DA";
    const FI = "FI";
    const FR = "FR";
    const DE = "DE";
    const EN = "EN";
    const IT = "IT";
    const NL = "NL";
    const NB = "NB";
    const PL = "PL";
    const PT = "PT";
    const ES = "ES";
    const SV = "SV";
}


define('COUNTRIES', array(
    CountryCodes::AT => 'Austria',
    CountryCodes::BE => 'Belgium',
    CountryCodes::DK => 'Denmark',
    CountryCodes::FI => 'Finland',
    CountryCodes::FR => 'France',
    CountryCodes::DE => 'Germany',
    CountryCodes::IE => 'Ireland',
    CountryCodes::IT => 'Italy',
    CountryCodes::NL => 'Netherlands',
    CountryCodes::NO => 'Norway',
    CountryCodes::PL => 'Poland',
    CountryCodes::PT => 'Portugal',
    CountryCodes::ES => 'Spain',
    CountryCodes::SE => 'Sweden',
    CountryCodes::CH => 'Switzerland French',
    CountryCodes::UK => 'United Kingdom'
));

define('LANGUAGES_BY_COUNTRIES', array(
    CountryCodes::AT => array(LanguageCodes::DE => 'Austria'),
    CountryCodes::BE => array(
        LanguageCodes::FR => 'Belgium French',
        LanguageCodes::NL => 'Belgium Dutch'
    ),
    CountryCodes::DK => array(LanguageCodes::DA => 'Denmark'),
    CountryCodes::FI => array(LanguageCodes::FI => 'Finland'),
    CountryCodes::FR => array(LanguageCodes::FR => 'France'),
    CountryCodes::DE => array(LanguageCodes::DE => 'Germany'),
    CountryCodes::IE => array(LanguageCodes::EN => 'Ireland'),
    CountryCodes::IT => array(LanguageCodes::IT => 'Italy'),
    CountryCodes::NL => array(LanguageCodes::NL => 'Netherlands'),
    CountryCodes::NO => array(LanguageCodes::NB => 'Norway'),
    CountryCodes::PL => array(LanguageCodes::PL => 'Poland'),
    CountryCodes::PT => array(LanguageCodes::PT => 'Portugal'),
    CountryCodes::ES => array(LanguageCodes::ES => 'Spain'),
    CountryCodes::SE => array(LanguageCodes::SV => 'Sweden'),
    CountryCodes::CH => array(
        LanguageCodes::FR => 'Switzerland French',
        LanguageCodes::DE => 'Switzerland German',
        LanguageCodes::IT => 'Switzerland Italian'
    ),
    CountryCodes::UK => array(LanguageCodes::EN => 'United Kingdom')
));
