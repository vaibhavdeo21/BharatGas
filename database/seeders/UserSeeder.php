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
        // 1. Create/Update Master Admin
        User::updateOrCreate(
            ['email' => 'admin@amrutha.com'], // Checks if this email exists first
            [
                'name' => 'System Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '9999999999',
                'address' => 'Amrutha Gas Agency HQ, Kathar Kalan',
                'is_active' => true,
            ]
        );

        // 2. Create/Update Delivery Staff
        User::updateOrCreate(
            ['email' => 'delivery@amrutha.com'],
            [
                'name' => 'Raju Delivery',
                'password' => Hash::make('password123'),
                'role' => 'delivery_staff',
                'phone' => '8888888888',
                'address' => 'Staff Quarters, Dhurki',
                'is_active' => true,
            ]
        );

        // 3. Create/Update Test Customer
        User::updateOrCreate(
            ['email' => 'customer@amrutha.com'],
            [
                'name' => 'Sumit Sharma',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '7777777777',
                'address' => '123 ward, Sagma',
                'is_active' => true,
            ]
        );
    }
}