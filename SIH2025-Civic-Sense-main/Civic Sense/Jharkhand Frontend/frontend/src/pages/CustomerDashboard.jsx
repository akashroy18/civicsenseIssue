import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ReportCard from '../components/ReportCard';

export default function CustomerDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/reports');
        setReports(res.data.data.reports);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const markResolved = async (id) => {
    try {
      await API.patch(`/reports/${id}/status`, { status: 'resolved' });
      setReports(reports.map((r) => (r._id === id ? { ...r, status: 'resolved' } : r)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Reports</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {reports.length === 0 && <div className="text-gray-600">No reports yet.</div>}
          {reports.map((r) => (
            <ReportCard key={r._id} report={r} onMarkResolved={markResolved} />
          ))}
        </div>
      )}
    </div>
  );
}
