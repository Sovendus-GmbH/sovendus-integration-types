<?php

/**
 * Add landing page script
 */
function sovendus_landing_page(
    Sovendus_App_Settings $settings,
    string $pluginName,
    string $pluginVersion,

): string {
    $js_file_path = plugin_dir_path(__FILE__) . 'sovendus-page.js';
    $js_content = file_get_contents($js_file_path);
    $integrationType = "{$pluginName}-{$pluginVersion}";
    $encoded_settings = json_encode($settings);
    return <<<EOD
            <script type="text/javascript">
                window.sovPluginConfig = {
                    settings: JSON.parse('$encoded_settings'),
                    integrationType: "$integrationType",
                }
                $js_content
            </script>
            EOD;



}