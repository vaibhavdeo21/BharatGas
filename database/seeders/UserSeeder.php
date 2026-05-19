<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Master Admin
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@amrutha.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '9999999999',
            'address' => 'Amrutha Gas Agency HQ, Kathar Kalan',
            'is_active' => true,
        ]);

        // 2. Create Delivery Staff
        User::create([
            'name' => 'Raju Delivery',
            'email' => 'delivery@amrutha.com',
            'password' => Hash::make('password123'),
            'role' => 'delivery_staff',
            'phone' => '8888888888',
            'address' => 'Staff Quarters, Dhurki',
            'is_active' => true,
        ]);

        // 3. Create Test Customer
        User::create([
            'name' => 'Sumit Sharma',
            'email' => 'customer@amrutha.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'phone' => '7777777777',
            'address' => '123 ward, Sagma',
            'is_active' => true,
        ]);
    }
}