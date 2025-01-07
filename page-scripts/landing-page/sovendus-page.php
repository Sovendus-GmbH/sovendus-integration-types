<?php

require_once plugin_dir_path(__FILE__) . '../../helpers/integration-data-helpers.php';


/**
 * Add landing page script
 */
function sovendus_landing_page(
    Sovendus_App_Settings $settings,
    string $pluginName,
    string $pluginVersion,

): string {
    $js_file_path = plugin_dir_path(__FILE__) . '../../../dist/sovendus-page.js';
    $js_content = file_get_contents($js_file_path);
    $integrationType = getIntegrationType(pluginName: $pluginName, pluginVersion: $pluginVersion);
    $encoded_settings = json_encode($settings);
    // ------------------------------------------------------------
    // IMPORTANT CHANGES HERE HAVE TO BE REPLICATED IN THE OTHER FILE
    // ------------------------------------------------------------
    return <<<EOD
            <script type="text/javascript">
                window.sovPageConfig = {
                    settings: JSON.parse('$encoded_settings'),
                    integrationType: "$integrationType",
                };
                $js_content
            </script>
            EOD;



}