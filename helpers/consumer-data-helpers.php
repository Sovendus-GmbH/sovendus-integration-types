<?php

/**
 * Split street and street number
 */
function splitStreetAndStreetNumber($street)
{
    if ((strlen($street) > 0) && preg_match_all('#([0-9/ -]+ ?[a-zA-Z]?(\s|$))#', trim($street), $match)) {
        $housenr = end($match[0]);
        $consumerStreet = trim(str_replace(array($housenr, '/'), '', $street));
        $consumerStreetNumber = trim($housenr);
        return [$consumerStreet, $consumerStreetNumber];
    } else {
        return [$street, ""];
    }
}