<?php
// ------------------------------------------------------------
// IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
// ------------------------------------------------------------
class VoucherNetworkCountry
{
    public array $languages;

    /**
     * @param array $languages
     * @return void
     */
    public function __construct($languages)
    {
        $this->languages = $languages;
    }

    /**
     * @param array $data
     * @return VoucherNetworkCountry
     */
    public static function fromJson($data)
    {
        $languages = array();
        if (isset($data['languages']) && is_array($data['languages'])) {
            foreach ($data['languages'] as $lang => $langData) {
                $languages[$lang] = VoucherNetworkLanguage::fromJson($langData);
            }
        }
        return new VoucherNetworkCountry($languages);
    }
}


class OptimizeCountry
{
    public bool $isEnabled;
    public string $optimizeId;

    /**
     * @param bool $isEnabled
     * @param string $optimizeId
     * @return void
     */
    public function __construct(
        $isEnabled,
        $optimizeId
    ) {
        $this->isEnabled = $isEnabled;
        $this->optimizeId = $optimizeId;
    }

    /**
     * @param array $data
     * @return OptimizeCountry
     */
    public static function fromJson($data)
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

    /**
     * @param bool $isEnabled
     * @param string $trafficSourceNumber
     * @param string $trafficMediumNumber
     * @return void
     */
    public function __construct(
        $isEnabled,
        $trafficSourceNumber = '',
        $trafficMediumNumber = ''
    ) {
        $this->isEnabled = $isEnabled;
        $this->trafficSourceNumber = $trafficSourceNumber;
        $this->trafficMediumNumber = $trafficMediumNumber;
    }

    /**
     * @param array $data
     * @return self
     */
    public static function fromJson($data)
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
    public string|null $iframeContainerId = null;

    /**
     * @param bool $anyCountryEnabled
     * @param ?array $countries
     * @param ?string $forced_iframe
     * @return void
     */
    public function __construct(
        $anyCountryEnabled,
        $countries = [],
        $forced_iframe = null
    ) {
        $this->anyCountryEnabled = $anyCountryEnabled;
        $this->countries = $countries;
        $this->iframeContainerId = $forced_iframe;
    }

    /**
     * @param CountryCodes $countryCode
     * @param VoucherNetworkCountry $country
     * @return void
     */
    public function addCountry($countryCode, $country)
    {
        $this->countries[$countryCode->value] = $country;
    }

    /**
     * @param array $data
     * @return VoucherNetwork
     */
    public static function fromJson($data)
    {
        $anyCountryEnabled = $data['anyCountryEnabled'] ?? true;
        $countries = [];
        if (isset($data['countries']) && is_array($data['countries'])) {
            foreach ($data['countries'] as $countryCode => $countryData) {
                $countries[$countryCode] = VoucherNetworkCountry::fromJson($countryData);
            }
        }
        return new self(anyCountryEnabled: $anyCountryEnabled, countries: $countries);
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
    public array $countrySpecificIds = array();

    /**
     * @param bool $useGlobalId
     * @param string|null $globalId
     * @param bool $globalEnabled
     * @param array $countrySpecificIds
     * @return void
     */
    public function __construct(
        $useGlobalId,
        $globalId,
        $globalEnabled,
        $countrySpecificIds
    ) {
        $this->useGlobalId = $useGlobalId;
        $this->globalId = $globalId;
        $this->globalEnabled = $globalEnabled;
        $this->countrySpecificIds = $countrySpecificIds;
    }

    /**
     * @param array $data
     * @return self
     */
    public static function fromJson($data)
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

    /**
     * @param VoucherNetwork $voucherNetwork
     * @param Optimize $optimize
     * @param bool $checkoutProducts
     * @param Versions $version
     * @return self
     */
    public function __construct(
        $voucherNetwork,
        $optimize,
        $checkoutProducts,
        $version
    ) {
        $this->voucherNetwork = $voucherNetwork;
        $this->optimize = $optimize;
        $this->checkoutProducts = $checkoutProducts;
        $this->version = $version;
    }

    /**
     * @param array $data
     * @return self
     */
    public static function fromJson($data)
    {
        return new self(
            VoucherNetwork::fromJson($data['voucherNetwork']),
            Optimize::fromJson($data['optimize']),
            $data['checkoutProducts'],
            Versions::from($data['version'])
        );
    }
}
