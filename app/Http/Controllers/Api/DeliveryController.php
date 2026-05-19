<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    /**
     * Get deliveries assigned to the currently logged in staff member.
     */
    public function assigned(Request $request)
    {
        if (!in_array($request->user()->role, ['delivery', 'delivery_staff', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $deliveries = \App\Models\Delivery::with('booking')
            ->where('delivery_staff_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform for frontend usage
        $formatted = $deliveries->map(function($delivery) {
            $customer = \App\Models\User::find($delivery->booking->user_id);
            return [
                'id' => $delivery->id,
                'booking_id' => $delivery->booking_id,
                'status' => $delivery->status,
                'address' => $customer ? $customer->address : 'Address not found',
                'customer_name' => $customer ? $customer->name : 'Unknown',
                'amount' => $delivery->booking->total_amount,
                'created_at' => $delivery->created_at,
                'updated_at' => $delivery->updated_at,
            ];
        });

        return response()->json($formatted);
    }

    /**
     * Update the status of a specific delivery.
     */
    public function updateStatus(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['delivery', 'delivery_staff', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,in_transit,delivered,cancelled'
        ]);

        $delivery = \App\Models\Delivery::findOrFail($id);

        // Optional: Ensure this staff member owns this delivery unless they are an admin
        if ($request->user()->role !== 'admin' && $delivery->delivery_staff_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized - Not your delivery'], 403);
        }

        $delivery->status = $request->status;
        
        if ($request->status === 'delivered') {
            $delivery->delivered_at = now();
            // Also update the booking status
            if ($delivery->booking) {
                $delivery->booking->status = 'delivered';
                $delivery->booking->save();
            }
        }

        $delivery->save();

        return response()->json([
            'message' => 'Delivery status updated successfully',
            'delivery' => $delivery
        ]);
    }
}
