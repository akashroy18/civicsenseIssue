import React from 'react';
import Router from './routes/Router';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Router />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
