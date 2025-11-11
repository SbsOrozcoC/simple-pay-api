<?php

namespace App\Modules\Auth\Models;

use App\Modules\Subscriptions\Models\Subscription;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 
        'email', 
        'password',
        'is_premium',
        'subscription_status',
        'stripe_customer_id',
        'stripe_subscription_id',
        'subscription_ends_at'
    ];

    protected $hidden = ['password', 'remember_token'];
    
    protected $casts = [
        'is_premium' => 'boolean',
        'subscription_ends_at' => 'datetime'
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)->active()->latest();
    }

    public function hasActiveSubscription()
    {
        return $this->activeSubscription()->exists();
    }
}