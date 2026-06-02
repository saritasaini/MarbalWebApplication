import { useForm } from 'react-hook-form';

const ExpenseForm = ({ onSubmit, isLoading, activeSites = [] }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      expenseType: 'Material',
      amount: '',
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
      siteId: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expense Type *</label>
          <select
            className={`input-field ${errors.expenseType ? 'border-danger focus:ring-danger' : ''}`}
            {...register('expenseType', { required: 'Type is required' })}
          >
            <option value="Material">Material</option>
            <option value="Labor">Labor</option>
            <option value="Transport">Transport</option>
            <option value="Food">Food</option>
            <option value="Petrol">Petrol</option>
            <option value="Equipment">Equipment</option>
            <option value="Other">Other</option>
          </select>
          {errors.expenseType && <p className="mt-1 text-xs text-danger">{errors.expenseType.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹) *</label>
          <input
            type="number"
            className={`input-field ${errors.amount ? 'border-danger focus:ring-danger' : ''}`}
            {...register('amount', { required: 'Amount is required', min: 1 })}
          />
          {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
          <input
            type="date"
            className={`input-field ${errors.expenseDate ? 'border-danger focus:ring-danger' : ''}`}
            {...register('expenseDate', { required: 'Date is required' })}
          />
          {errors.expenseDate && <p className="mt-1 text-xs text-danger">{errors.expenseDate.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link to Site (Optional)</label>
          <select
            className="input-field"
            {...register('siteId')}
          >
            <option value="">-- No specific site --</option>
            {activeSites.map(site => (
              <option key={site._id} value={site._id}>
                {site.customerName} - {site.siteAddress}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Details</label>
        <textarea
          className="input-field resize-none h-20"
          {...register('description')}
          placeholder="What was this expense for?"
        ></textarea>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full md:w-auto min-w-[120px]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Save Expense'
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
