<?php

namespace App\Modules\Subscriptions\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Subscriptions\Models\Subscription;
use App\Modules\Auth\Models\User;
use App\Modules\Subscriptions\Requests\CheckoutRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;

class SubscriptionController extends Controller
{
    public function checkout(CheckoutRequest $request)
    {
        try {
            $user = $request->user();

            $isSuccessful = rand(0, 1) === 1;

            if ($isSuccessful) {
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

    public function createCheckoutSession(Request $request): JsonResponse
    {
        try {
            $stripeSecret = env('STRIPE_SECRET');
            if (!$stripeSecret) {
                throw new Exception('STRIPE_SECRET no esta configurada en .env');
            }

            $stripe = new \Stripe\StripeClient($stripeSecret);
            $user = $request->user();

            //VERIFICAR SI YA TIENE UN CUSTOMER ID Y USARLO
            if (!$user->stripe_customer_id) {
                $customer = $stripe->customers->create([
                    'email' => $user->email,
                    'name' => $user->name,
                    'metadata' => [
                        'user_id' => $user->id
                    ]
                ]);

                //GUARDAR INMEDIATAMENTE EL CUSTOMER ID
                $user->stripe_customer_id = $customer->id;
                $user->save();
            } else {
                $customer = $stripe->customers->retrieve($user->stripe_customer_id);
            }

            $session = $stripe->checkout->sessions->create([
                'customer' => $user->stripe_customer_id, //USAR EL ID GUARDADO
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Suscripción Premium',
                            'description' => 'Suscripción mensual premium',
                        ],
                        'unit_amount' => 1000,
                        'recurring' => [
                            'interval' => 'month',
                        ],
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => 'http://localhost:8000/api/subscription/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:5173/subscription?subscription=cancelled',
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            //LOG PARA DEBUG
            \Log::info('Checkout session created', [
                'user_id' => $user->id,
                'stripe_customer_id' => $user->stripe_customer_id,
                'session_id' => $session->id
            ]);

            return response()->json([
                'sessionId' => $session->id,
                'url' => $session->url
            ]);
        } catch (Exception $e) {
            Log::error('Stripe session error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error creating checkout session: ' . $e->getMessage()
            ], 500);
        }
    }

    public function success(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');

            \Log::info('=== SUBSCRIPTION SUCCESS START ===');
            \Log::info('Session ID received: ' . $sessionId);

            if (!$sessionId) {
                return redirect('http://localhost:5173/dashboard?subscription=error&message=missing_session_id');
            }

            $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));

            $session = $stripe->checkout->sessions->retrieve($sessionId);

            \Log::info('Session retrieved successfully', [
                'session_id' => $session->id,
                'customer' => $session->customer,
                'payment_status' => $session->payment_status,
                'subscription_id' => $session->subscription
            ]);

            if ($session->payment_status === 'paid' && $session->subscription) {
                $user = User::where('stripe_customer_id', $session->customer)->first();

                if (!$user) {
                    \Log::error('User not found with stripe_customer_id: ' . $session->customer);
                    return redirect('http://localhost:5173/dashboard?subscription=error&message=user_not_found');
                }

                \Log::info('User found for subscription', [
                    'user_id' => $user->id,
                    'stripe_customer_id' => $user->stripe_customer_id
                ]);

                $subscriptionId = $session->subscription;
                $stripeSubscription = $stripe->subscriptions->retrieve($subscriptionId);

                \Log::info('Stripe subscription retrieved', [
                    'subscription_id' => $stripeSubscription->id,
                    'status' => $stripeSubscription->status,
                    'current_period_end' => $stripeSubscription->current_period_end
                ]);

                $user->update([
                    'is_premium' => true,
                    'subscription_status' => 'active',
                    'stripe_subscription_id' => $subscriptionId,
                    'subscription_ends_at' => date('Y-m-d H:i:s', $stripeSubscription->current_period_end)
                ]);

                Subscription::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'status' => 'active',
                        'amount' => 10.00,
                        'transaction_id' => $session->id,
                        'stripe_subscription_id' => $subscriptionId,
                        'activated_at' => now()
                    ]
                );

                \Log::info('User subscription updated successfully', [
                    'user_id' => $user->id,
                    'is_premium' => $user->is_premium,
                    'subscription_status' => $user->subscription_status
                ]);

                return redirect('http://localhost:5173/dashboard?subscription=success');
            }

            \Log::error('Payment not successful', [
                'payment_status' => $session->payment_status,
                'has_subscription' => !is_null($session->subscription)
            ]);

            return redirect('http://localhost:5173/dashboard?subscription=error&message=payment_failed');
        } catch (Exception $e) {
            \Log::error('Subscription success error: ' . $e->getMessage());
            \Log::error('Error trace: ' . $e->getTraceAsString());
            return redirect('http://localhost:5173/dashboard?subscription=error&message=server_error');
        }
    }

    public function show(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $subscription = $user->activeSubscription;

            return response()->json([
                'is_premium' => $user->is_premium,
                'subscription_status' => $user->subscription_status,
                'subscription_ends_at' => $user->subscription_ends_at,
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

    public function cancel(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->stripe_subscription_id) {
                $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
                $subscription = $stripe->subscriptions->retrieve($user->stripe_subscription_id);
                $subscription->cancel();
            }

            $user->update([
                'is_premium' => false,
                'subscription_status' => 'canceled',
                'stripe_subscription_id' => null
            ]);

            $activeSubscription = $user->activeSubscription;
            if ($activeSubscription) {
                $activeSubscription->update(['status' => 'canceled']);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Suscripción cancelada exitosamente',
                'is_premium' => false
            ], 200);
        } catch (\Exception $e) {
            Log::error('Subscription cancel error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al cancelar la suscripción'
            ], 500);
        }
    }

    public function handleWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                env('STRIPE_WEBHOOK_SECRET')
            );
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Stripe webhook signature invalid: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                $subscription = $event->data->object;
                Log::info('Subscription updated: ' . $subscription->id);
                break;

            case 'customer.subscription.deleted':
                $subscription = $event->data->object;
                Log::info('Subscription canceled: ' . $subscription->id);
                break;
        }

        return response()->json(['status' => 'success']);
    }
}
