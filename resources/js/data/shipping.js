/**
 * OshiMerch Province Shipping Fees (OshiGo)
 * Flat-rate per province in IDR. Mirrors config/shipping.php.
 */
export const PROVINCE_FEES = {
    // Jawa
    'DKI Jakarta':              12000,
    'Jawa Barat':               10000,
    'Banten':                   12000,
    'Jawa Tengah':              14000,
    'DI Yogyakarta':            14000,
    'Jawa Timur':               15000,

    // Bali & Nusa Tenggara
    'Bali':                     17000,
    'Nusa Tenggara Barat':      20000,
    'Nusa Tenggara Timur':      22000,

    // Sumatera
    'Aceh':                     20000,
    'Sumatera Utara':           18000,
    'Sumatera Barat':           18000,
    'Riau':                     18000,
    'Kepulauan Riau':           20000,
    'Jambi':                    18000,
    'Sumatera Selatan':         18000,
    'Kepulauan Bangka Belitung':20000,
    'Bengkulu':                 18000,
    'Lampung':                  18000,

    // Kalimantan
    'Kalimantan Barat':         22000,
    'Kalimantan Tengah':        22000,
    'Kalimantan Selatan':       22000,
    'Kalimantan Timur':         22000,
    'Kalimantan Utara':         22000,

    // Sulawesi
    'Sulawesi Utara':           25000,
    'Sulawesi Tengah':          25000,
    'Sulawesi Selatan':         25000,
    'Sulawesi Tenggara':        25000,
    'Gorontalo':                25000,
    'Sulawesi Barat':           25000,

    // Maluku
    'Maluku':                   28000,
    'Maluku Utara':             28000,

    // Papua
    'Papua Barat':              30000,
    'Papua Barat Daya':         30000,
    'Papua':                    30000,
    'Papua Selatan':            30000,
    'Papua Tengah':             30000,
    'Papua Pegunungan':         30000,
};

/** Sorted list of all province names */
export const PROVINCES = Object.keys(PROVINCE_FEES).sort((a, b) => a.localeCompare(b, 'id'));

/** Returns shipping fee for a given province, or 0 if not found */
export function getShippingFee(province) {
    return PROVINCE_FEES[province] ?? 0;
}

/**
 * Mapping from province name → emsifa API province ID
 * Used to fetch cities: https://emsifa.github.io/api-wilayah-indonesia/api/regencies/{id}.json
 */
export const PROVINCE_EMSIFA_IDS = {
    'Aceh':                       '11',
    'Sumatera Utara':             '12',
    'Sumatera Barat':             '13',
    'Riau':                       '14',
    'Jambi':                      '15',
    'Sumatera Selatan':           '16',
    'Bengkulu':                   '17',
    'Lampung':                    '18',
    'Kepulauan Bangka Belitung':  '19',
    'Kepulauan Riau':             '21',
    'DKI Jakarta':                '31',
    'Jawa Barat':                 '32',
    'Jawa Tengah':                '33',
    'DI Yogyakarta':              '34',
    'Jawa Timur':                 '35',
    'Banten':                     '36',
    'Bali':                       '51',
    'Nusa Tenggara Barat':        '52',
    'Nusa Tenggara Timur':        '53',
    'Kalimantan Barat':           '61',
    'Kalimantan Tengah':          '62',
    'Kalimantan Selatan':         '63',
    'Kalimantan Timur':           '64',
    'Kalimantan Utara':           '65',
    'Sulawesi Utara':             '71',
    'Sulawesi Tengah':            '72',
    'Sulawesi Selatan':           '73',
    'Sulawesi Tenggara':          '74',
    'Gorontalo':                  '75',
    'Sulawesi Barat':             '76',
    'Maluku':                     '81',
    'Maluku Utara':               '82',
    'Papua Barat':                '91',
    'Papua':                      '94',
    // Newer DOB provinces (may not have full regency data yet)
    'Papua Barat Daya':           '91',
    'Papua Selatan':              '94',
    'Papua Tengah':               '94',
    'Papua Pegunungan':           '94',
};
