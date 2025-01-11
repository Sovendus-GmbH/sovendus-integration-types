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
                $languages[$lang] = VoucherNetworkLanguage::fromJson($langData);
            }
        } else {
            error_log('Warning: Missing or invalid languages key in VoucherNetworkCountry data');
        }
        return new VoucherNetworkCountry($languages);
    }
}

class OptimizeCountry
{
    public bool $isEnabled;
    public string $optimizeId;

    public function __construct(
        bool $isEnabled,
        string $optimizeId
    ) {
        $this->isEnabled = $isEnabled;
        $this->optimizeId = $optimizeId;
    }

    public static function fromJson(array $data): OptimizeCountry
    {
        return new self(
            $data['isEnabled'],
            $data['optimizeId']
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
        string $trafficSourceNumber = '',
        string $trafficMediumNumber = ''
    ) {
        $this->isEnabled = $isEnabled;
        $this->trafficSourceNumber = $trafficSourceNumber;
        $this->trafficMediumNumber = $trafficMediumNumber;
    }

    public static function fromJson(array $data): self
    {
        return new self(
            $data['isEnabled'],
            $data['trafficSourceNumber'] ?? '',
            $data['trafficMediumNumber'] ?? ''
        );
    }
}



class VoucherNetwork
{
    public array $countries = [];
    public bool $anyCountryEnabled = false;

    public function __construct(
        bool $anyCountryEnabled,
        ?array $countries = []
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
        $anyCountryEnabled = $data['anyCountryEnabled'] ?? true;
        $countries = [];
        if (isset($data['countries']) && is_array($data['countries'])) {
            foreach ($data['countries'] as $countryCode => $countryData) {
                $countries[$countryCode] = VoucherNetworkCountry::fromJson($countryData);
            }
        }
        return new self($anyCountryEnabled, $countries);
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
        array $countrySpecificIds
    ) {
        $this->useGlobalId = $useGlobalId;
        $this->globalId = $globalId;
        $this->globalEnabled = $globalEnabled;
        $this->countrySpecificIds = $countrySpecificIds;
    }

    public static function fromJson(array $data): self
    {
        $countrySpecificIds = [];
        if (isset($data['countrySpecificIds']) && is_array($data['countrySpecificIds'])) {
            foreach ($data['countrySpecificIds'] as $countryCode => $countryData) {
                $countrySpecificIds[$countryCode] = OptimizeCountry::fromJson($countryData);
            }
        }
        return new self(
            $data['useGlobalId'],
            $data['globalId'] ?? null,
            $data['globalEnabled'],
            $countrySpecificIds
        );
    }
}

class Sovendus_App_Settings
{
    public VoucherNetwork $voucherNetwork;
    public Optimize $optimize;
    public bool $checkoutProducts;
    public Versions $version;

    public function __construct(
        VoucherNetwork $voucherNetwork,
        Optimize $optimize,
        bool $checkoutProducts,
        Versions $version
    ) {
        $this->voucherNetwork = $voucherNetwork;
        $this->optimize = $optimize;
        $this->checkoutProducts = $checkoutProducts;
        $this->version = $version;
    }

    public static function fromJson(array $data): self
    {
        return new self(
            VoucherNetwork::fromJson($data['voucherNetwork']),
            Optimize::fromJson($data['optimize']),
            $data['checkoutProducts'],
            Versions::from($data['version'])
        );
    }
}
