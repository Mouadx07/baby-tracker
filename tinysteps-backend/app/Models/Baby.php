<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Baby extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'gender',
        'birth_date',
        'theme_color',
        'avatar_url',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    // Accessor to always return full URL for avatar_url
    public function getAvatarUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (strpos($value, 'http') === 0) {
            return $value;
        }
        
        // Convert relative path to full URL
        return asset('storage/' . $value);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function growthRecords()
    {
        return $this->hasMany(GrowthRecord::class);
    }
}
