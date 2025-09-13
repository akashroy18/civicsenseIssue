import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { saveUser } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      // The backend returns { status, token, user }
      saveUser({ token: res.data.token, user: res.data.user });
      const role = res.data.user.role;
      nav(role === 'citizen' ? '/dashboard/customer' : '/dashboard/admin');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md bg-gray-50 text-gray-950 dark:text-gray-50 dark:bg-gray-800 mx-auto p-6  rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white p-2 rounded">Login</button>
      </form>
      <div className="text-sm text-gray-500 mt-3">
        Or <a href="/signup" className="text-indigo-600">create account</a>
      </div>
    </div>
  );
}
