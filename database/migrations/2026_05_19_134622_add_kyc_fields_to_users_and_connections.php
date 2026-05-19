<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('aadhaar_number')->nullable();
            $table->string('pan_number')->nullable();
            $table->string('profile_photo')->nullable();
            $table->enum('account_status', ['active', 'suspended'])->default('active');
        });

        Schema::table('gas_connections', function (Blueprint $table) {
            $table->string('cylinder_type')->nullable(); // e.g., 14.2kg, 19kg
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['aadhaar_number', 'pan_number', 'profile_photo', 'account_status']);
        });

        Schema::table('gas_connections', function (Blueprint $table) {
            $table->dropColumn(['cylinder_type']);
        });
    }
};
