import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { Trash2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentList = ({ payments, onDelete, showSiteLink = true }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="py-12 text-center bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No payments found.</p>
      </div>
    );
  }

  const getModeBadge = (mode) => {
    switch (mode) {
      case 'Cash': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'UPI': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Bank Transfer': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Cheque': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleWhatsApp = (payment) => {
    // Normally you'd get the mobile number from the populated site
    // But since it's not populated with mobile, we'll just show the concept
    // In a real app, populate customerMobile in backend payment fetch
    alert('This would open WhatsApp with a thank you message for the payment of ' + formatCurrency(payment.amount));
  };

  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
          <tr>
            <th className="px-6 py-4 rounded-tl-xl">Date</th>
            {showSiteLink && <th className="px-6 py-4">Customer/Site</th>}
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Mode</th>
            <th className="px-6 py-4">Ref. No</th>
            <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {payments.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {formatDate(payment.paymentDate)}
              </td>
              {showSiteLink && (
                <td className="px-6 py-4">
                  <Link 
                    to={`/sites/${payment.siteId?._id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                  >
                    {payment.siteId?.customerName || payment.customerName || 'Unknown'}
                  </Link>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {payment.siteId?.siteAddress}
                  </div>
                </td>
              )}
              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-base">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-6 py-4">
                <span className={`badge ${getModeBadge(payment.paymentMode)}`}>
                  {payment.paymentMode}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                {payment.transactionId || '-'}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => handleWhatsApp(payment)}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors inline-flex"
                  title="Send Thank You on WhatsApp"
                >
                  <MessageCircle size={18} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this payment? The site balance will be updated.')) {
                      onDelete(payment._id);
                    }
                  }}
                  className="p-2 text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                  title="Delete Payment"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
