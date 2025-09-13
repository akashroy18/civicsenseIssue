import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [err, setErr] = useState('');
  const { saveUser } = useAuth();
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', { name, email, password, role });
      saveUser({ token: res.data.token, user: res.data.user });
      nav('/');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Signup failed');
    }
  };

  // return (
  //   <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
  //     <h2 className="text-xl font-semibold mb-4">Signup</h2>
  //     {err && <div className="text-red-600 mb-2">{err}</div>}
  //     <form onSubmit={submit} className="space-y-3">
  //       <input className="w-full p-2 border rounded" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
  //       <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
  //       <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
  //       <div>
  //         <label className="text-sm mr-2">
  //           <input type="radio" value="citizen" checked={role === 'citizen'} onChange={() => setRole('citizen')} /> Citizen
  //         </label>
  //         <label className="text-sm ml-4">
  //           <input type="radio" value="staff" checked={role === 'staff'} onChange={() => setRole('staff')} /> Staff
  //         </label>
  //         <label className="text-sm ml-4">
  //           <input type="radio" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} /> Admin
  //         </label>
  //       </div>
  //       <button className="w-full bg-indigo-600 text-white p-2 rounded">Signup</button>
  //     </form>
  //   </div>
  // );
  return (
    <div className="flex-grow flex-col flex items-center justify-center bg-gray-50 dark:bg-gray-900 min-h-[50vh]">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 dark:text-gray-50 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Signup</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400" 
          placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          
          <div className="relative" >
            <input
              className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
            </button>
          </div>

          <div className='flex gap-2 items-center mt-4'>
            <label className="text-sm mr-2">
              <input type="radio" value="citizen" checked={role === 'citizen'} onChange={() => setRole('citizen')} /> Citizen
            </label>
            <label className="text-sm ml-2">
              <input type="radio" value="staff" checked={role === 'staff'} onChange={() => setRole('staff')} /> Staff
            </label>
            <label className="text-sm ml-4">
              <input type="radio" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} /> Admin
            </label>
          </div>
          <button className="w-full bg-indigo-600 mt-4 text-white p-2 rounded hover:bg-indigo-700 active:bg-indigo-800 transition duration-150
          ">Signup</button>
        </form>
      </div>
    </div>
  );
}
