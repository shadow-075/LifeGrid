import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { EntriesProvider } from './context/EntriesContext';

import ErrorBoundary from './components/layout/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PublicRoute from './components/layout/PublicRoute';
import AppLayout from './components/layout/AppLayout';
import PageTransition from './components/layout/PageTransition';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import EntryDetail from './pages/EntryDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import PublicProfile from './pages/PublicProfile';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <PageTransition>
                <Login />
              </PageTransition>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <PageTransition>
                <Signup />
              </PageTransition>
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/entry/:date"
            element={
              <PageTransition>
                <EntryDetail />
              </PageTransition>
            }
          />
          <Route
            path="/profile"
            element={
              <PageTransition>
                <Profile />
              </PageTransition>
            }
          />
          <Route
            path="/settings"
            element={
              <PageTransition>
                <Settings />
              </PageTransition>
            }
          />
          <Route
            path="/explore"
            element={
              <PageTransition>
                <Explore />
              </PageTransition>
            }
          />
          <Route
            path="/explore/:username"
            element={
              <PageTransition>
                <PublicProfile />
              </PageTransition>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PageTransition>
                <Leaderboard />
              </PageTransition>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <EntriesProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#12141B',
                  color: '#F5F6F8',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '14px',
                },
              }}
            />
            <AnimatedRoutes />
          </BrowserRouter>
        </EntriesProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
