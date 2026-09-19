import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, Gender } from '@/types';
import { getUsers, saveUsers, getSession, setSession, genId } from '@/lib/storage';

interface AuthContextValue {
  user: User | null;
  signUp: (data: {
    fullName: string;
    email: string;
    password: string;
    gender: Gender;
    heightCm: number;
    weightKg: number;
  }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const sessionId = getSession();
    if (!sessionId) return null;
    return getUsers().find((u) => u.id === sessionId) ?? null;
  });

  const signUp = useCallback(
    (data: {
      fullName: string;
      email: string;
      password: string;
      gender: Gender;
      heightCm: number;
      weightKg: number;
    }) => {
      const users = getUsers();
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { ok: false, error: 'An account with this email already exists.' };
      }
      const newUser: User = {
        id: genId(),
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        gender: data.gender,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
      };
      users.push(newUser);
      saveUsers(users);
      setSession(newUser.id);
      setUser(newUser);
      return { ok: true };
    },
    []
  );

  const login = useCallback((email: string, password: string) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    setSession(found.id);
    setUser(found);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated: User) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx >= 0) {
      users[idx] = updated;
      saveUsers(users);
    }
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
