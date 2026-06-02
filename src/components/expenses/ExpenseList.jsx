import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { Trash2, Wrench, Users, Truck, Coffee, Fuel, Package, Box } from 'lucide-react';

const ExpenseList = ({ expenses, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="py-12 text-center bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No expenses found.</p>
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Equipment': return <Wrench size={18} className="text-orange-500" />;
      case 'Labor': return <Users size={18} className="text-blue-500" />;
      case 'Transport': return <Truck size={18} className="text-green-500" />;
      case 'Food': return <Coffee size={18} className="text-yellow-500" />;
      case 'Petrol': return <Fuel size={18} className="text-red-500" />;
      case 'Material': return <Package size={18} className="text-purple-500" />;
      default: return <Box size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
          <tr>
            <th className="px-6 py-4 rounded-tl-xl">Category</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Linked Site</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-right rounded-tr-xl">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {expenses.map((expense) => (
            <tr key={expense._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {getTypeIcon(expense.expenseType)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{expense.expenseType}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                {expense.description || '-'}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {formatDate(expense.expenseDate)}
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">
                {expense.siteId ? (
                  <span className="truncate max-w-[150px] inline-block" title={expense.siteId.customerName}>
                    {expense.siteId.customerName}
                  </span>
                ) : '-'}
              </td>
              <td className="px-6 py-4 text-right font-bold text-danger text-base">
                -{formatCurrency(expense.amount)}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this expense?')) {
                      onDelete(expense._id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                  title="Delete Expense"
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

export default ExpenseList;
