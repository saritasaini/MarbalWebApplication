import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ReportTable = ({ details }) => {
  if (!details) return null;

  const { incomeList, expenseList } = details;
  
  // Combine and sort by date
  const combinedData = [
    ...incomeList.map(i => ({ ...i, type: 'income', date: i.paymentDate })),
    ...expenseList.map(e => ({ ...e, type: 'expense', date: e.expenseDate }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (combinedData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No transactions in this period.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3 rounded-tl-lg">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Description / Site</th>
            <th className="px-4 py-3">Method / Category</th>
            <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {combinedData.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-4 py-3 text-gray-500">
                {formatDate(item.date)}
              </td>
              <td className="px-4 py-3">
                {item.type === 'income' ? (
                  <span className="flex items-center gap-1 text-success font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full w-fit text-xs">
                    <ArrowUpRight size={14} /> Income
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-danger font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full w-fit text-xs">
                    <ArrowDownRight size={14} /> Expense
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                  {item.type === 'income' 
                    ? (item.siteId?.customerName || 'Unknown Payment')
                    : (item.description || 'General Expense')}
                </div>
                {item.type === 'expense' && item.siteId && (
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    Site: {item.siteId.customerName}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {item.type === 'income' ? item.paymentMode : item.expenseType}
              </td>
              <td className={`px-4 py-3 text-right font-bold ${item.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
