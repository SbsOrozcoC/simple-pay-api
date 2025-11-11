<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'API OK']);
});

Route::get('/subscription/success', [App\Modules\Subscriptions\Controllers\SubscriptionController::class, 'success']);

// Cargar rutas del módulo Auth
require app_path('Modules/Auth/Routes/api.php');
require app_path('Modules/Subscriptions/Routes/api.php');

// Otras rutas Stripe
Route::middleware('auth:sanctum')->post('/stripe/create-checkout-session', [App\Modules\Subscriptions\Controllers\SubscriptionController::class, 'createCheckoutSession']);
Route::post('/stripe/webhook', [App\Modules\Subscriptions\Controllers\SubscriptionController::class, 'handleWebhook']);
