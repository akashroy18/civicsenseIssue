import React from 'react';
import Router from './routes/Router';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Toast container (works everywhere in the app) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px',
            },
          }}
        />

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 container mx-auto px-4 py-6">
          <Router />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}