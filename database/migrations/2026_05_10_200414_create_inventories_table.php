<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->enum('cylinder_type', ['domestic_14_2', 'commercial_19', 'domestic_5'])->unique();
            $table->integer('full_cylinders')->default(0);
            $table->integer('empty_cylinders')->default(0);
            $table->integer('defective_cylinders')->default(0);
            $table->decimal('current_price', 10, 2);
            $table->integer('reorder_level')->default(50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};