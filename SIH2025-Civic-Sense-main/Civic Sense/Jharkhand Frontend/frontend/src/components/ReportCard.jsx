import React from 'react';
import MapPreview from './MapPreview';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  pending: 'bg-yellow-200 text-yellow-900',
  resolved: 'bg-green-200 text-green-900',
};

export default function ReportCard({ report, onMarkResolved }) {
  const { user } = useAuth();
  const userRole = user?.user?.role || user?.role;

  return (
    <article
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
      aria-label={`Report titled ${report.title}`}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {report.imageUrl ? (
            <img
              src={report.imageUrl}
              alt={report.title || 'Report Image'}
              className="w-full h-64 object-cover rounded-md"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="w-full h-64 flex flex-col items-center justify-center text-gray-400 text-sm"
              aria-label="No photo available"
              role="img"
            >
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
              No photo
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3
              className="text-xl font-semibold text-gray-900 truncate"
              title={report.title}
            >
              {report.title || 'Untitled Report'}
            </h3>
            <p
              className="text-sm text-gray-600 mt-1 line-clamp-3"
              title={report.description}
            >
              {report.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span>
              <span className="font-medium text-gray-700">Category:</span> {report.category || 'N/A'}
            </span>

            <span
              className={`inline-block px-2 py-1 rounded-full font-semibold capitalize ${priorityColors[report.priority] || 'bg-gray-100 text-gray-600'}`}
              aria-label={`Priority ${report.priority}`}
              title={`Priority: ${report.priority}`}
            >
              {report.priority || 'Unknown'}
            </span>

            <span
              className={`inline-block px-2 py-1 rounded-full font-semibold capitalize ${statusColors[report.status] || 'bg-gray-100 text-gray-600'}`}
              aria-label={`Status ${report.status}`}
              title={`Status: ${report.status}`}
            >
              {report.status || 'Unknown'}
            </span>
          </div>

          <div>
            <MapPreview
              lat={report.location?.coordinates?.[1]}
              lng={report.location?.coordinates?.[0]}
              address={report.location?.address}
            />
          </div>

          <footer className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-400 pt-2 border-t mt-2">
            <span>
              Reported by: <span className="text-gray-700 font-medium">{report.reporter?.name || 'Anonymous'}</span> • {formatDate(report.createdAt)}
            </span>

            {userRole !== 'citizen' && report.status !== 'resolved' && (
              <button
                onClick={() => onMarkResolved(report._id)}
                className="mt-2 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label={`Mark report titled ${report.title} as resolved`}
              >
                Mark Resolved
              </button>
            )}
          </footer>
        </div>
      </div>
    </article>
  );
}
