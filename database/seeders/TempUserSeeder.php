<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TempUserSeeder extends Seeder
{
    public function run()
    {
        $json = '[
  {
    "username": "rizkypratama",
    "email": "rizkypratama12@gmail.com",
    "pw": "Rizky#2026",
    "oshi": "Freya"
  },
  {
    "username": "dindaaprilia",
    "email": "dindaaprilia88@mail.com",
    "pw": "Dinda!771",
    "oshi": "Marsha"
  },
  {
    "username": "fadhilramadhan",
    "email": "fadhilramadhan21@yahoo.com",
    "pw": "Fadhil@224",
    "oshi": "Christy"
  },
  {
    "username": "naylasyifa",
    "email": "naylasyifa77@gmail.com",
    "pw": "Nayla#552",
    "oshi": "Alya"
  },
  {
    "username": "bagaswira",
    "email": "bagaswira04@mail.com",
    "pw": "Bagas!903",
    "oshi": "Muthe"
  },
  {
    "username": "keishaananda",
    "email": "keishaananda33@gmail.com",
    "pw": "Keisha#190",
    "oshi": "Erine"
  },
  {
    "username": "rafiardiansyah",
    "email": "rafiardiansyah09@mail.com",
    "pw": "Rafi@882",
    "oshi": "Shani"
  },
  {
    "username": "putrikirana",
    "email": "putrikirana44@yahoo.com",
    "pw": "Putri!551",
    "oshi": "Feni"
  },
  {
    "username": "adityanugraha",
    "email": "adityanugraha18@gmail.com",
    "pw": "Adit#420",
    "oshi": "Lyn"
  },
  {
    "username": "celsameidina",
    "email": "celsameidina70@mail.com",
    "pw": "Celsa!100",
    "oshi": "Kathrina"
  },
  {
    "username": "gilangsaputra",
    "email": "gilangsaputra95@gmail.com",
    "pw": "Gilang@777",
    "oshi": "Gita"
  },
  {
    "username": "ameliasafitri",
    "email": "ameliasafitri66@mail.com",
    "pw": "Amelia#123",
    "oshi": "Lulu"
  },
  {
    "username": "farrelakbar",
    "email": "farrelakbar11@gmail.com",
    "pw": "Farrel!876",
    "oshi": "Indah"
  },
  {
    "username": "shintadewi",
    "email": "shintadewi20@yahoo.com",
    "pw": "Shinta@321",
    "oshi": "Cynthia"
  },
  {
    "username": "andikaferdian",
    "email": "andikaferdian73@gmail.com",
    "pw": "Andika#555",
    "oshi": "Greesel"
  },
  {
    "username": "tiarameilani",
    "email": "tiarameilani52@mail.com",
    "pw": "Tiara!202",
    "oshi": "Oniel"
  },
  {
    "username": "iqbalmaulana",
    "email": "iqbalmaulana81@gmail.com",
    "pw": "Iqbal#888",
    "oshi": "Eli"
  },
  {
    "username": "nabilaputri",
    "email": "nabilaputri16@mail.com",
    "pw": "Nabila@606",
    "oshi": "Jessi"
  },
  {
    "username": "wahyurizki",
    "email": "wahyurizki39@gmail.com",
    "pw": "Wahyu!909",
    "oshi": "Cathy"
  },
  {
    "username": "salshabilaulia",
    "email": "salshabilaulia47@mail.com",
    "pw": "Salsa#741",
    "oshi": "Lia"
  },
  {
    "username": "reynardhan",
    "email": "reynardhan58@yahoo.com",
    "pw": "Rey!818",
    "oshi": "Ella"
  },
  {
    "username": "aureliacitra",
    "email": "aureliacitra12@gmail.com",
    "pw": "Aurel@770",
    "oshi": "Fiony"
  },
  {
    "username": "muhammadraka",
    "email": "muhammadraka31@mail.com",
    "pw": "Raka#622",
    "oshi": "Lana"
  },
  {
    "username": "febriananda",
    "email": "febriananda45@gmail.com",
    "pw": "Febri!551",
    "oshi": "Raisha"
  },
  {
    "username": "alifhidayat",
    "email": "alifhidayat83@mail.com",
    "pw": "Alif@002",
    "oshi": "Chelsea"
  },
  {
    "username": "karinapermata",
    "email": "karinapermata27@gmail.com",
    "pw": "Karina#404",
    "oshi": "Olla"
  },
  {
    "username": "zidanfauzan",
    "email": "zidanfauzan60@yahoo.com",
    "pw": "Zidan!888",
    "oshi": "Gracie"
  },
  {
    "username": "aisyahnurhaliza",
    "email": "aisyahnurhaliza91@mail.com",
    "pw": "Aisyah@747",
    "oshi": "Fritzy"
  },
  {
    "username": "raflyanugrah",
    "email": "raflyanugrah14@gmail.com",
    "pw": "Rafly#123",
    "oshi": "Nala"
  },
  {
    "username": "devinakharisma",
    "email": "devinakharisma55@mail.com",
    "pw": "Devina!919",
    "oshi": "Michie"
  }
]';

        $data = json_decode($json, true);

        foreach ($data as $item) {
            $code = strtolower(str_replace(' ', '', $item['oshi']));
            
            User::updateOrCreate(
                ['email' => $item['email']],
                [
                    'name' => $item['username'],
                    'password' => Hash::make($item['pw']),
                    'oshi_member_name' => $item['oshi'],
                    'oshi_member_code' => $code,
                    'onboarding_completed' => true,
                    'bio' => 'Halo! Aku seorang wota yang oshiin ' . $item['oshi'] . '!',
                    'role' => 'buyer',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
