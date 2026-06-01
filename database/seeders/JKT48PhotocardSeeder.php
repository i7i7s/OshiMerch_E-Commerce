<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JKT48PhotocardSeeder extends Seeder
{
    // All 30 accounts from TempUserSeeder — distributed round-robin
    private array $sellerEmails = [
        'rizkypratama12@gmail.com',
        'dindaaprilia88@mail.com',
        'fadhilramadhan21@yahoo.com',
        'naylasyifa77@gmail.com',
        'bagaswira04@mail.com',
        'keishaananda33@gmail.com',
        'rafiardiansyah09@mail.com',
        'putrikirana44@yahoo.com',
        'adityanugraha18@gmail.com',
        'celsameidina70@mail.com',
        'gilangsaputra95@gmail.com',
        'ameliasafitri66@mail.com',
        'farrelakbar11@gmail.com',
        'shintadewi20@yahoo.com',
        'andikaferdian73@gmail.com',
        'tiarameilani52@mail.com',
        'iqbalmaulana81@gmail.com',
        'nabilaputri16@mail.com',
        'wahyurizki39@gmail.com',
        'salshabilaulia47@mail.com',
        'reynardhan58@yahoo.com',
        'aureliacitra12@gmail.com',
        'muhammadraka31@mail.com',
        'febriananda45@gmail.com',
        'alifhidayat83@mail.com',
        'karinapermata27@gmail.com',
        'zidanfauzan60@yahoo.com',
        'aisyahnurhaliza91@mail.com',
        'raflyanugrah14@gmail.com',
        'devinakharisma55@mail.com',
    ];

    // 37 photocards from jkt48_photocard_50_data.json (PC-001 to PC-037)
    private array $products = [
        [
            'title'       => 'Photocard Official JKT48 Meet & Greet ALL IN TOUR 2025 - Freya Jayawardana',
            'description' => 'Photocard official JKT48 edisi Meet & Greet ALL IN TOUR 2025 - Freya Jayawardana. Koleksi resmi yang diperoleh saat event konser nasional terbesar JKT48 tahun 2025. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Freya Jayawardana',
            'member_code' => 'FREYA_JAYAWARDANA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2348cb9faf4d839303bc7bbdb8c741560cd88687.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 MnG Theater Sementara Surabaya & Yogyakarta - Freya Jayawardana',
            'description' => 'Photocard official JKT48 Meet & Greet Theater Sementara Surabaya & Yogyakarta 2024 - Freya Jayawardana. Koleksi dari event MnG eksklusif era hiatus theater. Langka dan banyak dicari.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Freya Jayawardana',
            'member_code' => 'FREYA_JAYAWARDANA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/84397f2c2bbdcca62dafda03c18bfd5894b0062b.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 x Japota Collaboration 2025 - Freya Jayawardana',
            'description' => 'Photocard official dari kolaborasi eksklusif JKT48 x Japota 2025 - Freya Jayawardana. Edisi terbatas kolaborasi brand lokal. Sangat langka pasca event.',
            'category'    => 'photocard',
            'price'       => 45000,
            'condition'   => 'New',
            'member_name' => 'Freya Jayawardana',
            'member_code' => 'FREYA_JAYAWARDANA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/368e845b539cd8341be2ea7afde512757945b2ba.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Sousenkyo (SSK) 2024 - Freya Jayawardana (Rank #6)',
            'description' => 'Photocard official JKT48 General Election (Sousenkyo) 2024 - Freya Jayawardana, Rank #6. Edisi langka, hanya tersedia bagi peserta voting. Stok sangat terbatas, sangat dicari kolektor.',
            'category'    => 'photocard',
            'price'       => 90000,
            'condition'   => 'New',
            'member_name' => 'Freya Jayawardana',
            'member_code' => 'FREYA_JAYAWARDANA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2348cb9faf4d839303bc7bbdb8c741560cd88687.jpg',
        ],
        [
            'title'       => 'Photocard Birthday T-Shirt (BDTS) JKT48 2026 - Marsha Lenathea',
            'description' => 'Photocard bonus eksklusif dari Birthday T-Shirt JKT48 2026 - Marsha Lenathea. Tersedia sebagai bonus pembelian BDTS maupun dijual terpisah. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Marsha Lenathea',
            'member_code' => 'MARSHA_LENATHEA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/a9b73b3ff2b81d871e980b28c3c7b72d8e5d24ff.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Meet & Greet ALL IN TOUR 2025 - Marsha Lenathea',
            'description' => 'Photocard official JKT48 edisi Meet & Greet ALL IN TOUR 2025 - Marsha Lenathea. Koleksi resmi dari konser Raja Hati 2025. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Marsha Lenathea',
            'member_code' => 'MARSHA_LENATHEA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c6f4eb20c52e81b2f2b7af89f6557c3b75e765e9.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Boxset Single - Andai Ku Bukan Idola - Fiony Alveria',
            'description' => 'Photocard official JKT48 dari boxset single "Andai Ku Bukan Idola" 2024 - Fiony Alveria. Koleksi resmi yang disertakan dalam pembelian boxset album single. Kondisi tersegel.',
            'category'    => 'photocard',
            'price'       => 75000,
            'condition'   => 'New',
            'member_name' => 'Fiony Alveria',
            'member_code' => 'FIONY_ALVERIA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/fc251609d6307bbc1f3cf1be8f1968d1e88f1162.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 MnG Theater Sementara Surabaya - Fiony Alveria',
            'description' => 'Photocard official JKT48 Meet & Greet Theater Sementara Surabaya 2024 - Fiony Alveria. Koleksi eksklusif dari event MnG era hiatus theater. Stok terbatas.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Fiony Alveria',
            'member_code' => 'FIONY_ALVERIA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/84397f2c2bbdcca62dafda03c18bfd5894b0062b.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Spring Has Come (SHC) - Gita Sekar Andarini',
            'description' => 'Photocard official JKT48 edisi Spring Has Come 2023 - Gita Sekar Andarini. Salah satu event paling populer dan ikonik JKT48. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Gita Sekar Andarini',
            'member_code' => 'GITA_SEKAR_ANDARINI',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/78d54301aa70f7ad63f94f070b4df9020660cce7.jpg',
        ],
        [
            'title'       => 'Photocard Special Birthday Gita Sekar Andarini - Road to G-Day 22nd',
            'description' => 'Photocard special birthday Gita Sekar Andarini edisi Road to G-Day 22nd 2023. Fan-made special edition dari komunitas. Kondisi baru. Harga terjangkau untuk kolektor.',
            'category'    => 'photocard',
            'price'       => 20000,
            'condition'   => 'New',
            'member_name' => 'Gita Sekar Andarini',
            'member_code' => 'GITA_SEKAR_ANDARINI',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/b3f65e8122c174d4deb59314a3cf004bebb1dfb4.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 The Morning Call (TMC) - Jessica Chandra',
            'description' => 'Photocard official JKT48 edisi The Morning Call 2023 - Jessica Chandra. Event online eksklusif yang menghasilkan photocard langka. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Jessica Chandra',
            'member_code' => 'JESSICA_CHANDRA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/a670ce6f6844354a7126d7bc0e495c9b648df2df.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Summer Tour 2023 - Jessica Chandra',
            'description' => 'Photocard official JKT48 Summer Tour 2023 - Jessica Chandra. Stok langka dan terbatas. Merchandise resmi dari tur musim panas 2023. Kondisi baru.',
            'category'    => 'photocard',
            'price'       => 45000,
            'condition'   => 'New',
            'member_name' => 'Jessica Chandra',
            'member_code' => 'JESSICA_CHANDRA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/629e985745d1984d86344389d0695536fc94ea61.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Meet & Greet ALL IN TOUR 2025 - Jessica Chandra',
            'description' => 'Photocard official JKT48 Meet & Greet ALL IN TOUR 2025 Raja Hati - Jessica Chandra. Koleksi resmi dari konser nasional JKT48. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Jessica Chandra',
            'member_code' => 'JESSICA_CHANDRA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5aff9bcf23325ccd334e5cccb6a363a7ed6af1e8.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 The Morning Call (TMC) - Mutiara Azzahra',
            'description' => 'Photocard official JKT48 edisi The Morning Call 2023 - Mutiara Azzahra. Koleksi dari event online eksklusif JKT48. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Mutiara Azzahra',
            'member_code' => 'MUTIARA_AZZAHRA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0c705728c3283a258d4bbc380bf6f27744fbcc3c.jpg',
        ],
        [
            'title'       => 'Photocard Birthday T-Shirt (BDTS) JKT48 2026 - Mutiara Azzahra',
            'description' => 'Photocard bonus eksklusif dari Birthday T-Shirt JKT48 2026 - Mutiara Azzahra (Cia). Tersedia sebagai bonus pembelian BDTS maupun dijual terpisah. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Mutiara Azzahra',
            'member_code' => 'MUTIARA_AZZAHRA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0c705728c3283a258d4bbc380bf6f27744fbcc3c.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 NTSY - Indah Cahya',
            'description' => 'Photocard official JKT48 edisi NTSY (Nantikan Theater Sementara Kami Ya) 2023 - Indah Cahya. Koleksi eksklusif dari era hiatus theater JKT48. Kondisi baru.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Indah Cahya',
            'member_code' => 'INDAH_CAHYA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dd713ea5614d20659ca309278417a4cb05b77ae5.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Meet & Greet Special Event 2024 - Indah Cahya',
            'description' => 'Photocard official JKT48 Meet & Greet Special Event 2024 - Indah Cahya. Koleksi dari event tatap muka eksklusif. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 45000,
            'condition'   => 'New',
            'member_name' => 'Indah Cahya',
            'member_code' => 'INDAH_CAHYA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7a5c3245dab6d39eee4c57b26a3a88a5581d85b6.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 The Morning Call (TMC) - Indah Cahya',
            'description' => 'Photocard official JKT48 edisi The Morning Call 2023 - Indah Cahya. Event online eksklusif, photocard banyak dicari kolektor. Kondisi baru.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Indah Cahya',
            'member_code' => 'INDAH_CAHYA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4432737a0332d46a9b9e2f3bd1bea7853cc44b71.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 The Morning Call (TMC) - Angelina Christy',
            'description' => 'Photocard official JKT48 edisi The Morning Call 2023 - Angelina Christy. Koleksi langka dari event online eksklusif. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Angelina Christy',
            'member_code' => 'ANGELINA_CHRISTY',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3a8180ce941853f0e7af39e5e8401e81ce017fbc.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Sousenkyo (SSK) 2024 - Angelina Christy (Rank #2)',
            'description' => 'Photocard official JKT48 General Election (Sousenkyo) 2024 - Angelina Christy, Rank #2. Edisi sangat langka dan bergengsi. Hanya tersedia bagi peserta voting. Stok sangat terbatas.',
            'category'    => 'photocard',
            'price'       => 90000,
            'condition'   => 'New',
            'member_name' => 'Angelina Christy',
            'member_code' => 'ANGELINA_CHRISTY',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3a8180ce941853f0e7af39e5e8401e81ce017fbc.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Summer Tour 2023 - Lulu Salsabila',
            'description' => 'Photocard official JKT48 Summer Tour 2023 - Lulu Salsabila. Merchandise resmi dari tur musim panas 2023. Kondisi baru tersegel. Harga terjangkau.',
            'category'    => 'photocard',
            'price'       => 35000,
            'condition'   => 'New',
            'member_name' => 'Lulu Salsabila',
            'member_code' => 'LULU_SALSABILA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/99af7c77a97bd86b5e50f2463b23ab0d477cc7bc.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Summer Tour 2023 - Cornelia Vanisa (Oniel)',
            'description' => 'Photocard official JKT48 Summer Tour 2023 - Cornelia Vanisa (Oniel). Merchandise resmi dari konser tur musim panas 2023. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 35000,
            'condition'   => 'New',
            'member_name' => 'Cornelia Vanisa',
            'member_code' => 'CORNELIA_VANISA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7231ee875e14cb015c663f5d15dcec3b32fbd144.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 MnG 26th Single - Circus - Cornelia Vanisa (Oniel)',
            'description' => 'Photocard official JKT48 Meet & Greet edisi 26th Single "Circus" 2024 - Cornelia Vanisa (Oniel). Koleksi resmi dari event MnG peluncuran single. Kondisi baru.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Cornelia Vanisa',
            'member_code' => 'CORNELIA_VANISA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/41cbfc292ae596228efe0adb1349edbd728a8398.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 ALL IN TOUR 2025 - Cornelia Vanisa (Oniel)',
            'description' => 'Photocard official JKT48 ALL IN TOUR 2025 Raja Hati - Cornelia Vanisa (Oniel). Koleksi dari konser nasional terbesar JKT48 tahun 2025. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Cornelia Vanisa',
            'member_code' => 'CORNELIA_VANISA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c47ad128a038786d195e01b3c15a9f60bc579277.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 NTSY - Helisma Putri (Eli)',
            'description' => 'Photocard official JKT48 edisi NTSY (Nantikan Theater Sementara Kami Ya) 2023 - Helisma Putri (Eli). Koleksi eksklusif dari era hiatus theater JKT48. Kondisi baru.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Helisma Putri',
            'member_code' => 'HELISMA_PUTRI',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/289615379a994d8716d2499f9b1c62fdaff0a589.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 The Morning Call (TMC) - Helisma Putri (Eli)',
            'description' => 'Photocard official JKT48 edisi The Morning Call 2023 - Helisma Putri (Eli). Event online eksklusif JKT48, photocard langka dan banyak dicari. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Helisma Putri',
            'member_code' => 'HELISMA_PUTRI',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2164875e50035b0ee7ac5c53c60195c67170c8b5.jpg',
        ],
        [
            'title'       => 'Photocard Birthday T-Shirt (BDTS) JKT48 2026 - Helisma Putri (Eli)',
            'description' => 'Photocard bonus eksklusif dari Birthday T-Shirt JKT48 2026 - Helisma Putri (Eli). Tersedia sebagai bonus pembelian BDTS maupun dijual terpisah. Kondisi baru.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Helisma Putri',
            'member_code' => 'HELISMA_PUTRI',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/031af41dd2b6817c67774930c9a035ce83071143.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Spring Has Come (SHC) - Feni Fitriyanti',
            'description' => 'Photocard official JKT48 edisi Spring Has Come 2023 - Feni Fitriyanti. Salah satu event paling ikonik JKT48. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Feni Fitriyanti',
            'member_code' => 'FENI_FITRIYANTI',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2d18bbd2d4eadb2a2fc4bdb0d54425a0f66c94cc.jpg',
        ],
        [
            'title'       => 'Photocard Hologram JKT48 2 Sisi - Feni Fitriyanti',
            'description' => 'Photocard hologram 2 sisi JKT48 Special Hologram Series 2024 - Feni Fitriyanti. Efek hologram premium, kualitas cetak tinggi. Edisi spesial sangat cocok untuk koleksi.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Feni Fitriyanti',
            'member_code' => 'FENI_FITRIYANTI',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/724531efd66ea30f119daf3c330b7484680d0244.jpg',
        ],
        [
            'title'       => 'Photocard Hologram JKT48 2 Sisi - Greesella Adhalia',
            'description' => 'Photocard hologram 2 sisi JKT48 Special Hologram Series 2024 - Greesella Adhalia. Efek hologram premium berkualitas tinggi. Edisi spesial untuk kolektor. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Greesella Adhalia',
            'member_code' => 'GREESELLA_ADHALIA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/1eb65556c85303974cb5758f7c1ea6e2fd98f845.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Meet & Greet Love Dream Passion 2026 - Adeline Wijaya (Delynn)',
            'description' => 'Photocard official JKT48 Meet & Greet Love Dream Passion 2026 - Adeline Wijaya (Delynn). Koleksi dari event eksklusif terbaru JKT48. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Adeline Wijaya',
            'member_code' => 'ADELINE_WIJAYA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/59cc1b948faf3c103932c64edecc2fc8f335e4e7.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Love Dream Passion Event 2026 - Adeline Wijaya (Delynn)',
            'description' => 'Photocard official JKT48 Love Dream Passion 2026 - Adeline Wijaya (Delynn). Koleksi eksklusif dari event Love Dream Passion terbaru. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Adeline Wijaya',
            'member_code' => 'ADELINE_WIJAYA',
            'member_team' => 'DREAM',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/de0d6b02c3f679e2f3a5d5c7bdb71e535de07bfa.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Love Dream Passion Event 2026 - Aurhel Alana (Lana)',
            'description' => 'Photocard official JKT48 Love Dream Passion 2026 - Aurhel Alana (Lana). Koleksi dari event Love Dream Passion terbaru JKT48. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Aurhel Alana',
            'member_code' => 'AURHEL_ALANA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c1cfbcbd8d7eb1083090133106157c9a23ffdf2d.jpg',
        ],
        [
            'title'       => 'Photopack Official JKT48 Team Love Setlist Event 2026 - Aurhel Alana (Lana)',
            'description' => 'Photopack official JKT48 Team Love Setlist Event 2026 - Aurhel Alana (Lana). Koleksi resmi dari pertunjukan tim eksklusif. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Aurhel Alana',
            'member_code' => 'AURHEL_ALANA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/6fc0c7b68c5faf429a5f73d8f5e0f19b0edbbfb1.jpg',
        ],
        [
            'title'       => 'Photocard Birthday T-Shirt (BDTS) JKT48 2026 - Ribka Budiman',
            'description' => 'Photocard bonus eksklusif dari Birthday T-Shirt JKT48 2026 - Ribka Budiman. Tersedia sebagai bonus pembelian BDTS maupun dijual terpisah. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Ribka Budiman',
            'member_code' => 'RIBKA_BUDIMAN',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/94c5c5ab745b62ae9b0a0e418f363c2a8c947190.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 MnG Love Dream Passion 2026 - Ribka Budiman',
            'description' => 'Photocard official JKT48 Meet & Greet Love Dream Passion 2026 - Ribka Budiman. Koleksi dari event eksklusif Love Dream Passion terbaru. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Ribka Budiman',
            'member_code' => 'RIBKA_BUDIMAN',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/080dd2d46df24d91c1b9568eef372e96c587ab06.jpg',
        ],
        [
            'title'       => 'Photocard Official JKT48 Team Love Setlist 2026 - Cathleen Nixie (Cathy)',
            'description' => 'Photocard official JKT48 Team Love Setlist 2026 - Cathleen Nixie (Cathy). Koleksi resmi dari event pertunjukan tim eksklusif. Kondisi baru tersegel.',
            'category'    => 'photocard',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => 'Cathleen Nixie',
            'member_code' => 'CATHLEEN_NIXIE',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/d856510b9d802d56a551a9c9174e009dd3cd8224.jpg',
        ],
    ];

    public function run(): void
    {
        // Resolve all available user IDs from TempUserSeeder accounts
        $userIds = [];
        foreach ($this->sellerEmails as $email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $userIds[] = $user->id;
            } else {
                $this->command->warn("  ✗ User not found: {$email}");
            }
        }

        if (empty($userIds)) {
            $this->command->error('No user accounts found. Run TempUserSeeder first.');
            return;
        }

        $this->command->info('Found ' . count($userIds) . ' user accounts for round-robin distribution.');

        $imageCache  = [];
        $sellerIndex = 0;
        $created     = 0;
        $skipped     = 0;

        foreach ($this->products as $p) {
            // Idempotent: skip if already seeded
            if (Listing::where('title', $p['title'])->exists()) {
                $this->command->line("  ⟳ Skip (exists): {$p['title']}");
                $skipped++;
                $sellerIndex = ($sellerIndex + 1) % count($userIds);
                continue;
            }

            // Download image once per unique URL
            if (! array_key_exists($p['image_url'], $imageCache)) {
                $imageCache[$p['image_url']] = $this->downloadImage($p['image_url']);
            }

            // Round-robin seller assignment across all 30 users
            $sellerId    = $userIds[$sellerIndex];
            $sellerIndex = ($sellerIndex + 1) % count($userIds);

            Listing::create([
                'user_id'              => $sellerId,
                'title'                => $p['title'],
                'description'          => $p['description'],
                'category'             => $p['category'],
                'price'                => $p['price'],
                'condition'            => $p['condition'],
                'status'               => 'Available',
                'image_path'           => $imageCache[$p['image_url']],
                'featured_member_code' => $p['member_code'],
                'featured_member_name' => $p['member_name'],
                'featured_member_team' => $p['member_team'],
            ]);

            $this->command->line("  ✓ Created: \"{$p['title']}\" → user ID {$sellerId}");
            $created++;
        }

        $this->command->newLine();
        $this->command->info("Done! {$created} listings created, {$skipped} skipped.");
    }

    private function downloadImage(string $url): ?string
    {
        try {
            $this->command->line("  ↓ Downloading: " . Str::limit($url, 90));

            $response = Http::timeout(20)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 OshiMerch-Seeder/1.0'])
                ->get($url);

            if (! $response->successful()) {
                $this->command->warn("  ✗ HTTP {$response->status()} — skipping image");
                return null;
            }

            $filename = 'listings/' . Str::uuid() . '.jpg';
            Storage::disk('public')->put($filename, $response->body());
            $this->command->line("  ✓ Saved: {$filename}");

            return $filename;
        } catch (\Throwable $e) {
            $this->command->warn("  ✗ Download failed: {$e->getMessage()}");
            return null;
        }
    }
}
