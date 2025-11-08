<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'API OK']);
});

// Cargar rutas del módulo Auth
require app_path('Modules/Auth/Routes/api.php');
