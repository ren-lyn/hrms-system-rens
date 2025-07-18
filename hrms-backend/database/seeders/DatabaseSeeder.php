<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            // EmployeeProfileSeeder::class,
            // JobPostingSeeder::class,
            // ApplicantSeeder::class,
            // ApplicationSeeder::class,
            // AttendanceSeeder::class,
            // PayrollSeeder::class,
            // LeaveRequestSeeder::class,
            // EvaluationSeeder::class,
            // DisciplinaryActionSeeder::class,
            // OnboardingTaskSeeder::class,
            // ResignationFlagSeeder::class,
        ]);
    }
}
