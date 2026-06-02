import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { MapPin, Phone, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SiteCard = ({ site }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Partial': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Pending': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle size={14} />;
      case 'Partial': return <Clock size={14} />;
      case 'Pending': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  const progressPercentage = Math.min(100, (site.advancePayment / site.totalAmount) * 100) || 0;

  return (
    <div className="card hover:shadow-md transition-all group flex flex-col h-full border-l-4 border-l-primary">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{site.customerName}</h3>
            <span className="text-xs font-medium text-primary bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
              {site.workType}
            </span>
          </div>
          <span className={`badge ${getStatusBadge(site.paymentStatus)} flex items-center gap-1`}>
            {getStatusIcon(site.paymentStatus)}
            {site.paymentStatus}
          </span>
        </div>

        <div className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{site.siteAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400 shrink-0" />
            <a href={`tel:${site.customerMobile}`} className="hover:text-primary transition-colors">
              {site.customerMobile}
            </a>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(site.totalAmount)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Pending Due</p>
            <p className={`font-bold ${site.remainingPayment > 0 ? 'text-danger' : 'text-success'}`}>
              {formatCurrency(site.remainingPayment)}
            </p>
          </div>
        </div>

        {/* Payment Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Paid: {formatCurrency(site.advancePayment)}</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${progressPercentage === 100 ? 'bg-success' : 'bg-primary'}`} 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-gray-800/20 flex justify-between items-center rounded-b-2xl">
        <span className="text-xs text-gray-500">
          Added: {formatDate(site.createdAt)}
        </span>
        <Link 
          to={`/sites/${site._id}`} 
          className="text-primary text-sm font-medium hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        >
          Details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default SiteCard;
