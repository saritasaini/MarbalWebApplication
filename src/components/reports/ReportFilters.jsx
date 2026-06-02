import { useState } from 'react';

const ReportFilters = ({ onFilterChange }) => {
  const [reportType, setReportType] = useState('monthly');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setReportType(type);
    
    if (type !== 'custom') {
      onFilterChange({ type, date: customDate });
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setCustomDate(date);
    onFilterChange({ type: reportType, date });
  };

  const handleCustomRange = () => {
    if (startDate && endDate) {
      onFilterChange({ type: 'custom', startDate, endDate });
    }
  };

  return (
    <div className="bg-white dark:bg-darkCard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Period</label>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['daily', 'weekly', 'monthly', 'custom'].map((type) => (
              <button
                key={type}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
                  reportType === type 
                    ? 'bg-white dark:bg-darkCard text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => handleTypeChange({ target: { value: type } })}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {reportType !== 'custom' ? (
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Date
            </label>
            <input
              type={reportType === 'monthly' ? 'month' : 'date'}
              className="input-field"
              value={reportType === 'monthly' ? customDate.substring(0, 7) : customDate}
              onChange={handleDateChange}
            />
          </div>
        ) : (
          <div className="flex-1 w-full flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                className="input-field"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end pb-1">
              <button 
                onClick={handleCustomRange}
                disabled={!startDate || !endDate}
                className="btn btn-primary h-[42px]"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
