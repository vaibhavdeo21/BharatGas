<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\Delivery;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash; // Added for password hashing

class AdminDashboardController extends Controller
{
    /**
     * Get high-level KPI overview for the admin dashboard.
     */
    public function overview(Request $request)
    {
        // Ensure user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today();

        $totalCustomers = User::where('role', 'customer')->count();
        $todaysBookings = Booking::whereDate('booking_date', $today)->count();
        $pendingDeliveries = Delivery::whereIn('status', ['unassigned', 'assigned', 'in_transit'])->count();
        $todaysRevenue = Booking::whereDate('booking_date', $today)
                                ->whereNotIn('status', ['cancelled'])
                                ->sum('total_amount');

        return response()->json([
            'kpis' => [
                'total_customers' => $totalCustomers,
                'todays_bookings' => $todaysBookings,
                'pending_deliveries' => $pendingDeliveries,
                'todays_revenue' => $todaysRevenue,
            ]
        ]);
    }

    /**
     * Get revenue data for charts.
     */
    public function revenueChart(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get last 7 days revenue
        $revenueData = Booking::select(
            DB::raw('DATE(booking_date) as date'),
            DB::raw('SUM(total_amount) as revenue')
        )
        ->where('booking_date', '>=', Carbon::now()->subDays(7))
        ->whereNotIn('status', ['cancelled'])
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get();

        return response()->json($revenueData);
    }

    /**
     * Get delivery status metrics.
     */
    public function deliveryMetrics(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $metrics = Delivery::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        return response()->json($metrics);
    }

    /**
     * STEP 1: Generate OTP and send to CURRENT number via Fast2SMS to authorize change
     */
    public function requestNumberChange(Request $request)
    {
        // Ensure user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'staff_id' => 'required|exists:users,id',
            'new_phone' => 'required|size:10|unique:users,phone'
        ]);

        $staff = User::findOrFail($request->staff_id);

        // Generate Real 6-digit OTP
        $otp = rand(100000, 999999);

        // Cache the OTP for 5 minutes, tied specifically to this user ID
        Cache::put('change_number_otp_' . $staff->id, [
            'otp' => $otp,
            'new_phone' => $request->new_phone
        ], now()->addMinutes(5));

        // ==========================================
        // REAL SMS DELIVERY VIA FAST2SMS
        // ==========================================
        $message = "Your Amrutha BharatGas authorization code is {$otp}. Valid for 5 mins. Do not share this with anyone.";

        try {
            $response = Http::withHeaders([
                'authorization' => env('FAST2SMS_API_KEY')
            ])->post('https://www.fast2sms.com/dev/bulkV2', [
                'route' => 'q',
                'message' => $message,
                'language' => 'english',
                'flash' => 0,
                'numbers' => $staff->phone, // Sent to CURRENT number for security
            ]);

            if (!$response->successful()) {
                Log::error('Fast2SMS Sending Failed: ' . $response->body());
                // Fallback for development if API key isn't set yet
                Log::info("DEVELOPMENT FALLBACK: OTP for {$staff->phone} is {$otp}");
            }
        } catch (\Exception $e) {
            Log::error('Fast2SMS Exception: ' . $e->getMessage());
            // Fallback for development if offline
            Log::info("DEVELOPMENT FALLBACK: OTP for {$staff->phone} is {$otp}");
        }

        return response()->json([
            'message' => 'OTP generated and sent to current registered number.',
            'current_phone_masked' => '******' . substr($staff->phone, -4)
        ]);
    }

    /**
     * STEP 2: Verify the OTP and execute the database swap
     */
    public function verifyNumberChange(Request $request)
    {
        // Ensure user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'staff_id' => 'required|exists:users,id',
            'otp' => 'required|size:6'
        ]);

        $cachedData = Cache::get('change_number_otp_' . $request->staff_id);

        if (!$cachedData || (string)$cachedData['otp'] !== (string)$request->otp) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 400);
        }

        // OTP is valid! Swap the number.
        $staff = User::findOrFail($request->staff_id);
        $staff->phone = $cachedData['new_phone'];
        $staff->save();

        // Clear the cache so it cannot be reused
        Cache::forget('change_number_otp_' . $request->staff_id);

        return response()->json([
            'message' => 'Success! Phone number updated securely.',
            'new_phone' => $staff->phone
        ]);
    }

    /**
     * REAL-TIME GPS FLEET TELEMETRY: Proxy Gateway bridge to SeTrack Server API
     */
    public function getFleetTelemetry(Request $request)
    {
        // Ensure user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $baseUrl = env('SETRACK_BASE_URL', 'http://track.setrack.in/api');
            $cookieString = env('SETRACK_COOKIE_STRING');

            if (empty($cookieString)) {
                return response()->json(['status' => 'error', 'message' => 'SeTrack Session cookie configuration is missing in your local .env file.'], 500);
            }

            // Fire request mirroring your exact logged-in browser session signature
            $response = Http::withHeaders([
                'Cookie' => $cookieString,
                'Accept' => 'application/json',
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
                'Referer' => 'http://track.setrack.in/modern/'
            ])->get("{$baseUrl}/devices");

            if ($response->failed()) {
                Log::error("SeTrack Cloud Cluster Inbound Connection Failed: " . $response->body());
                return response()->json(['status' => 'error', 'message' => 'Failed to reach external tracking server'], 502);
            }

            $devices = $response->json();
            $filteredTrackers = [];

            // Pull your 2 exact device IDs from your environment definitions
            $allowedIds = [
                (int) env('SETRACK_TRUCK1_DEVICE_ID', 248857),
                (int) env('SETRACK_TRUCK2_DEVICE_ID', 109964)
            ];

            // Filter through the cloud response array to capture your vehicles cleanly
            if (is_array($devices)) {
                foreach ($devices as $device) {
                    if (isset($device['id']) && in_array((int)$device['id'], $allowedIds)) {
                        $filteredTrackers[] = [
                            'id' => $device['id'],
                            // Localized Fallbacks for Garhwa Region (JH-14)
                            'vehicle_no' => $device['name'] ?? ($device['id'] == 248857 ? 'JH-14 Pickup 1' : 'JH-14 Pickup 2'),
                            'latitude' => $device['lat'] ?? null,
                            'longitude' => $device['lng'] ?? null,
                            'speed' => isset($device['speed']) ? round($device['speed']) : 0,
                            'is_ignited' => isset($device['engine_status']) ? (bool)$device['engine_status'] : (isset($device['ignition']) ? (bool)$device['ignition'] : false),
                        ];
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'trackers' => $filteredTrackers
            ]);

        } catch (\Exception $e) {
            Log::error("SeTrack Data Proxy Processing Exception: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Internal processing loop failure.'], 500);
        }
    }

    // ==========================================
    // NEW: TEAM & STAFF MANAGEMENT
    // ==========================================

    /**
     * Get all agency staff (Admins & Delivery)
     */
    public function getStaff(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $staff = User::whereIn('role', ['admin', 'delivery', 'delivery_staff'])->get();
        return response()->json(['staff' => $staff]);
    }

    /**
     * Add a new staff member
     */
    public function addStaff(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|size:10|unique:users,phone',
            'role' => 'required|in:admin,delivery,delivery_staff',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->phone . '@amrutha.com', // Auto-generate a dummy email
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => true,
        ]);

        return response()->json(['message' => 'Staff member added successfully!', 'user' => $user]);
    }

    /**
     * Delete/Deactivate a staff member
     */
    public function deleteStaff(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // 1. Prevent admin from deleting themselves
        if ($request->user()->id == $id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 400);
        }

        $targetUser = User::findOrFail($id);

        // 2. 🔒 SECURITY HARDENING: Prevent an admin from deleting another admin account
        if ($targetUser->role === 'admin') {
            return response()->json(['message' => 'Security Violation: Management tier accounts cannot be removed via this dashboard.'], 403);
        }

        $targetUser->delete();

        return response()->json(['message' => 'Staff member removed successfully.']);
    }

    // ==========================================
    // NEW: CUSTOMER APPROVAL MANAGEMENT
    // ==========================================

    /**
     * Get all pending customer registrations
     */
    public function getPendingCustomers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pendingUsers = User::where('role', 'customer')
                            ->where('is_approved', false)
                            ->orderBy('created_at', 'desc')
                            ->get();

        return response()->json(['customers' => $pendingUsers]);
    }

    /**
     * Get all approved customer accounts
     */
    public function getApprovedCustomers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $approvedUsers = User::where('role', 'customer')
                            ->where('is_approved', true)
                            ->orderBy('created_at', 'desc')
                            ->get();

        return response()->json(['customers' => $approvedUsers]);
    }

    /**
     * Approve a pending customer
     */
    public function approveCustomer(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Invalid user role'], 400);
        }

        $user->is_approved = true;
        $user->save();

        return response()->json(['message' => 'Customer account approved successfully.']);
    }

    /**
     * Reject and delete a pending customer
     */
    public function rejectCustomer(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Invalid user role'], 400);
        }

        $user->forceDelete(); // Delete the unapproved user permanently

        return response()->json(['message' => 'Customer registration rejected.']);
    }

    /**
     * Update customer details and status
     */
    public function updateCustomer(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Invalid user role'], 400);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|size:10|unique:users,phone,' . $user->id,
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'address' => 'sometimes|required|string',
            'aadhaar_number' => 'nullable|string|max:20',
            'pan_number' => 'nullable|string|max:20',
            'account_status' => 'sometimes|required|in:active,suspended',
        ]);

        $user->update($request->only([
            'name', 'phone', 'email', 'address', 'aadhaar_number', 'pan_number', 'account_status'
        ]));

        return response()->json(['message' => 'Customer updated successfully', 'customer' => $user]);
    }

    /**
     * Delete customer account
     */
    public function deleteCustomer(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Invalid user role'], 400);
        }

        $user->delete(); // Soft delete

        return response()->json(['message' => 'Customer account deleted successfully.']);
    }
}