import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { getDailyEntry, getMeals, getUserData } from '@/lib/storage';
import { todayStr } from '@/lib/storage';
import DateSelector from '@/components/DateSelector';
import StatCard from '@/components/StatCard';
import { Footprints, Flame, Moon, Droplets, Dumbbell, User as UserIcon, Ruler, Weight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [date, setDate] = useState(todayStr());

  if (!user) return null;

  const entry = getDailyEntry(user.id, date);
  const meals = getMeals(user.id, date);
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  // monthly summary
  const monthPrefix = date.slice(0, 7);
  const data = getUserData(user.id);
  const monthEntries = Object.entries(data.daily).filter(([d]) => d.startsWith(monthPrefix));
  const monthMeals = Object.entries(data.meals).filter(([d]) => d.startsWith(monthPrefix));

  const monthly = useMemo(() => {
    const totalSteps = monthEntries.reduce((s, [, e]) => s + e.steps, 0);
    const totalCal = monthMeals.reduce((s, [, ms]) => s + ms.reduce((c, m) => c + m.calories, 0), 0);
    const totalSleep = monthEntries.reduce((s, [, e]) => s + e.sleepHours, 0);
    const totalWater = monthEntries.reduce((s, [, e]) => s + e.waterLitres, 0);
    const workoutDays = monthEntries.filter(([, e]) => e.workedOut).length;
    const dayCount = monthEntries.length || 1;
    return {
      totalSteps,
      avgSteps: Math.round(totalSteps / dayCount),
      totalCal,
      avgSleep: (totalSleep / dayCount).toFixed(1),
      totalWater: totalWater.toFixed(1),
      workoutDays,
    };
  }, [date]);

  const monthLabel = new Date(date + 'T00:00:00').toLocaleDateString('en', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* User info banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-200/50">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="w-5 h-5" />
          <h2 className="text-xl font-bold">{user.fullName}</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white/15 rounded-lg px-3 py-2">
            <p className="text-white/70 text-xs">Gender</p>
            <p className="font-semibold">{user.gender}</p>
          </div>
          <div className="bg-white/15 rounded-lg px-3 py-2">
            <p className="text-white/70 text-xs">Height</p>
            <p className="font-semibold">{user.heightCm} cm</p>
          </div>
          <div className="bg-white/15 rounded-lg px-3 py-2">
            <p className="text-white/70 text-xs">Weight</p>
            <p className="font-semibold">{user.weightKg} kg</p>
          </div>
        </div>
      </div>

      <DateSelector date={date} onChange={setDate} />

      {/* Daily summary cards */}
      <div>
        <h3 className="section-label mb-3">Daily Summary — {date}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={<Footprints className="w-6 h-6 text-white" />} label="Steps" value={entry.steps.toLocaleString()} color="bg-teal-500" />
          <StatCard icon={<Flame className="w-6 h-6 text-white" />} label="Calories" value={totalCalories} unit="kcal" color="bg-orange-500" />
          <StatCard icon={<Moon className="w-6 h-6 text-white" />} label="Sleep" value={entry.sleepHours} unit="hrs" color="bg-indigo-400" />
          <StatCard icon={<Droplets className="w-6 h-6 text-white" />} label="Water" value={entry.waterLitres} unit="L" color="bg-sky-500" />
          <StatCard
            icon={<Dumbbell className="w-6 h-6 text-white" />}
            label="Workout"
            value={entry.workedOut ? entry.workoutType || 'Yes' : 'No'}
            color="bg-emerald-500"
          />
          <StatCard icon={<Ruler className="w-6 h-6 text-white" />} label="Height" value={user.heightCm} unit="cm" color="bg-gray-400" />
        </div>
      </div>

      {/* Monthly summary */}
      <div>
        <h3 className="section-label mb-3">Monthly Summary — {monthLabel}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500">Total Steps</p>
            <p className="text-2xl font-bold text-gray-800">{monthly.totalSteps.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Avg {monthly.avgSteps.toLocaleString()}/day</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Total Calories</p>
            <p className="text-2xl font-bold text-gray-800">{monthly.totalCal}</p>
            <p className="text-xs text-gray-400 mt-1">kcal this month</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Average Sleep</p>
            <p className="text-2xl font-bold text-gray-800">{monthly.avgSleep}</p>
            <p className="text-xs text-gray-400 mt-1">hrs per night</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Total Water</p>
            <p className="text-2xl font-bold text-gray-800">{monthly.totalWater}</p>
            <p className="text-xs text-gray-400 mt-1">litres this month</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Workout Days</p>
            <p className="text-2xl font-bold text-gray-800">{monthly.workoutDays}</p>
            <p className="text-xs text-gray-400 mt-1">days exercised</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Current Weight</p>
            <p className="text-2xl font-bold text-gray-800">{user.weightKg}</p>
            <p className="text-xs text-gray-400 mt-1">kg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
