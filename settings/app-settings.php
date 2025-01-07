<?php

class VoucherNetworkCountry
{
    public array $languages;

    public function __construct(array $languages)
    {
        $this->languages = $languages;
    }

    public static function fromJson(array $data): VoucherNetworkCountry
    {
        $languages = [];
        foreach ($data['languages'] as $lang => $langData) {
            $languages[$lang] = new Language(
                enabled: $langData['enabled'],
                trafficSourceNumber: $langData['trafficSourceNumber'],
                trafficMediumNumber: $langData['trafficMediumNumber'],
            );
        }
        return new VoucherNetworkCountry($languages);
    }
}

class OptimizeCountry
{
    public bool $enabled;
    public string $optimizeId;


    public function __construct(
        bool $enabled,
        string $optimizeId,
    ) {
        $this->active = $enabled;
        $this->optimizeId = $optimizeId;
    }

    public static function fromJson(array $data): OptimizeCountry
    {
        return new OptimizeCountry(
            enabled: $data['enabled'],
            optimizeId: $data['optimizeId'],
        );
    }
}


class Language
{
    public bool $enabled;
    public string $trafficSourceNumber;
    public string $trafficMediumNumber;

    public function __construct(
        bool $enabled,
        string $trafficSourceNumber,
        string $trafficMediumNumber,
    ) {
        $this->enabled = $enabled;
        $this->trafficSourceNumber = $trafficSourceNumber;
        $this->trafficMediumNumber = $trafficMediumNumber;
    }
}



class VoucherNetwork
{
    public array $countries = [];

    public function __construct(
        ?array $countries = [],
    ) {
        $this->countries = $countries;

    }
    public function addCountry(CountryCodes $countryCode, VoucherNetworkCountry $country): void
    {
        $this->countries[$countryCode->value] = $country;
    }

    public static function fromJson(array $data): VoucherNetwork
    {
        $countries = [];
        foreach ($data as $countryCode => $countryData) {
            $countries[$countryCode] = VoucherNetworkCountry::fromJson($countryData);
        }
        return new VoucherNetwork($countries);
    }
}

class Optimize
{
    public bool $useGlobalId = false;
    public string|null $globalId = null;
    public bool $globalEnabled = false;
    public array $countrySpecificIds = [];

    public function __construct(
        bool $useGlobalId,
        string|null $globalId,
        bool $globalEnabled,
        array $countrySpecificIds,
    ) {
        $this->useGlobalId = $useGlobalId;
        $this->globalId = $globalId;
        $this->globalEnabled = $globalEnabled;
        $this->countrySpecificIds = $countrySpecificIds;
    }

    public function addCountry(CountryCodes $countryCode, OptimizeCountry $country): void
    {
        $this->countrySpecificIds[$countryCode->value] = $country;
    }
    public static function fromJson(array $data): Optimize
    {
        $countrySpecificIds = [];
        if ($data['countrySpecificIds']) {
            foreach ($data['countrySpecificIds'] as $countryCode => $countryData) {
                $countrySpecificIds[$countryCode] = OptimizeCountry::fromJson($countryData);
            }
        }
        return new Optimize(
            useGlobalId: $data['useGlobalId'] || false,
            globalId: $data['globalId'] || null,
            globalEnabled: $data['globalEnabled'] || false,
            countrySpecificIds: $countrySpecificIds,
        );
    }
}

class Sovendus_App_Settings
{
    public VoucherNetwork $voucherNetwork;
    public Optimize $optimize;
    public bool $checkoutProducts;
    public bool $hasNewFormat;

    public function __construct(
        VoucherNetwork $voucherNetwork,
        Optimize $optimize,
        bool $checkoutProducts,
        ?bool $hasNewFormat = false,
    ) {
        $this->voucherNetwork = $voucherNetwork;
        $this->optimize = $optimize;
        $this->checkoutProducts = $checkoutProducts;
        $this->hasNewFormat = $hasNewFormat;
    }

    public function toJson(): string
    {

        return json_encode($this, JSON_PRETTY_PRINT);
    }

    public static function fromJson(string $json): Sovendus_App_Settings
    {
        $data = json_decode($json, true);
        return new Sovendus_App_Settings(
            VoucherNetwork::fromJson($data['voucherNetwork']),
            Optimize::fromJson($data['optimize']),
            $data['checkoutProducts'],
            hasNewFormat: true
        );
    }

}