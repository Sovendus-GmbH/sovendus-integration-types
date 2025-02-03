<?php


// ------------------------------------------------------------
// IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
// ------------------------------------------------------------

class CountryCodes
{
    public const AT = 'AT';
    public const BE = 'BE';
    public const DK = 'DK';
    public const FI = 'FI';
    public const FR = 'FR';
    public const DE = 'DE';
    public const IE = 'IE';
    public const IT = 'IT';
    public const NL = 'NL';
    public const NO = 'NO';
    public const PL = 'PL';
    public const PT = 'PT';
    public const ES = 'ES';
    public const SE = 'SE';
    public const CH = 'CH';
    public const UK = 'UK';
}

class LanguageCodes
{
    public const DA = "DA";
    public const FI = "FI";
    public const FR = "FR";
    public const DE = "DE";
    public const EN = "EN";
    public const IT = "IT";
    public const NL = "NL";
    public const NB = "NB";
    public const PL = "PL";
    public const PT = "PT";
    public const ES = "ES";
    public const SV = "SV";
}

define('COUNTRIES', [
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
]);

define('LANGUAGES_BY_COUNTRIES', [
    CountryCodes::AT => [LanguageCodes::DE => 'Austria'],
    CountryCodes::BE => [
        LanguageCodes::FR => 'Belgium French',
        LanguageCodes::NL => 'Belgium Dutch'
    ],
    CountryCodes::DK => [LanguageCodes::DA => 'Denmark'],
    CountryCodes::FI => [LanguageCodes::FI => 'Finland'],
    CountryCodes::FR => [LanguageCodes::FR => 'France'],
    CountryCodes::DE => [LanguageCodes::DE => 'Germany'],
    CountryCodes::IE => [LanguageCodes::EN => 'Ireland'],
    CountryCodes::IT => [LanguageCodes::IT => 'Italy'],
    CountryCodes::NL => [LanguageCodes::NL => 'Netherlands'],
    CountryCodes::NO => [LanguageCodes::NB => 'Norway'],
    CountryCodes::PL => [LanguageCodes::PL => 'Poland'],
    CountryCodes::PT => [LanguageCodes::PT => 'Portugal'],
    CountryCodes::ES => [LanguageCodes::ES => 'Spain'],
    CountryCodes::SE => [LanguageCodes::SV => 'Sweden'],
    CountryCodes::CH => [
        LanguageCodes::FR => 'Switzerland French',
        LanguageCodes::DE => 'Switzerland German',
        LanguageCodes::IT => 'Switzerland Italian'
    ],
    CountryCodes::UK => [LanguageCodes::EN => 'United Kingdom']
]);
