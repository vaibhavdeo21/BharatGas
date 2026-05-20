<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * STEP 1: Request Login OTP
     */
    public function requestOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|size:10|exists:users,phone',
            'role' => 'required|string|in:customer,admin,delivery'
        ], [
            'phone.exists' => 'This mobile number is not registered with our agency.',
            'role.in' => 'Invalid role selected.'
        ]);

        $user = User::where('phone', $request->phone)->first();
        
        $requestedRole = $request->role === 'delivery' ? 'delivery_staff' : $request->role;
        if ($user->role !== $requestedRole) {
            return response()->json([
                'message' => 'The mobile number does not match the selected role.'
            ], 403);
        }

        // Check if user is approved (making sure to handle uninitialized fields safely)
        if (isset($user->is_approved) && !$user->is_approved) {
            return response()->json([
                'message' => 'Your account is pending admin approval. Please check back later.'
            ], 403);
        }
        
        // Generate Real 6-digit OTP
        $otp = rand(100000, 999999);

        // Cache the OTP for 5 minutes
        Cache::put('login_otp_' . $user->phone, $otp, now()->addMinutes(5));

        // ==========================================
        // REAL SMS DELIVERY VIA FAST2SMS (NO TEMPLATE ID ROUTE)
        // ==========================================
        try {
            $response = Http::withHeaders([
                'authorization' => env('FAST2SMS_API_KEY') // Injected via Render Environment
            ])->post('https://www.fast2sms.com/dev/bulkV2', [
                'route'            => 'otp',                 // Tells Fast2SMS to use its built-in system template
                'variables_values' => (string)$otp,          // Automatically injects your 6-digit code into their default message
                'numbers'          => $user->phone,          // Target phone number
            ]);

            if (!$response->successful()) {
                Log::error('Fast2SMS OTP Endpoint Failed: ' . $response->body());
                Log::info("DEVELOPMENT FALLBACK: Login OTP for {$user->phone} is {$otp}");
            }
        } catch (\Exception $e) {
            Log::error('Fast2SMS Exception: ' . $e->getMessage());
            Log::info("DEVELOPMENT FALLBACK: Login OTP for {$user->phone} is {$otp}");
        }

        return response()->json([
            'message' => 'OTP sent successfully to your registered mobile number.'
        ]);
    }

    /**
     * STEP 2: Verify OTP and Login
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|size:10|exists:users,phone',
            'otp' => 'required|size:6',
            'role' => 'required|string|in:customer,admin,delivery'
        ]);

        // ⚡ DEVELOPMENT BYPASS: Instantly authenticate the dummy account with 111111
        if ($request->phone === '9999999999' && $request->otp === '111111') {
            $user = User::where('phone', $request->phone)->first();
            
            $requestedRole = $request->role === 'delivery' ? 'delivery_staff' : $request->role;
            if ($user->role !== $requestedRole) {
                return response()->json([
                    'message' => 'The mobile number does not match the selected role.'
                ], 403);
            }

            if (isset($user->is_approved) && !$user->is_approved) {
                return response()->json([
                    'message' => 'Your account is pending admin approval. Please check back later.'
                ], 403);
            }
            
            // Issue Laravel Sanctum Token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful (Dev Bypass Activated)',
                'user' => $user,
                'role' => $user->role,
                'token' => $token
            ]);
        }

        // Standard production validation chain
        $cachedOtp = Cache::get('login_otp_' . $request->phone);

        if (!$cachedOtp || (string)$cachedOtp !== (string)$request->otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP. Please try again.'
            ], 401);
        }

        // OTP is valid! Find user and generate token.
        $user = User::where('phone', $request->phone)->first();
        
        $requestedRole = $request->role === 'delivery' ? 'delivery_staff' : $request->role;
        if ($user->role !== $requestedRole) {
            return response()->json([
                'message' => 'The mobile number does not match the selected role.'
            ], 403);
        }

        if (isset($user->is_approved) && !$user->is_approved) {
            return response()->json([
                'message' => 'Your account is pending admin approval. Please check back later.'
            ], 403);
        }
        
        // Clear the cache so OTP cannot be reused
        Cache::forget('login_otp_' . $request->phone);

        // Issue Laravel Sanctum Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'role' => $user->role,
            'token' => $token
        ]);
    }

    /**
     * Customer Registration (Pending Approval)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|size:10|unique:users,phone',
            'email' => 'required|email|unique:users,email',
            'address' => 'required|string|max:1000'
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'password' => bcrypt(str()->random(12)), // Dummy password, using OTP for login
            'role' => 'customer',
            'is_approved' => false,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Registration successful! Your account is pending admin approval.'
        ], 201);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}