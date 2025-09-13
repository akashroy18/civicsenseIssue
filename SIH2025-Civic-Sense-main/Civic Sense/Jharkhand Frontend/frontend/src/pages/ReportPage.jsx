import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ReportPage() {
  const navigate = useNavigate();

  // form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [priority, setPriority] = useState('low');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // validation error states
  const [errors, setErrors] = useState({});

  // Get user role
  const userRole = localStorage.getItem('role') || 'customer'; // fallback

  // location fetch
  const getLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => alert('Could not get location')
    );
  };

  // validation
  const validateForm = () => {
    let newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (lat && isNaN(lat)) {
      newErrors.lat = 'Invalid coordinates';
    }
    if (lng && isNaN(lng)) {
      newErrors.lng = 'Invalid coordinates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit handler
  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('priority', priority);
      form.append('address', address);
      form.append('lat', lat);
      form.append('lng', lng);
      if (file) form.append('image', file);

      await API.post('/reports', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('✅ Report submitted successfully!');

      // Clear form
      setTitle('');
      setDescription('');
      setCategory('pothole');
      setPriority('low');
      setAddress('');
      setLat('');
      setLng('');
      setFile(null);
      setFileName('No file chosen');
      setPreview(null);
      setErrors({});

      // redirect after short delay
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/customer');
        }
      }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || '❌ Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-gray-950 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Create a Report</h2>

      <form onSubmit={submit} className="space-y-4">
        {/* title */}
        <div>
          <input
            className={`w-full p-3 border rounded-md ${
              errors.title ? 'border-red-500' : ''
            }`}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* description */}
        <textarea
          className="w-full p-3 border rounded-md"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* category & priority */}
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border rounded-md w-1/2 dark:bg-gray-800 dark:text-gray-50"
          >
            <option value="pothole">Pothole</option>
            <option value="streetlight">Streetlight</option>
            <option value="garbage">Garbage</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="other">Other</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 border rounded-md w-1/2 dark:bg-gray-800 dark:text-gray-50"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* address + location */}
        <div className="flex gap-3">
          <input
            className="flex-1 p-3 border rounded-md"
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="button"
            onClick={getLocation}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Use my location
          </button>
        </div>

        {/* lat/lng */}
        <div className="flex gap-3">
          <div className="w-1/2">
            <input
              className={`w-full p-3 border rounded-md ${
                errors.lat ? 'border-red-500' : ''
              }`}
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            {errors.lat && (
              <p className="text-red-500 text-sm mt-1">{errors.lat}</p>
            )}
          </div>

          <div className="w-1/2">
            <input
              className={`w-full p-3 border rounded-md ${
                errors.lng ? 'border-red-500' : ''
              }`}
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            {errors.lng && (
              <p className="text-red-500 text-sm mt-1">{errors.lng}</p>
            )}
          </div>
        </div>

        {/* file upload */}
        <div>
          <label className="block text-sm mb-1 font-medium">Upload photo</label>
          <div className="flex items-center gap-4">
            <label className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700 transition-all">
              Select File
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (!selectedFile) return;

                  if (!selectedFile.type.startsWith('image/')) {
                    alert('Only image files are allowed.');
                    e.target.value = '';
                    setFile(null);
                    setFileName('No file chosen');
                    setPreview(null);
                    return;
                  }
                  if (selectedFile.size > 5 * 1024 * 1024) {
                    alert('Image size should not exceed 5MB.');
                    e.target.value = '';
                    setFile(null);
                    setFileName('No file chosen');
                    setPreview(null);
                    return;
                  }
                  setFile(selectedFile);
                  setFileName(selectedFile.name);

                  const reader = new FileReader();
                  reader.onloadend = () => setPreview(reader.result);
                  reader.readAsDataURL(selectedFile);
                }}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-600 truncate max-w-xs">{fileName}</span>
          </div>

          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs h-auto border rounded shadow"
              />
            </div>
          )}
        </div>

        {/* submit */}
        <button
          type="submit"
          className={`w-full py-3 text-white rounded-md ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } transition-all`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}