<?php

namespace App\Modules\Subscriptions\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'amount',
        'transaction_id',
        'activated_at',
        'canceled_at'
    ];

    protected $casts = [
        'activated_at' => 'datetime',
        'canceled_at' => 'datetime',
        'amount' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope para suscripciones activas
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Método para activar suscripción
    public function activate($transactionId = null)
    {
        $this->update([
            'status' => 'active',
            'transaction_id' => $transactionId,
            'activated_at' => now()
        ]);
    }

    // Método para cancelar suscripción
    public function cancel()
    {
        $this->update([
            'status' => 'canceled',
            'canceled_at' => now()
        ]);
    }
}