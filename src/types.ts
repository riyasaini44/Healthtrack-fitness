export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export type WorkoutType = 'Chest' | 'Back' | 'Shoulder' | 'Leg';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
}

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  calories: number;
}

export interface DailyEntry {
  steps: number;
  sleepHours: number;
  waterLitres: number;
  workedOut: boolean;
  workoutType: WorkoutType | '';
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface UserData {
  daily: Record<string, DailyEntry>; // keyed by YYYY-MM-DD
  meals: Record<string, Meal[]>; // keyed by YYYY-MM-DD
  weights: WeightEntry[];
}
