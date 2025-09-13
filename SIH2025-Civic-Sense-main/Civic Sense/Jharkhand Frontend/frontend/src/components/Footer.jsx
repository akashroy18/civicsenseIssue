import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
        
        {/* Brand & Tagline */}
        <div>
          <h2 className="text-lg font-bold text-indigo-600">SudharMitra</h2>
          <p className="mt-2 dark:text-gray-50">Empowering citizens through smart reporting.</p>
        </div>

        {/* Quick Links */}
        <div className="dark:text-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2 dark:text-gray-50">Quick Links</h3>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
            <li><Link to="/report" className="hover:text-indigo-600">Report a Problem</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
            <li><Link to="/login" className="hover:text-indigo-600">Login</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className=" text-gray-950 dark:text-gray-50"> 
          <h3 className="font-semibold text-gray-800 mb-2 dark:text-gray-50">Contact</h3>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            <li>Email: support@maalikcivic.com</li>
            <li>Phone: +123 456 7890</li>
            <li className="flex gap-3 mt-2">
              {/* Placeholder for icons */}
              <a href="#" className="hover:text-indigo-600">Facebook</a>
              <a href="#" className="hover:text-indigo-600">Twitter</a>
              <a href="#" className="hover:text-indigo-600">Instagram</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t mt-6 py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} SudharMitra. All rights reserved.
      </div>
    </footer>
  );
}
