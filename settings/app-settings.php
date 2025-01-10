<?php
// ------------------------------------------------------------
// IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
// ------------------------------------------------------------
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
        if (isset($data['languages']) && is_array($data['languages'])) {
            foreach ($data['languages'] as $lang => $langData) {
                $languages[$lang] = new VoucherNetworkLanguage(
                    isEnabled: $langData['isEnabled'],
                    trafficSourceNumber: $langData['trafficSourceNumber'],
                    trafficMediumNumber: $langData['trafficMediumNumber'],
                );
            }
        } else {
            error_log('Warning: Missing or invalid languages key in VoucherNetworkCountry data');
        }
        return new VoucherNetworkCountry($languages);
    }
}

class OptimizeCountry {
    public bool $isEnabled;
    public string $optimizeId;

    public function __construct(
        bool $isEnabled,
        string $optimizeId,
    ) {
        $this->isEnabled = $isEnabled;
        $this->optimizeId = $optimizeId;
    }

    public static function fromJson(array $data): OptimizeCountry
    {
        return new self(
            isEnabled: $data['isEnabled'],
            optimizeId: $data['optimizeId'],
        );
    }
}


class VoucherNetworkLanguage
{
    public bool $isEnabled;
    public string $trafficSourceNumber;
    public string $trafficMediumNumber;

    public function __construct(
        bool $isEnabled,
        string $trafficSourceNumber,
        string $trafficMediumNumber,
    ) {
        $this->isEnabled = $isEnabled;
        $this->trafficSourceNumber = $trafficSourceNumber;
        $this->trafficMediumNumber = $trafficMediumNumber;
    }
}



class VoucherNetwork {
    public array $countries = [];
    public bool $anyCountryEnabled = false;

    public function __construct(
        bool $anyCountryEnabled,
        ?array $countries = [],
    ) {
        $this->anyCountryEnabled = $anyCountryEnabled;
        $this->countries = $countries;
    }

    public function addCountry(CountryCodes $countryCode, VoucherNetworkCountry $country): void
    {
        $this->countries[$countryCode->value] = $country;
    }

    public static function fromJson(array $data): VoucherNetwork
    {
        $anyCountryEnabled = true; // TODO
        $countries = [];
        if (isset($data['countries']) && is_array($data['countries'])) {
            foreach ($data['countries'] as $countryCode => $countryData) {
                if (is_array($countryData)) {
                    $countries[$countryCode] = VoucherNetworkCountry::fromJson($countryData);
                } else {
                    error_log("Warning: Invalid country data for $countryCode");
                }
            }
        } else {
            error_log('Warning: Missing or invalid countries key in VoucherNetwork data');
        }
        return new VoucherNetwork(anyCountryEnabled: $anyCountryEnabled, countries: $countries);
    }
}



enum Versions: string
{
    case ONE = '1';
    case TWO = '2';
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
        error_log('[Sovendus Debug] Optimize fromJson data: ' . json_encode($data));
        
        $countrySpecificIds = [];
        if ($data['countrySpecificIds']) {
            foreach ($data['countrySpecificIds'] as $countryCode => $countryData) {
                $countrySpecificIds[$countryCode] = OptimizeCountry::fromJson($countryData);
            }
        }
        return new Optimize(
            useGlobalId: $data['useGlobalId'] ?? false,
            globalId: $data['globalId'] ?? null,
            globalEnabled: $data['globalEnabled'] ?? false,
            countrySpecificIds: $countrySpecificIds,
        );
    }
}
class Sovendus_App_Settings {
    public VoucherNetwork $voucherNetwork;
    public Optimize $optimize;
    public bool $checkoutProducts;
    public Versions $version;

    public function __construct($voucherNetwork, $optimize, $checkoutProducts, $version) {
        $this->voucherNetwork = $voucherNetwork;
        $this->optimize = $optimize;
        $this->checkoutProducts = $checkoutProducts;
        $this->version = $version;
    }

    public static function fromJson($data) {
        return new self(
            VoucherNetwork::fromJson($data['voucherNetwork']),
            Optimize::fromJson($data['optimize']),
            $data['checkoutProducts'],
            Versions::from($data['version'])
        );
    }
}
