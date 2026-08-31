import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ReportCard from '../components/ReportCard';
import { useAuth } from '../hooks/useAuth';

export default function CustomerDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReportId, setExpandedReportId] = useState(null); // track expanded card
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Customers automatically get only their reports
        const res = await API.get('/reports');
        setReports(res.data.data.reports);
      } catch (e) {
        console.error('Failed to load reports:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleAdvanceStatus = async (id, nextStatus) => {
    try {
      await API.patch(`/reports/${id}/status`, { status: nextStatus });
      setReports(prev =>
        prev.map(r => (r._id === id ? { ...r, status: nextStatus } : r))
      );
    } catch (e) {
      console.error('Failed to update status:', e);
      alert('You are not authorized to update this report.');
    }
  };

  const toggleExpand = id => {
    setExpandedReportId(prev => (prev === id ? null : id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl text-gray-950 dark:text-gray-50 font-semibold mb-4">
        Your Reports
      </h2>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.length === 0 && (
            <div className="text-gray-600">No reports yet.</div>
          )}

          {reports.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              expanded={expandedReportId === report._id}
              onToggleExpand={() => toggleExpand(report._id)}
              onMarkResolved={handleAdvanceStatus} // customer can only update status
            />
          ))}
        </div>
      )}
    </div>
  );
}
