import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getDailyEntry, saveDailyEntry, getMeals, addMeal, deleteMeal, genId, todayStr } from '@/lib/storage';
import type { DailyEntry, MealType, WorkoutType } from '@/types';
import DateSelector from '@/components/DateSelector';
import { Footprints, Moon, Droplets, Dumbbell, Utensils, Trash2, Plus, Check } from 'lucide-react';

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const workoutTypes: WorkoutType[] = ['Chest', 'Back', 'Shoulder', 'Leg'];

export default function DailyTracker() {
  const { user } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [entry, setEntry] = useState<DailyEntry>({
    steps: 0, sleepHours: 0, waterLitres: 0, workedOut: false, workoutType: '',
  });
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  // meal form
  const [mealType, setMealType] = useState<MealType>('Breakfast');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealError, setMealError] = useState('');

  const [meals, setMeals] = useState(getMeals(user?.id ?? '', date));

  useEffect(() => {
    if (!user) return;
    setEntry(getDailyEntry(user.id, date));
    setMeals(getMeals(user.id, date));
    setError('');
    setSavedMsg('');
  }, [date, user]);

  if (!user) return null;

  function updateField<K extends keyof DailyEntry>(key: K, value: DailyEntry[K]) {
    setEntry((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveDaily() {
    setError('');
    if (entry.steps < 0) { setError('Steps cannot be negative.'); return; }
    if (entry.sleepHours < 0) { setError('Sleep hours cannot be negative.'); return; }
    if (entry.waterLitres < 0) { setError('Water cannot be negative.'); return; }
    if (entry.workedOut && !entry.workoutType) { setError('Please select a workout type.'); return; }
    saveDailyEntry(user!.id, date, entry);
    setSavedMsg('Saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  function handleAddMeal() {
    setMealError('');
    if (!mealName.trim()) { setMealError('Meal name is required.'); return; }
    const cal = Number(mealCalories);
    if (!mealCalories || isNaN(cal) || cal < 0) { setMealError('Calories must be a valid non-negative number.'); return; }
    const meal = { id: genId(), type: mealType, name: mealName.trim(), calories: cal };
    addMeal(user!.id, date, meal);
    setMeals(getMeals(user!.id, date));
    setMealName('');
    setMealCalories('');
  }

  function handleDeleteMeal(id: string) {
    deleteMeal(user!.id, date, id);
    setMeals(getMeals(user!.id, date));
  }

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);

  return (
    <div className="space-y-6">
      <DateSelector date={date} onChange={setDate} />

      {error && <div className="error-msg">{error}</div>}

      {/* Steps / Sleep / Water */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="w-5 h-5 text-teal-500" />
            <h3 className="font-semibold text-gray-700">Steps</h3>
          </div>
          <input
            type="number"
            min="0"
            value={entry.steps || ''}
            onChange={(e) => updateField('steps', Math.max(0, Number(e.target.value)))}
            className="input-field"
            placeholder="0"
          />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-gray-700">Sleep (hours)</h3>
          </div>
          <input
            type="number"
            min="0"
            step="0.1"
            value={entry.sleepHours || ''}
            onChange={(e) => updateField('sleepHours', Math.max(0, Number(e.target.value)))}
            className="input-field"
            placeholder="0"
          />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-5 h-5 text-sky-500" />
            <h3 className="font-semibold text-gray-700">Water (litres)</h3>
          </div>
          <input
            type="number"
            min="0"
            step="0.1"
            value={entry.waterLitres || ''}
            onChange={(e) => updateField('waterLitres', Math.max(0, Number(e.target.value)))}
            className="input-field"
            placeholder="0"
          />
        </div>
      </div>

      {/* Workout */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-gray-700">Workout</h3>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => updateField('workedOut', true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                entry.workedOut ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => { updateField('workedOut', false); updateField('workoutType', ''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !entry.workedOut ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              No
            </button>
          </div>
          {entry.workedOut && (
            <select
              value={entry.workoutType}
              onChange={(e) => updateField('workoutType', e.target.value as WorkoutType)}
              className="input-field w-auto"
            >
              <option value="">Select type...</option>
              {workoutTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSaveDaily} className="btn-primary flex items-center gap-2">
          <Check className="w-4 h-4" />
          Save Daily Entry
        </button>
        {savedMsg && <span className="text-sm text-emerald-600 font-medium">{savedMsg}</span>}
      </div>

      {/* Meals */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-700">Meals for {date}</h3>
        </div>

        {mealError && <div className="error-msg mb-3">{mealError}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="input-field"
          >
            {mealTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="input-field sm:col-span-2"
            placeholder="Meal name"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={mealCalories}
              onChange={(e) => setMealCalories(e.target.value)}
              className="input-field"
              placeholder="kcal"
            />
            <button onClick={handleAddMeal} className="btn-primary !px-3 flex items-center gap-1 shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meal list */}
        {meals.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No meals added yet for this date.</p>
        ) : (
          <div className="space-y-2">
            {meals.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-orange-100 text-orange-600 shrink-0">{m.type}</span>
                  <span className="text-sm text-gray-700 truncate">{m.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-600">{m.calories} kcal</span>
                  <button onClick={() => handleDeleteMeal(m.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <span className="text-sm font-bold text-gray-700">Total: {totalCalories} kcal</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
