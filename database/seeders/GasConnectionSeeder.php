<?php

namespace Database\Seeders;

use App\Models\GasConnection;
use App\Models\User;
use Illuminate\Database\Seeder;

class GasConnectionSeeder extends Seeder
{
    
    public function run(): void
    {
        // Find our test customer
        $customer = User::where('email', 'customer@amrutha.com')->first();

        if ($customer) {
            GasConnection::create([
                'user_id' => $customer->id,
                'consumer_number' => '7098231',  
                'sv_number' => 'SV-987654321',
                'connection_type' => 'domestic_14_2',
                'cylinders_held' => 1,
                'regulator_number' => 'REG-456123',
                'status' => 'active',
                'kyc_verified_at' => now()->subMonths(6),
            ]);
        }
    }
}