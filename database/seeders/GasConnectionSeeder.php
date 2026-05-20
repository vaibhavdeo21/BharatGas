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
            // updateOrCreate checks if 'consumer_number' exists first.
            // If it exists, it safely updates the row instead of crashing the deployment.
            GasConnection::updateOrCreate(
                ['consumer_number' => '7098231'], // Unique search criteria
                [
                    'user_id' => $customer->id,
                    'sv_number' => 'SV-987654321',
                    'connection_type' => 'domestic_14_2',
                    'cylinders_held' => 1,
                    'regulator_number' => 'REG-456123',
                    'status' => 'active',
                    'kyc_verified_at' => now()->subMonths(6),
                ]
            );
        }
    }
}