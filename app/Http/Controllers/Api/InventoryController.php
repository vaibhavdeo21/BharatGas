<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    /**
     * Get all inventory items for the cards
     */
    public function index()
    {
        return response()->json(Inventory::all());
    }

    /**
     * Get transaction history
     * Fixes the 500 error by ensuring this method exists
     */
    public function transactions()
    {
        // Returning an empty array for now until you have a Transaction model.
        // Once you create a Transaction model, you can return Transaction::latest()->get();
        return response()->json([]); 
    }

    /**
     * Handle truck manifest updates
     */
    public function receiveTruck(Request $request)
{
    $request->validate([
        'truckNo' => 'required|string',
        'items' => 'required|array',
        'items.*.cylinder_type' => 'required|string',
        'items.*.fullReceived' => 'required|integer|min:0',
        'items.*.emptyReturned' => 'required|integer|min:0',
    ]);

    \Illuminate\Support\Facades\DB::beginTransaction();
    try {
        foreach ($request->items as $item) {
            // Only update if there are actual quantities entered
            if ($item['fullReceived'] > 0 || $item['emptyReturned'] > 0) {
                $stock = \App\Models\Inventory::where('cylinder_type', $item['cylinder_type'])->first();
                if ($stock) {
                    $stock->full_cylinders += $item['fullReceived'];
                    $stock->empty_cylinders -= $item['emptyReturned'];
                    $stock->save();
                }
            }
        }
        \Illuminate\Support\Facades\DB::commit();
        return response()->json(['message' => 'Inventory updated successfully']);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\DB::rollBack();
        return response()->json(['message' => 'Failed to update', 'error' => $e->getMessage()], 500);
    }
}

    /**
     * Get low stock alerts
     */
    public function lowStockAlerts()
    {
        return response()->json(Inventory::where('full_cylinders', '<', 50)->get());
    }
}