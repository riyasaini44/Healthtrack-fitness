import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import type { Gender } from '@/types';
import { Activity, Mail, Lock, User as UserIcon, Ruler, Weight } from 'lucide-react';

const genders: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function AuthScreen() {
  const { signUp, login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');

  // login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // signup fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    const res = login(email.trim(), password);
    if (!res.ok) setError(res.error ?? 'Login failed.');
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!heightCm || isNaN(h) || h <= 0) {
      setError('Please enter a valid height in cm.');
      return;
    }
    if (!weightKg || isNaN(w) || w <= 0) {
      setError('Please enter a valid weight in kg.');
      return;
    }

    const res = signUp({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      gender,
      heightCm: h,
      weightKg: w,
    });
    if (!res.ok) setError(res.error ?? 'Sign up failed.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white mb-3 shadow-lg shadow-teal-200">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">HealthTrack</h1>
          <p className="text-gray-500 mt-1">Track your daily health &amp; fitness habits</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-8">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field icon={<Mail className="w-4 h-4" />} label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="you@example.com"
                />
              </Field>
              <Field icon={<Lock className="w-4 h-4" />} label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Your password"
                />
              </Field>
              <button type="submit" className="auth-btn">Login</button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <Field icon={<UserIcon className="w-4 h-4" />} label="Full Name">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="auth-input"
                  placeholder="John Doe"
                />
              </Field>
              <Field icon={<Mail className="w-4 h-4" />} label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="you@example.com"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field icon={<Lock className="w-4 h-4" />} label="Password">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    placeholder="Min 4 chars"
                  />
                </Field>
                <Field icon={<Lock className="w-4 h-4" />} label="Confirm">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    placeholder="Repeat"
                  />
                </Field>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="auth-input"
                >
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field icon={<Ruler className="w-4 h-4" />} label="Height (cm)">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="auth-input"
                    placeholder="175"
                    min="0"
                  />
                </Field>
                <Field icon={<Weight className="w-4 h-4" />} label="Weight (kg)">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="auth-input"
                    placeholder="70"
                    min="0"
                  />
                </Field>
              </div>
              <button type="submit" className="auth-btn">Create Account</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <div className="[&>input]:pl-10 [&>select]:pl-10">{children}</div>
      </div>
    </div>
  );
}
