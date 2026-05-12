<?php

/**
 * OshiMerch Shipping Fee Configuration
 *
 * Flat-rate shipping fees per province (in IDR).
 * Used by OshiGo internal shipping system.
 * Can be updated via Admin Dashboard (future).
 */
return [

    'provinces' => [
        // Jawa
        'DKI Jakarta'         => 12000,
        'Jawa Barat'          => 10000,
        'Banten'              => 12000,
        'Jawa Tengah'         => 14000,
        'DI Yogyakarta'       => 14000,
        'Jawa Timur'          => 15000,

        // Bali & Nusa Tenggara
        'Bali'                => 17000,
        'Nusa Tenggara Barat' => 20000,
        'Nusa Tenggara Timur' => 22000,

        // Sumatera
        'Aceh'                => 20000,
        'Sumatera Utara'      => 18000,
        'Sumatera Barat'      => 18000,
        'Riau'                => 18000,
        'Kepulauan Riau'      => 20000,
        'Jambi'               => 18000,
        'Sumatera Selatan'    => 18000,
        'Kepulauan Bangka Belitung' => 20000,
        'Bengkulu'            => 18000,
        'Lampung'             => 18000,

        // Kalimantan
        'Kalimantan Barat'    => 22000,
        'Kalimantan Tengah'   => 22000,
        'Kalimantan Selatan'  => 22000,
        'Kalimantan Timur'    => 22000,
        'Kalimantan Utara'    => 22000,

        // Sulawesi
        'Sulawesi Utara'      => 25000,
        'Sulawesi Tengah'     => 25000,
        'Sulawesi Selatan'    => 25000,
        'Sulawesi Tenggara'   => 25000,
        'Gorontalo'           => 25000,
        'Sulawesi Barat'      => 25000,

        // Maluku
        'Maluku'              => 28000,
        'Maluku Utara'        => 28000,

        // Papua
        'Papua Barat'         => 30000,
        'Papua Barat Daya'    => 30000,
        'Papua'               => 30000,
        'Papua Selatan'       => 30000,
        'Papua Tengah'        => 30000,
        'Papua Pegunungan'    => 30000,
    ],

];
