<?php

namespace Database\Seeders;

use App\Models\Baby;
use App\Models\GrowthRecord;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class GrowthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the baby named "Adam"
        $baby = Baby::where('name', 'Adam')->first();

        if (!$baby) {
            $this->command->warn('No baby named "Adam" found in database. Please create Adam profile first.');
            return;
        }

        $this->command->info("Generating growth data for: {$baby->name}");

        // Check if growth records already exist
        if (GrowthRecord::where('baby_id', $baby->id)->exists()) {
            $this->command->warn('Growth records already exist for this baby. Skipping...');
            return;
        }

        // Get baby's birth date
        $birthDate = Carbon::parse($baby->birth_date);
        
        // Generate 12 records over 6 months (one every 2 weeks)
        $records = [];
        $startDate = $birthDate->copy()->addDays(7); // Start 1 week after birth
        $currentDate = $startDate->copy();
        
        // Initial values
        $currentWeight = 3.5; // Starting weight in kg
        $currentHeight = 50.0; // Starting height in cm
        
        for ($i = 0; $i < 12; $i++) {
            // Add randomness to weight gain (0.15kg - 0.25kg per week, but we're doing 2 weeks)
            $weightGain = (0.15 + (rand(0, 10) / 100)) * 2; // 0.30 - 0.50 kg per 2 weeks
            $currentWeight += $weightGain;
            
            // Add randomness to height gain (0.5cm - 1cm per week, but we're doing 2 weeks)
            $heightGain = (0.5 + (rand(0, 5) / 10)) * 2; // 1.0 - 2.0 cm per 2 weeks
            $currentHeight += $heightGain;
            
            // Add some natural variation (±5% randomness)
            $weightVariation = $currentWeight * (rand(-5, 5) / 100);
            $heightVariation = $currentHeight * (rand(-2, 2) / 100);
            
            $finalWeight = round($currentWeight + $weightVariation, 2);
            $finalHeight = round($currentHeight + $heightVariation, 1);
            
            $records[] = [
                'baby_id' => $baby->id,
                'weight' => $finalWeight,
                'height' => $finalHeight,
                'recorded_at' => $currentDate->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            // Move to next record (2 weeks later)
            $currentDate->addWeeks(2);
        }
        
        // Insert all records
        GrowthRecord::insert($records);
        
        $this->command->info("Successfully created " . count($records) . " growth records!");
        $this->command->info("Date range: {$startDate->format('Y-m-d')} to {$currentDate->copy()->subWeeks(2)->format('Y-m-d')}");
    }
}

