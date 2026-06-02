import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const RecentWork = ({ works }) => {
  if (!works || works.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No recent work found.</p>
        <Link to="/sites" className="mt-4 inline-block text-primary font-medium hover:underline">
          Add your first site
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle size={16} className="text-success" />;
      case 'Partial': return <Clock size={16} className="text-warning" />;
      case 'Pending': return <AlertCircle size={16} className="text-danger" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Partial': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Pending': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-gray-800/50 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3 rounded-tl-lg">Customer</th>
            <th className="px-4 py-3">Work Type</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 rounded-tr-lg">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {works.map((site) => (
            <tr key={site._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900 dark:text-white">{site.customerName}</div>
                <div className="text-xs text-gray-500">{formatDate(site.createdAt)}</div>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{site.workType}</td>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formatCurrency(site.totalAmount)}</td>
              <td className="px-4 py-3">
                <span className={`badge ${getStatusBadge(site.paymentStatus)} flex items-center gap-1 w-fit`}>
                  {getStatusIcon(site.paymentStatus)}
                  {site.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link to={`/sites/${site._id}`} className="text-primary hover:text-blue-700 font-medium inline-flex items-center gap-1">
                  View <ArrowRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentWork;
