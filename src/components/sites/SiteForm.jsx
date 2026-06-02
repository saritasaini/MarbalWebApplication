import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const SiteForm = ({ defaultValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: defaultValues || {
      customerName: '',
      customerMobile: '',
      siteAddress: '',
      workType: 'Marble Polish',
      squareFeet: '',
      ratePerSqft: '',
      advancePayment: '0',
      notes: ''
    }
  });

  const sqft = watch('squareFeet');
  const rate = watch('ratePerSqft');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calc = (parseFloat(sqft) || 0) * (parseFloat(rate) || 0);
    setTotalAmount(calc);
  }, [sqft, rate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Customer Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name *</label>
            <input
              type="text"
              className={`input-field ${errors.customerName ? 'border-danger focus:ring-danger' : ''}`}
              {...register('customerName', { required: 'Customer name is required' })}
            />
            {errors.customerName && <p className="mt-1 text-xs text-danger">{errors.customerName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number *</label>
            <input
              type="tel"
              className={`input-field ${errors.customerMobile ? 'border-danger focus:ring-danger' : ''}`}
              {...register('customerMobile', { 
                required: 'Mobile number is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Invalid 10-digit mobile number' }
              })}
            />
            {errors.customerMobile && <p className="mt-1 text-xs text-danger">{errors.customerMobile.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Address *</label>
            <textarea
              className={`input-field resize-none h-24 ${errors.siteAddress ? 'border-danger focus:ring-danger' : ''}`}
              {...register('siteAddress', { required: 'Site address is required' })}
            ></textarea>
            {errors.siteAddress && <p className="mt-1 text-xs text-danger">{errors.siteAddress.message}</p>}
          </div>
        </div>

        {/* Work Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Work Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Work Type *</label>
            <select
              className="input-field"
              {...register('workType', { required: 'Work type is required' })}
            >
              <option value="Marble Polish">Marble Polish</option>
              <option value="Granite Polish">Granite Polish</option>
              <option value="Tile Polish">Tile Polish</option>
              <option value="Marble Repair">Marble Repair</option>
              <option value="Crack Filling">Crack Filling</option>
              <option value="Floor Cleaning">Floor Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Sq.Ft *</label>
              <input
                type="number"
                step="0.01"
                className={`input-field ${errors.squareFeet ? 'border-danger focus:ring-danger' : ''}`}
                {...register('squareFeet', { required: 'Required', min: 1 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate (₹) *</label>
              <input
                type="number"
                step="0.01"
                className={`input-field ${errors.ratePerSqft ? 'border-danger focus:ring-danger' : ''}`}
                {...register('ratePerSqft', { required: 'Required', min: 1 })}
              />
            </div>
          </div>

          {/* Auto Calculated Highlight */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300 flex justify-between font-medium">
              <span>Total Estimated Amount:</span>
              <span className="font-bold text-lg">₹{totalAmount.toFixed(2)}</span>
            </p>
          </div>

          {!defaultValues && ( // Only show advance payment on create, not edit (use payments section for that)
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Advance Payment (₹)</label>
              <input
                type="number"
                className="input-field"
                {...register('advancePayment', { min: 0 })}
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes</label>
        <textarea
          className="input-field resize-none h-20"
          {...register('notes')}
          placeholder="Any special instructions or details..."
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
            defaultValues ? 'Update Site' : 'Save Site'
          )}
        </button>
      </div>
    </form>
  );
};

export default SiteForm;
