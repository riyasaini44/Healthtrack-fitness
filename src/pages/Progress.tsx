import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { getUserData, getWeights } from '@/lib/storage';
import { TrendingUp, Footprints, Flame, Moon, Droplets, Dumbbell, Scale } from 'lucide-react';

type Period = 'week' | 'month';

export default function Progress() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('week');

  if (!user) return null;

  const data = getUserData(user.id);
  const weights = getWeights(user.id);

  const { dailyEntries, mealEntries, weightEntries } = useMemo(() => {
    const now = new Date();
    const start = new Date();
    if (period === 'week') start.setDate(now.getDate() - 6);
    else start.setMonth(now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const startStr = start.toISOString().split('T')[0];
    const endStr = now.toISOString().split('T')[0];

    const dailyEntries = Object.entries(data.daily).filter(([d]) => d >= startStr && d <= endStr);
    const mealEntries = Object.entries(data.meals).filter(([d]) => d >= startStr && d <= endStr);
    const weightEntries = weights.filter((w) => w.date >= startStr && w.date <= endStr);

    return { dailyEntries, mealEntries, weightEntries };
  }, [period, data, weights]);

  const dayCount = dailyEntries.length || 1;

  const totalSteps = dailyEntries.reduce((s, [, e]) => s + e.steps, 0);
  const totalCalories = mealEntries.reduce((s, [, ms]) => s + ms.reduce((c, m) => c + m.calories, 0), 0);
  const avgSleep = (dailyEntries.reduce((s, [, e]) => s + e.sleepHours, 0) / dayCount).toFixed(1);
  const totalWater = dailyEntries.reduce((s, [, e]) => s + e.waterLitres, 0).toFixed(1);
  const workoutDays = dailyEntries.filter(([, e]) => e.workedOut).length;

  const firstWeight = weightEntries.length > 0 ? weightEntries[0].weightKg : user.weightKg;
  const lastWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weightKg : user.weightKg;
  const weightChange = (lastWeight - firstWeight).toFixed(1);

  // progress bars (relative to common daily goals)
  const stepGoal = 10000;
  const calGoal = 2000;
  const sleepGoal = 8;
  const waterGoal = 2.5;

  const avgSteps = totalSteps / dayCount;
  const avgCal = totalCalories / dayCount;
  const avgSleepNum = Number(avgSleep);
  const avgWater = Number(totalWater) / dayCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-teal-600" />
        <h2 className="page-title">Progress</h2>
      </div>

      {/* Period toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setPeriod('week')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${period === 'week' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500'}`}
        >
          This Week
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${period === 'month' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500'}`}
        >
          This Month
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProgressCard icon={<Footprints className="w-5 h-5 text-white" />} color="bg-teal-500" label="Avg Steps" value={Math.round(avgSteps).toLocaleString()} goal={stepGoal} current={avgSteps} />
        <ProgressCard icon={<Flame className="w-5 h-5 text-white" />} color="bg-orange-500" label="Avg Calories" value={Math.round(avgCal).toString()} unit="kcal" goal={calGoal} current={avgCal} />
        <ProgressCard icon={<Moon className="w-5 h-5 text-white" />} color="bg-indigo-400" label="Avg Sleep" value={avgSleep} unit="hrs" goal={sleepGoal} current={avgSleepNum} />
        <ProgressCard icon={<Droplets className="w-5 h-5 text-white" />} color="bg-sky-500" label="Avg Water" value={avgWater.toFixed(1)} unit="L" goal={waterGoal} current={avgWater} />
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Workout Days</p>
            <p className="text-xl font-bold text-gray-800">{workoutDays}<span className="text-sm font-normal text-gray-400 ml-1">days</span></p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight Change</p>
            <p className="text-xl font-bold text-gray-800">
              {Number(weightChange) > 0 ? '+' : ''}{weightChange}<span className="text-sm font-normal text-gray-400 ml-1">kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="card">
        <h3 className="section-label mb-4">{period === 'week' ? 'Weekly' : 'Monthly'} Totals</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TotalItem label="Total Steps" value={totalSteps.toLocaleString()} />
          <TotalItem label="Total Calories" value={`${totalCalories} kcal`} />
          <TotalItem label="Total Water" value={`${totalWater} L`} />
          <TotalItem label="Days Tracked" value={dailyEntries.length.toString()} />
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ icon, color, label, value, unit, goal, current }: {
  icon: React.ReactNode; color: string; label: string; value: string; unit?: string; goal: number; current: number;
}) {
  const pct = Math.min(100, (current / goal) * 100);
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-800">{value}{unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}</p>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-1">{Math.round(pct)}% of daily goal</p>
    </div>
  );
}

function TotalItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-gray-50">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-700">{value}</p>
    </div>
  );
}
