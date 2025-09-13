import React from 'react';
import MapPreview from './MapPreview';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  critical: 'bg-red-600 text-white',
};

const statusColors = {
  pending: 'bg-yellow-200 text-yellow-900',
  acknowledged: 'bg-blue-200 text-blue-900',
  'in-progress': 'bg-indigo-200 text-indigo-900',
  resolved: 'bg-green-200 text-green-900',
};

export default function ReportCard({
  report,
  expanded,
  onToggleExpand,
  onUpdateStatus,
  onAssignDept
}) {
  const { user } = useAuth();
  const userRole = user?.user?.role || user?.role;
  const isAdmin = userRole === 'admin';

  return (
    <article className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4">
      
      {/* Thumbnail */}
      <div className="w-full md:w-1/6 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
        {report.imageUrl ? (
          <img
            src={report.imageUrl}
            alt={report.title || 'Report Image'}
            className="w-full h-24 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-24 flex items-center justify-center text-gray-400 text-sm">No photo</div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Header */}
        <div className="flex justify-between items-start md:items-center">
          <h3 className="text-lg font-semibold truncate">{report.title}</h3>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[report.priority] || 'bg-gray-100 text-gray-600'}`}>
              {report.priority || 'Unknown'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[report.status] || 'bg-gray-100 text-gray-600'}`}>
              {report.status || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Reporter info */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Reported by <span className="font-medium">{report.reporter?.name || 'Anonymous'}</span> • {formatDate(report.createdAt)}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
            >
              {expanded ? 'View Less' : 'View More'}
            </button>
          )}
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-2 flex flex-col gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{report.description || 'No description provided.'}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Category:</strong> {report.category || 'N/A'}
            </div>
            {report.location?.coordinates && (
              <MapPreview
                lat={report.location.coordinates[1]}
                lng={report.location.coordinates[0]}
                address={report.location?.address}
              />
            )}

            {/* Admin Only Actions */}
            {isAdmin && (
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm mb-1">Update Status:</label>
                  <select
                    value={report.status}
                    onChange={e => onUpdateStatus(report._id, e.target.value)}
                    className="border p-2 w-full text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm mb-1">Assign Department:</label>
                  <select
                    value={report.assignedDepartment || ''}
                    onChange={e => onAssignDept(report._id, e.target.value)}
                    className="border p-2 w-full text-sm"
                  >
                    <option value="">Select Department</option>
                    <option value="sanitation">Sanitation</option>
                    <option value="public-works">Public Works</option>
                    <option value="electricity">Electricity</option>
                    <option value="water">Water Department</option>
                    <option value="transportation">Transportation</option>
                    <option value="parks">Parks & Recreation</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
