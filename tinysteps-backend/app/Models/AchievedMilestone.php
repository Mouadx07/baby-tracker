<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AchievedMilestone extends Model
{
    protected $fillable = [
        'baby_id',
        'milestone_id',
        'achieved_at',
        'photo_url',
        'notes',
    ];

    protected $casts = [
        'achieved_at' => 'date',
    ];

    public function baby()
    {
        return $this->belongsTo(Baby::class);
    }
}

