import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import AuthScreen from '@/components/AuthScreen';
import NavBar, { type Page } from '@/components/NavBar';
import Dashboard from '@/pages/Dashboard';
import DailyTracker from '@/pages/DailyTracker';
import Progress from '@/pages/Progress';
import WeightHistory from '@/pages/WeightHistory';
import Profile from '@/pages/Profile';

function AppContent() {
  const { user } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');

  if (!user) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar page={page} setPage={setPage} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {page === 'dashboard' && <Dashboard />}
        {page === 'tracker' && <DailyTracker />}
        {page === 'progress' && <Progress />}
        {page === 'weight' && <WeightHistory />}
        {page === 'profile' && <Profile />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
