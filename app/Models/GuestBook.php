<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestBook extends Model
{
    use HasFactory;
    //
    protected $fillable = [
        'guest_name',
        'visit_date',
        'check_in_time',
        'check_out_time',
        'company',
        'purpose',
        'identity_number',
        'receptionist_name',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
