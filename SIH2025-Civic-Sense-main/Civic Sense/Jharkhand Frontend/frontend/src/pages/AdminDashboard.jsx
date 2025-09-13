import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ReportCard from '../components/ReportCard';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSyncAlt, FaChartBar } from 'react-icons/fa';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    department: 'all',
  });
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/reports');
        setReports(res.data.data.reports);
        setFiltered(res.data.data.reports);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    let data = [...reports];

    if (filters.status !== 'all') {
      data = data.filter(r => r.status === filters.status);
    }
    if (filters.priority !== 'all') {
      data = data.filter(r => r.priority === filters.priority);
    }
    if (filters.category !== 'all') {
      data = data.filter(r => r.category === filters.category);
    }
    if (filters.department !== 'all') {
      data = data.filter(r => r.assignedDepartment === filters.department);
    }

    if (search.trim()) {
      data = data.filter(r =>
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOrder === 'newest') {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFiltered(data);
  }, [filters, search, sortOrder, reports]);

  const markResolved = async (id) => {
    try {
      await API.patch(`/reports/${id}/status`, { status: 'resolved' });
      setReports(reports.map((r) => (r._id === id ? { ...r, status: 'resolved' } : r)));
    } catch (e) {
      console.error(e);
    }
  };

  const assignToDept = async (id, dept) => {
    try {
      await API.patch(`/reports/${id}/status`, { assignedDepartment: dept });
      setReports(reports.map((r) => (r._id === id ? { ...r, assignedDepartment: dept } : r)));
    } catch (e) {
      console.error(e);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      category: 'all',
      department: 'all',
    });
    setSearch('');
    setSortOrder('newest');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl text-gray-950 dark:text-gray-50 font-bold mb-6">Admin Dashboard</h2>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-md shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Filter Reports</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative col-span-full md:col-span-2">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              aria-label="Search reports"
              placeholder="Search title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Dropdowns */}
          {[
            { key: 'status', label: 'Status', options: ['all', 'pending', 'resolved'] },
            { key: 'priority', label: 'Priority', options: ['all', 'low', 'medium', 'high'] },
            { key: 'category', label: 'Category', options: ['all', 'pothole', 'garbage', 'lighting'] },
            { key: 'department', label: 'Department', options: ['all', 'sanitation', 'public-works', 'electricity'] },
            { key: 'sortOrder', label: 'Sort', options: ['newest', 'oldest'] }
          ].map(({ key, label, options }) => (
            <select
              key={key}
              aria-label={label}
              value={key === 'sortOrder' ? sortOrder : filters[key]}
              onChange={(e) => key === 'sortOrder' ? setSortOrder(e.target.value) : updateFilter(key, e.target.value)}
              className="w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-between">
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md transition"
          >
            <FaSyncAlt />
            Clear Filters
          </button>

          <button
            onClick={() => navigate("/dashboard/admin/insights")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition"
          >
            <FaChartBar />
            View Insights
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 text-center">No reports found.</div>
          ) : (
            filtered.map((r) => (
              <div
                key={r._id}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded shadow hover:shadow-lg transition cursor-pointer"
                aria-label={`Report titled ${r.title}`}
              >
                <ReportCard
                  report={r}
                  onMarkResolved={markResolved}
                  onAssignDept={assignToDept}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
