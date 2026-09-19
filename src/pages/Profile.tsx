import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import type { Gender } from '@/types';
import { User as UserIcon, Mail, Ruler, Weight, Save } from 'lucide-react';

const genders: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [gender, setGender] = useState<Gender>(user?.gender ?? 'Male');
  const [heightCm, setHeightCm] = useState(String(user?.heightCm ?? ''));
  const [weightKg, setWeightKg] = useState(String(user?.weightKg ?? ''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return null;

  function handleSave() {
    setError('');
    setSuccess('');
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!heightCm || isNaN(h) || h <= 0) { setError('Height must be a valid positive number.'); return; }
    if (!weightKg || isNaN(w) || w <= 0) { setError('Weight must be a valid positive number.'); return; }

    const updated = {
      ...user!,
      fullName: fullName.trim(),
      email: email.trim(),
      gender,
      heightCm: h,
      weightKg: w,
    };
    updateUser(updated);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 2500);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <UserIcon className="w-6 h-6 text-teal-600" />
        <h2 className="page-title">Profile</h2>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">{success}</div>}

      <div className="card space-y-5">
        <div>
          <label className="section-label mb-1.5 block">Full Name</label>
          <div className="relative">
            <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="section-label mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="section-label mb-1.5 block">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="input-field">
            {genders.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="section-label mb-1.5 block">Height (cm)</label>
            <div className="relative">
              <Ruler className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" min="0" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="section-label mb-1.5 block">Weight (kg)</label>
            <div className="relative">
              <Weight className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" min="0" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="input-field pl-10" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary flex items-center gap-2 w-fit">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
