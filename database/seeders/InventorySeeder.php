<?php

namespace Database\Seeders;

use App\Models\Inventory;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inventory = [
            [
                'cylinder_type' => 'domestic_14_2',
                'full_cylinders' => 250,
                'empty_cylinders' => 50,
                'defective_cylinders' => 2,
                'current_price' => 970.50,
                'reorder_level' => 100,
            ],
            [
                'cylinder_type' => 'commercial_19',
                'full_cylinders' => 100,
                'empty_cylinders' => 20,
                'defective_cylinders' => 1,
                'current_price' => 3250.00,
                'reorder_level' => 30,
            ],
            [
                'cylinder_type' => 'domestic_5',
                'full_cylinders' => 50,
                'empty_cylinders' => 10,
                'defective_cylinders' => 0,
                'current_price' => 650.00,
                'reorder_level' => 15,
            ]
        ];

        foreach ($inventory as $item) {
            Inventory::create($item);
        }
    }
}