import { useForm } from 'react-hook-form';

const PaymentForm = ({ onSubmit, isLoading, activeSites = [], initialSiteId = '' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      siteId: initialSiteId,
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash',
      transactionId: '',
      notes: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Site *</label>
        <select
          className={`input-field ${errors.siteId ? 'border-danger focus:ring-danger' : ''}`}
          {...register('siteId', { required: 'Please select a site' })}
          disabled={!!initialSiteId}
        >
          <option value="">-- Select a site --</option>
          {activeSites.map(site => (
            <option key={site._id} value={site._id}>
              {site.customerName} - {site.siteAddress} (Pending: ₹{site.remainingPayment})
            </option>
          ))}
        </select>
        {errors.siteId && <p className="mt-1 text-xs text-danger">{errors.siteId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹) *</label>
          <input
            type="number"
            className={`input-field ${errors.amount ? 'border-danger focus:ring-danger' : ''}`}
            {...register('amount', { required: 'Amount is required', min: 1 })}
          />
          {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Date *</label>
          <input
            type="date"
            className={`input-field ${errors.paymentDate ? 'border-danger focus:ring-danger' : ''}`}
            {...register('paymentDate', { required: 'Date is required' })}
          />
          {errors.paymentDate && <p className="mt-1 text-xs text-danger">{errors.paymentDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Mode *</label>
          <select
            className="input-field"
            {...register('paymentMode')}
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID / Cheque No.</label>
          <input
            type="text"
            className="input-field"
            {...register('transactionId')}
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
        <textarea
          className="input-field resize-none h-20"
          {...register('notes')}
          placeholder="Any additional details..."
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
            'Save Payment'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
