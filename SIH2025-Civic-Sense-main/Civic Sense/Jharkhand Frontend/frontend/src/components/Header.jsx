import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const userRole = user?.user?.role || user?.role || (user && user.user && user.user.role);

  // Dark mode state: initialize from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow dark:shadow-lg transition-colors">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Branding */}
        <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
          <span>🛠️</span> SudharMitra
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm text-gray-800 dark:text-gray-200">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
          <Link to="/report" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Report</Link>
          {/* <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link> */}

          {user ? (
            <>
              <Link
                to={userRole === 'citizen' ? '/dashboard/customer' : '/dashboard/admin'}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  nav('/login');
                }}
                className="ml-2 px-4 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="ml-2 px-4 py-1 rounded text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="ml-2 px-4 py-1 rounded bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                Signup
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="ml-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Toggle Dark Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
