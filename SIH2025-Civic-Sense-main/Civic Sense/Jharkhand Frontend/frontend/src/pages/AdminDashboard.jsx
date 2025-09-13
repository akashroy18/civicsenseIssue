import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ReportCard from '../components/ReportCard';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
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

  // Apply filters/sorting/search
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
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Filters Card */}
      <div className="bg-white p-4 rounded-md shadow-md flex flex-wrap gap-4 mb-8 items-center dark:bg-gray-950 dark:text-gray-50">
        <input
          type="text"
          aria-label="Search reports"
          placeholder="Search title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full md:w-64 focus:outline-blue-500"
        />

        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          aria-label="Filter by priority"
          value={filters.priority}
          onChange={(e) => updateFilter('priority', e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          aria-label="Filter by category"
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Categories</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="lighting">Lighting</option>
        </select>

        <select
          aria-label="Filter by department"
          value={filters.department}
          onChange={(e) => updateFilter('department', e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Departments</option>
          <option value="sanitation">Sanitation</option>
          <option value="public-works">Public Works</option>
          <option value="electricity">Electricity</option>
        </select>

        <select
          aria-label="Sort reports"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded p-2"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded transition dark:text-gray-50 dark:bg-gray-950"
        >
          Clear Filters
        </button>
        
        <button 
          onClick={() => navigate("/dashboard/admin/insights")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          View Insights
        </button>
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
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.length === 0 && (
            <div className="text-gray-600 text-center">No reports found.</div>
          )}
          {filtered.map((r) => (
            <div
              key={r._id}
              className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer"
              aria-label={`Report titled ${r.title}`}
            >
              <ReportCard
                report={r}
                onMarkResolved={markResolved}
                onAssignDept={assignToDept}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}