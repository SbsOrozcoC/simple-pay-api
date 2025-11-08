<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Services\AuthService;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $service;

    public function __construct(AuthService $service)
    {
        $this->service = $service;
    }

    public function register(RegisterRequest $request)
    {
        return response()->json($this->service->register($request->validated()));
    }

    public function login(LoginRequest $request)
    {
        return response()->json($this->service->login($request->validated()));
    }

    public function logout(Request $request)
    {
        return response()->json($this->service->logout($request->user()));
    }

    public function getAllUsers()
    {
        $users = User::select('id', 'name', 'email', 'created_at')->get();
        return response()->json($users);
    }
}
