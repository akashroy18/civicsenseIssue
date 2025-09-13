import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid
} from "recharts";

const COLORS = ["#4F46E5", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899"];

export default function AdminInsights() {
  const [data, setData] = useState({ byCategory: [], byLocation: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await API.get("/insights");
        setData(res.data.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch insights:", err);
        setError(err?.response?.data?.message || "Could not load insights. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading insights"
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
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white"> Reports Insights</h2>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Total Reports</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {data.byCategory.reduce((total, item) => total + item.count, 0)}
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Unique Locations</h3>
          <p className="text-3xl font-bold text-indigo-600">{data.byLocation.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reports by Category - Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Reports by Category</h3>
          {data.byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.byCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ category, count }) => `${category}: ${count}`}
                  labelLine={false}
                >
                  {data.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} reports`, props.payload.category]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-12">No category data available</div>
          )}
        </div>

        {/* Reports by Location - Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Reports by Location</h3>
          {data.byLocation.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byLocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="location" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} reports`, 'Count']}
                  labelFormatter={(label) => `Location: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="#4F46E5" 
                  name="Number of Reports"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-12">No location data available</div>
          )}
        </div>
      </div>

      {/* Data Tables for detailed view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-gray-50 text-gray-950 dark:text-gray-300  p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                {data.byCategory.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="px-4 py-2 capitalize">{item.category}</td>
                    <td className="px-4 py-2">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white text-gray-950 dark:text-gray-300 p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Location Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                {data.byLocation.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="px-4 py-2">{item.location}</td>
                    <td className="px-4 py-2">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}