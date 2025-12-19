<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrowthRecord extends Model
{
    protected $fillable = [
        'baby_id',
        'weight',
        'height',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'date',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
    ];

    public function baby()
    {
        return $this->belongsTo(Baby::class);
    }
}
