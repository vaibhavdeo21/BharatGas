<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\GasConnectionController;
use App\Http\Controllers\Api\AdminDashboardController;

/*
|--------------------------------------------------------------------------
| Enterprise API Routes (Sanctum Protected)
|--------------------------------------------------------------------------
*/

// Public Authentication Endpoints
Route::prefix('auth')->group(function () {
    Route::post('/login/request-otp', [AuthController::class, 'requestOtp']);
    Route::post('/login/verify-otp', [AuthController::class, 'verifyOtp']);
});

// Protected Endpoints
Route::middleware('auth:sanctum')->group(function () {
    
    // Session / User
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Bookings
    Route::apiResource('bookings', BookingController::class);
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    Route::get('/customer/bookings/history', [BookingController::class, 'history']);

    // Deliveries
    Route::apiResource('deliveries', DeliveryController::class);
    Route::post('/deliveries/{delivery}/assign', [DeliveryController::class, 'assign']);
    Route::post('/deliveries/{delivery}/status', [DeliveryController::class, 'updateStatus']);
    Route::post('/deliveries/{delivery}/verify-otp', [DeliveryController::class, 'verifyOtp']);

    // Complaints
    Route::apiResource('complaints', ComplaintController::class);

    // Invoices & Financials
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download']);

    // Gas Connections Master Data
    Route::apiResource('connections', GasConnectionController::class);

    // Admin Analytics & Dashboard
    Route::prefix('admin')->group(function () {
        Route::get('/stats/overview', [AdminDashboardController::class, 'overview']);
        Route::get('/stats/revenue', [AdminDashboardController::class, 'revenueChart']);
        Route::get('/stats/deliveries', [AdminDashboardController::class, 'deliveryMetrics']);
        
        // --- ADDED INVENTORY ROUTES TO MATCH REACT FRONTEND ---
        Route::get('/inventory/stock', [InventoryController::class, 'index']);
        Route::get('/inventory/transactions', [InventoryController::class, 'transactions']);
        Route::post('/inventory/truck/receive', [InventoryController::class, 'receiveTruck']);
        
        // --- REAL LIVE GPS MAP TELEMETRY BRIDGE ---
        Route::get('/fleet/gps-telemetry', [AdminDashboardController::class, 'getFleetTelemetry']);
        
        // --- REAL OTP ROUTES FOR STAFF MANAGEMENT ---
        Route::post('/staff/change-number/request', [AdminDashboardController::class, 'requestNumberChange']);
        Route::post('/staff/change-number/verify', [AdminDashboardController::class, 'verifyNumberChange']);

        // --- STAFF MANAGEMENT ---
        Route::get('/staff', [AdminDashboardController::class, 'getStaff']);
        Route::post('/staff', [AdminDashboardController::class, 'addStaff']);
        Route::delete('/staff/{id}', [AdminDashboardController::class, 'deleteStaff']);
    });
});