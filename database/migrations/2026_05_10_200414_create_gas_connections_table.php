<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gas_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('consumer_number')->unique();
            $table->string('sv_number')->unique()->nullable()->comment('Subscription Voucher Number');
            $table->enum('connection_type', ['domestic_14_2', 'commercial_19', 'domestic_5'])->default('domestic_14_2');
            $table->integer('cylinders_held')->default(1);
            $table->string('regulator_number')->nullable();
            $table->enum('status', ['active', 'suspended', 'surrendered'])->default('active');
            $table->timestamp('kyc_verified_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gas_connections');
    }
};