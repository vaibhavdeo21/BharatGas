<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\GasConnection;
use App\Models\Delivery;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings (Admin/Staff view).
     */
    public function index(Request $request)
    {
        // If admin, show all. If customer, this shouldn't be hit (they use history).
        $bookings = Booking::with(['user', 'gasConnection'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($bookings);
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cylinder_type' => 'required|in:domestic_14_2,commercial_19,domestic_5',
            'quantity' => 'required|integer|min:1|max:5',
        ]);

        $user = $request->user();
        
        // Ensure user has an active connection
        $connection = GasConnection::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (!$connection) {
            return response()->json([
                'message' => 'No active gas connection found for this user.'
            ], 403);
        }

        // Mock pricing based on type
        $prices = [
            'domestic_14_2' => 850.50,
            'commercial_19' => 1750.00,
            'domestic_5' => 450.00,
        ];

        $totalAmount = $prices[$validated['cylinder_type']] * $validated['quantity'];

        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'booking_reference' => 'BKG-' . strtoupper(Str::random(8)),
                'user_id' => $user->id,
                'gas_connection_id' => $connection->id,
                'cylinder_type' => $validated['cylinder_type'],
                'quantity' => $validated['quantity'],
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'booking_date' => now(),
                'expected_delivery_date' => now()->addDays(2),
            ]);

            // Optional: Create initial invoice here

            DB::commit();

            return response()->json([
                'message' => 'Booking created successfully',
                'booking' => $booking
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Booking failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        // Ensure the user owns this booking or is an admin
        if (auth()->user()->role !== 'admin' && $booking->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking->load(['user', 'gasConnection', 'delivery']));
    }

    /**
     * Cancel the booking.
     */
    public function cancel(Request $request, Booking $booking)
    {
        if (auth()->user()->role !== 'admin' && $booking->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return response()->json(['message' => 'Booking cannot be cancelled at this stage'], 400);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Booking cancelled successfully',
            'booking' => $booking
        ]);
    }

    /**
     * Get booking history for the authenticated customer.
     */
    public function history(Request $request)
    {
        $bookings = Booking::with('delivery')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    /**
     * Assign a delivery agent to this booking.
     */
    public function assignDelivery(Request $request, Booking $booking)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'delivery_staff_id' => 'required|exists:users,id',
        ]);

        $staff = User::where('id', $validated['delivery_staff_id'])->whereIn('role', ['delivery', 'delivery_staff', 'admin'])->first();
        if (!$staff) {
            return response()->json(['message' => 'Invalid delivery staff member.'], 400);
        }

        // Check if delivery already exists
        $delivery = Delivery::where('booking_id', $booking->id)->first();
        
        if ($delivery) {
            $delivery->update([
                'delivery_staff_id' => $staff->id,
                'status' => 'assigned',
            ]);
        } else {
            Delivery::create([
                'booking_id' => $booking->id,
                'delivery_staff_id' => $staff->id,
                'status' => 'assigned',
            ]);
        }

        $booking->update(['status' => 'out_for_delivery']);

        return response()->json([
            'message' => 'Delivery staff assigned successfully.',
            'booking' => $booking->fresh(['delivery']),
        ]);
    }

    /**
     * Customer confirms they received the cylinder.
     */
    public function confirmReceipt(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'delivered') {
            return response()->json(['message' => 'Booking must be delivered before confirming receipt.'], 400);
        }

        $booking->update([
            'customer_confirmed' => true,
        ]);

        return response()->json([
            'message' => 'Receipt confirmed successfully.',
            'booking' => $booking,
        ]);
    }
}