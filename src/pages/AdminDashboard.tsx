import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { storage } from '../lib/storage';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    date: 'all'
  });

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = () => {
    let filteredIssues = storage.getIssues();

    if (filters.status !== 'all') {
      filteredIssues = filteredIssues.filter(issue => issue.status === filters.status);
    }
    if (filters.type !== 'all') {
      filteredIssues = filteredIssues.filter(issue => issue.type === filters.type);
    }
    if (filters.date !== 'all') {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(filters.date));
      filteredIssues = filteredIssues.filter(issue => new Date(issue.created_at) >= date);
    }

    setIssues(filteredIssues);
  };

  const updateIssueStatus = (id, status) => {
    const issues = storage.getIssues();
    const updatedIssues = issues.map(issue => 
      issue.id === id ? { ...issue, status } : issue
    );
    localStorage.setItem('issues', JSON.stringify(updatedIssues));
    fetchIssues();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <select
            className="input"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            className="input"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="Fire Accident">Fire Accident</option>
            <option value="Flood">Flood</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Street Light Issue">Street Light Issue</option>
            <option value="Hazardous Gas Leak">Hazardous Gas Leak</option>
            <option value="Others">Others</option>
          </select>
          <select
            className="input"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {issue.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">
                    {issue.description}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {issue.reporter_name || 'Anonymous'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {format(new Date(issue.created_at), 'MMM d, yyyy')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    className="input"
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}