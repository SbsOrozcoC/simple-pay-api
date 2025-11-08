<?php

namespace App\Modules\Subscriptions\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;

class CheckoutRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // No necesita reglas de validación adicionales
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = $this->user();
            
            if ($user && $user->hasActiveSubscription()) {
                $validator->errors()->add(
                    'subscription', 
                    'Ya tienes una suscripción activa. No puedes suscribirte nuevamente.'
                );
            }
        });
    }
}