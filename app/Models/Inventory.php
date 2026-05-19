<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';

    protected $fillable = [
        'cylinder_type',
        'full_cylinders',
        'empty_cylinders',
        'defective_cylinders',
        'current_price',
        'reorder_level'
    ];

    protected $casts = [
        'current_price' => 'decimal:2',
    ];

    public function getTotalCylindersAttribute(): int
    {
        return $this->full_cylinders + $this->empty_cylinders + $this->defective_cylinders;
    }
}