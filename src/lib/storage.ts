import type { User, UserData, DailyEntry, Meal, WeightEntry } from '@/types';

const USERS_KEY = 'healthtrack_users';
const SESSION_KEY = 'healthtrack_session';
const DATA_KEY = (userId: string) => `healthtrack_data_${userId}`;

export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSession(userId: string | null): void {
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
}

export function getUserData(userId: string): UserData {
  const raw = localStorage.getItem(DATA_KEY(userId));
  return raw ? JSON.parse(raw) : { daily: {}, meals: {}, weights: [] };
}

export function saveUserData(userId: string, data: UserData): void {
  localStorage.setItem(DATA_KEY(userId), JSON.stringify(data));
}

export function getDailyEntry(userId: string, date: string): DailyEntry {
  const data = getUserData(userId);
  return (
    data.daily[date] ?? {
      steps: 0,
      sleepHours: 0,
      waterLitres: 0,
      workedOut: false,
      workoutType: '',
    }
  );
}

export function saveDailyEntry(userId: string, date: string, entry: DailyEntry): void {
  const data = getUserData(userId);
  data.daily[date] = entry;
  saveUserData(userId, data);
}

export function getMeals(userId: string, date: string): Meal[] {
  const data = getUserData(userId);
  return data.meals[date] ?? [];
}

export function addMeal(userId: string, date: string, meal: Meal): void {
  const data = getUserData(userId);
  if (!data.meals[date]) data.meals[date] = [];
  data.meals[date].push(meal);
  saveUserData(userId, data);
}

export function deleteMeal(userId: string, date: string, mealId: string): void {
  const data = getUserData(userId);
  if (data.meals[date]) {
    data.meals[date] = data.meals[date].filter((m) => m.id !== mealId);
    saveUserData(userId, data);
  }
}

export function getWeights(userId: string): WeightEntry[] {
  const data = getUserData(userId);
  return data.weights;
}

export function addWeight(userId: string, entry: WeightEntry): void {
  const data = getUserData(userId);
  data.weights.push(entry);
  data.weights.sort((a, b) => a.date.localeCompare(b.date));
  saveUserData(userId, data);
}

export function deleteWeight(userId: string, entryId: string): void {
  const data = getUserData(userId);
  data.weights = data.weights.filter((w) => w.id !== entryId);
  saveUserData(userId, data);
}

export function updateUser(updatedUser: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === updatedUser.id);
  if (idx >= 0) {
    users[idx] = updatedUser;
    saveUsers(users);
  }
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayStr(): string {
  return formatDate(new Date());
}
