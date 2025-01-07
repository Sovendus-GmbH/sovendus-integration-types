<?php

require_once plugin_dir_path(__FILE__) . '../../helpers/integration-data-helpers.php';
require_once plugin_dir_path(__FILE__) . '../../settings/app-settings.php';

/**
 * Display Sovendus banner on the thank you page
 */

function sovendus_thankyou_page(
    Sovendus_App_Settings $settings,
    string $pluginName,
    string $pluginVersion,
    string $sessionId,
    string $timestamp,
    string $orderId,
    string $orderValue,
    string $orderCurrency,
    /**
     * @var string[]
     */
    array $usedCouponCodes,
    string $consumerFirstName,
    string $consumerLastName,
    string $consumerEmail,
    ?string $consumerStreet,
    ?string $consumerStreetNumber,
    ?string $consumerStreetAndNumber,
    string $consumerZipcode,
    string $consumerCity,
    string $consumerCountry,
    ?string $consumerLanguage,
    string $consumerPhone,
): string {
    if ($consumerStreetAndNumber) {
        [$consumerStreet, $consumerStreetNumber] = splitStreetAndStreetNumber($consumerStreetAndNumber);
    }
    $js_file_path = plugin_dir_path(__FILE__) . '../../../dist/thankyou-page.js';
    $js_content = file_get_contents($js_file_path);
    $iframeContainerId = "sovendus-integration-container";
    $integrationType = getIntegrationType(pluginName: $pluginName, pluginVersion: $pluginVersion);
    $encoded_settings = json_encode($settings);
    $encoded_used_coupon_codes = json_encode($usedCouponCodes);
    // ------------------------------------------------------------
    // IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
    // ------------------------------------------------------------
    return <<<EOD
            <div id="$iframeContainerId"></div>    
            <script type="text/javascript">
                window.sovThankyouConfig = {
                    settings: JSON.parse('$encoded_settings'),
                    sessionId: "$sessionId",
                    timestamp: "$timestamp",
                    orderId: "$orderId",
                    orderValue: "$orderValue",
                    orderCurrency: "$orderCurrency",
                    usedCouponCodes: $encoded_used_coupon_codes,
                    iframeContainerId: "$iframeContainerId",
                    integrationType: "$integrationType",
                    consumerFirstName: "$consumerFirstName",
                    consumerLastName: "$consumerLastName",
                    consumerEmail: "$consumerEmail",
                    consumerStreet: "$consumerStreet",
                    consumerStreetNumber: "$consumerStreetNumber",
                    consumerZipcode: "$consumerZipcode",
                    consumerCity: "$consumerCity",
                    consumerCountry: "$consumerCountry",
                    consumerLanguage: "$consumerLanguage",
                    consumerPhone: "$consumerPhone",
                };
                $js_content
            </script>
            EOD;

}
