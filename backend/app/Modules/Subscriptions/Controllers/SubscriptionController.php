<?php

namespace App\Modules\Subscriptions\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Subscriptions\Models\Subscription;
use App\Modules\Subscriptions\Requests\CheckoutRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{

    public function checkout(CheckoutRequest $request)
    {
        try {

            $user = $request->user();

            // Simular pago exitoso o fallido (50/50)
            $isSuccessful = rand(0, 1) === 1;

            if ($isSuccessful) {
                // Crear o actualizar suscripción
                $subscription = Subscription::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'status' => 'active',
                        'amount' => 10.00,
                        'transaction_id' => 'tx_' . uniqid(),
                        'activated_at' => now()
                    ]
                );

                return response()->json([
                    'status' => 'success',
                    'message' => 'Suscripción activada exitosamente',
                    'subscription' => $subscription,
                    'transaction_id' => $subscription->transaction_id
                ], 200);
            } else {
                // Pago fallido
                Subscription::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'status' => 'pending',
                        'amount' => 10.00
                    ]
                );

                return response()->json([
                    'status' => 'error',
                    'message' => 'El pago fue rechazado. Por favor, intenta nuevamente.'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Checkout error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $user = $request->user();
            $subscription = $user->activeSubscription;

            return response()->json([
                'subscription' => $subscription,
                'has_active_subscription' => $user->hasActiveSubscription()
            ], 200);
        } catch (\Exception $e) {
            Log::error('Subscription show error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener la suscripción'
            ], 500);
        }
    }

    public function cancel(Request $request)
    {
        try {
            $user = $request->user();
            $subscription = $user->activeSubscription;

            if (!$subscription) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No tienes una suscripción activa'
                ], 404);
            }

            $subscription->cancel();

            return response()->json([
                'status' => 'success',
                'message' => 'Suscripción cancelada exitosamente',
                'subscription' => $subscription
            ], 200);
        } catch (\Exception $e) {
            Log::error('Subscription cancel error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Error al cancelar la suscripción'
            ], 500);
        }
    }
}
