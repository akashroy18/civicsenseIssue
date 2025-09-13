import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaMoon, FaSun } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userRole = user?.user?.role || user?.role;

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved !== null ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    nav('/login');
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-md transition-colors">
      <div className="w-full flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          SudharMitra
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-6 ml-auto">
          <nav className="flex gap-6 text-sm font-medium text-gray-800 dark:text-gray-200">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
            <Link to="/report" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Report</Link>
            {user && (
              <Link
                to={userRole === 'citizen' ? '/dashboard/customer' : '/dashboard/admin'}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-lg p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>

          {/* Auth */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1 rounded border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 rounded bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Controls */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-lg p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>

          {/* Auth */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 text-sm border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
              >
                Login
              </Link>
            </>
          )}

          {/* Hamburger Toggle */}
          <button
            className="text-2xl text-gray-700 dark:text-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="sm:hidden w-full px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-800 dark:text-gray-200">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
            <Link to="/report" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400">Report</Link>
            {user && (
              <Link
                to={userRole === 'citizen' ? '/dashboard/customer' : '/dashboard/admin'}
                onClick={() => setMenuOpen(false)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Dashboard
              </Link>
            )}
            {!user && (
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
              >
                Signup
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
