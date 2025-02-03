<?php
// ------------------------------------------------------------
// IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
// ------------------------------------------------------------
class VoucherNetworkCountry
{
    /**
     * @var array
     */
    public $languages;

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
    /**
     * @var bool
     */
    public $isEnabled;
    /**
     * @var string
     */
    public $optimizeId;

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
    /**
     * @var bool
     */
    public $isEnabled;
    /**
     * @var string
     */
    public $trafficSourceNumber;
    /**
     * @var string
     */
    public $trafficMediumNumber;

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
    /**
     * @var array
     */
    public $countries = array();
    /**
     * @var bool
     */
    public $anyCountryEnabled = false;
    /**
     * @var string|null
     */
    public $iframeContainerId = null;

    /**
     * @param bool $anyCountryEnabled
     * @param ?array $countries
     * @param ?string $forced_iframe
     * @return void
     */
    public function __construct(
        $anyCountryEnabled,
        $countries = array(),
        $forced_iframe = null
    ) {
        $this->anyCountryEnabled = $anyCountryEnabled;
        $this->countries = $countries;
        $this->iframeContainerId = $forced_iframe;
    }

    /**
     * @param string $countryCode
     * @param VoucherNetworkCountry $country
     * @return void
     */
    public function addCountry($countryCode, $country)
    {
        $this->countries[$countryCode] = $country;
    }

    /**
     * @param array $data
     * @return VoucherNetwork
     */
    public static function fromJson($data)
    {
        $anyCountryEnabled = $data['anyCountryEnabled'] ?? true;
        $countries = array();
        if (isset($data['countries']) && is_array($data['countries'])) {
            foreach ($data['countries'] as $countryCode => $countryData) {
                $countries[$countryCode] = VoucherNetworkCountry::fromJson($countryData);
            }
        }
        return new self(anyCountryEnabled: $anyCountryEnabled, countries: $countries);
    }
}

class Versions
{
    const ONE = '1';
    const TWO = '2';

    /**
     * @param string $version
     * @return string
     */
    public static function from($version)
    {
        return ($version === self::TWO) ? self::TWO : self::ONE;
    }
}

class Optimize
{
    /**
     * @var bool
     */
    public $useGlobalId = false;
    /**
     * @var string|null
     */
    public $globalId = null;
    /**
     * @var bool
     */
    public $globalEnabled = false;
    /**
     * @var array
     */
    public $countrySpecificIds = array();

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
        $countrySpecificIds = array();
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
    /**
     * @var VoucherNetwork
     */
    public $voucherNetwork;
    /**
     * @var Optimize
     */
    public $optimize;
    /**
     * @var bool
     */
    public $checkoutProducts;
    /**
     * @var string
     */
    public $version;

    /**
     * @param VoucherNetwork $voucherNetwork
     * @param Optimize $optimize
     * @param bool $checkoutProducts
     * @param string $version
     */
    public function __construct($voucherNetwork, $optimize, $checkoutProducts, $version)
    {
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
