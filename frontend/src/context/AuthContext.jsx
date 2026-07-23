import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing token

  // Auto-login: if a token is already sitting in localStorage, verify it and
  // load the user straight away instead of showing the login page.
  useEffect(() => {
    const token = localStorage.getItem('lifegrid_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('lifegrid_token');
        localStorage.removeItem('lifegrid_user');
      })
      .finally(() => setLoading(false));
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

  // Lets pages patch the cached user after a profile update, without a refetch
  const updateLocalUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('lifegrid_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, signup, logout, updateLocalUser }}
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
