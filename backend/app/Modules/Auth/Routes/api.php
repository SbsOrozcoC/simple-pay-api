<?php

use Illuminate\Support\Facades\Route;


Route::prefix('auth')->group(function () {
    Route::post('/register', [\App\Modules\Auth\Controllers\AuthController::class, 'register']);
    Route::post('/login', [\App\Modules\Auth\Controllers\AuthController::class, 'login']);
    Route::post('/logout', [\App\Modules\Auth\Controllers\AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/users', [\App\Modules\Auth\Controllers\AuthController::class, 'getAllUsers']);
});
