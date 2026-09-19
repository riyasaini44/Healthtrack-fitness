import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getWeights, addWeight, deleteWeight, genId, todayStr, updateUser } from '@/lib/storage';
import { Scale, Trash2, Plus } from 'lucide-react';

export default function WeightHistory() {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [weights, setWeights] = useState(user ? getWeights(user.id) : []);

  if (!user) return null;

  function handleAdd() {
    setError('');
    if (!date) { setError('Please select a date.'); return; }
    const w = Number(weight);
    if (!weight || isNaN(w) || w <= 0) { setError('Weight must be a valid positive number.'); return; }
    const entry = { id: genId(), date, weightKg: w };
    addWeight(user!.id, entry);
    // update current weight on profile
    const updated = { ...user!, weightKg: w };
    updateUser(updated);
    updateAuthUser(updated);
    setWeights(getWeights(user!.id));
    setWeight('');
  }

  function handleDelete(id: string) {
    deleteWeight(user!.id, id);
    setWeights(getWeights(user!.id));
  }

  const sorted = [...weights].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Scale className="w-6 h-6 text-teal-600" />
        <h2 className="page-title">Weight History</h2>
      </div>

      {/* Add entry */}
      <div className="card">
        <h3 className="section-label mb-4">Add Weight Entry</h3>
        {error && <div className="error-msg mb-3">{error}</div>}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="section-label mb-1.5 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayStr()}
              className="input-field"
            />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Weight (kg)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input-field"
              placeholder="70"
            />
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* History list */}
      <div className="card">
        <h3 className="section-label mb-4">Previous Entries</h3>
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No weight entries yet.</p>
        ) : (
          <div className="space-y-2">
            {sorted.map((w) => (
              <div key={w.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{w.weightKg} kg</p>
                    <p className="text-xs text-gray-400">{new Date(w.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(w.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
