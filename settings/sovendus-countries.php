<?php

// ------------------------------------------------------------
// IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
// ------------------------------------------------------------

enum CountryCodes: string
{
    case AT = 'AT';
    case BE = 'BE';
    case DK = 'DK';
    case FR = 'FR';
    case DE = 'DE';
    case IE = 'IE';
    case IT = 'IT';
    case NL = 'NL';
    case NO = 'NO';
    case PL = 'PL';
    case ES = 'ES';
    case SE = 'SE';
    case CH = 'CH';
    case UK = 'UK';
}

enum LanguageCodes: string
{
    case DA = "DA";
    case FR = "FR";
    case DE = "DE";
    case EN = "EN";
    case IT = "IT";
    case NL = "NL";
    case NB = "NB";
    case PL = "PL";
    case ES = "ES";
    case SV = "SV";
}

define('COUNTRIES', [
    CountryCodes::AT->value => 'Austria',
    CountryCodes::BE->value => 'Belgium',
    CountryCodes::DK->value => 'Denmark',
    CountryCodes::FR->value => 'France',
    CountryCodes::DE->value => 'Germany',
    CountryCodes::IE->value => 'Ireland',
    CountryCodes::IT->value => 'Italy',
    CountryCodes::NL->value => 'Netherlands',
    CountryCodes::NO->value => 'Norway',
    CountryCodes::PL->value => 'Poland',
    CountryCodes::ES->value => 'Spain',
    CountryCodes::SE->value => 'Sweden',
    CountryCodes::CH->value => 'Switzerland French',
    CountryCodes::UK->value => 'United Kingdom'
]);

define('LANGUAGES_BY_COUNTRIES', [
    CountryCodes::AT->value => [LanguageCodes::DE->value => 'Austria'],
    CountryCodes::BE->value => [
        LanguageCodes::FR->value => 'Belgium French',
        LanguageCodes::NL->value => 'Belgium Dutch'
    ],
    CountryCodes::DK->value => [LanguageCodes::DA->value => 'Denmark'],
    CountryCodes::FR->value => [LanguageCodes::FR->value => 'France'],
    CountryCodes::DE->value => [LanguageCodes::DE->value => 'Germany'],
    CountryCodes::IE->value => [LanguageCodes::EN->value => 'Ireland'],
    CountryCodes::IT->value => [LanguageCodes::IT->value => 'Italy'],
    CountryCodes::NL->value => [LanguageCodes::NL->value => 'Netherlands'],
    CountryCodes::NO->value => [LanguageCodes::NB->value => 'Norway'],
    CountryCodes::PL->value => [LanguageCodes::PL->value => 'Poland'],
    CountryCodes::ES->value => [LanguageCodes::ES->value => 'Spain'],
    CountryCodes::SE->value => [LanguageCodes::SV->value => 'Sweden'],
    CountryCodes::CH->value => [
        LanguageCodes::FR->value => 'Switzerland French',
        LanguageCodes::DE->value => 'Switzerland German',
        LanguageCodes::IT->value => 'Switzerland Italian'
    ],
    CountryCodes::UK->value => [LanguageCodes::EN->value => 'United Kingdom']
]);