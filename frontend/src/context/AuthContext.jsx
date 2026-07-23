import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const COLD_START_THRESHOLD = 3500;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wakingServer, setWakingServer] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('lifegrid_token');
    if (!token) {
      setLoading(false);
      return;
    }

    timerRef.current = setTimeout(() => setWakingServer(true), COLD_START_THRESHOLD);

    authService
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('lifegrid_token');
        localStorage.removeItem('lifegrid_user');
      })
      .finally(() => {
        clearTimeout(timerRef.current);
        setWakingServer(false);
        setLoading(false);
      });

    return () => clearTimeout(timerRef.current);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('lifegrid_token', data.token);
    localStorage.setItem('lifegrid_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const data = await authService.signup(name, email, password);
    localStorage.setItem('lifegrid_token', data.token);
    localStorage.setItem('lifegrid_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lifegrid_token');
    localStorage.removeItem('lifegrid_user');
    setUser(null);
  };

  const updateLocalUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('lifegrid_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, wakingServer, isAuthenticated: !!user, login, signup, logout, updateLocalUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};