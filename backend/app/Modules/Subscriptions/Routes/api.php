<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Subscriptions\Controllers\SubscriptionController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/checkout', [SubscriptionController::class, 'checkout']);
    Route::get('/subscription', [SubscriptionController::class, 'show']);
    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel']);
});