import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Download, FileText } from 'lucide-react'
import api from '../utils/api.js'
import { formatCurrency, formatDate } from '../utils/formatCurrency.js'
import { generatePDF } from '../utils/generatePDF.js'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const Reports = () => {
  const { t } = useLanguage()
  
  const [reportType, setReportType] = useState('monthly')
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('type', reportType)
      params.set('date', dateRange.start)

      const response = await api.get(`/reports/time-based?${params.toString()}`)
      setReport(response.data)
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      await generatePDF('report-content', `report-${reportType}-${Date.now()}.pdf`)
      toast.success('Report exported successfully!')
    } catch (error) {
      toast.error('Failed to export PDF')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Reports', 'रिपोर्ट्स')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Generate business reports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="input-field w-48"
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="profit">Profit Report</option>
          </select>
          
          <input
            type={dateRange.start.length === 7 ? 'month' : 'date'}
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="input-field w-48"
          />
          
          <button onClick={fetchReport} className="btn-primary">{t('Generate', 'रिपोर्ट बनाएं')}</button>
          
          {report && (
            <button 
              onClick={handleExportPDF}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Download size={18} />
              Export PDF
            </button>
          )}
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : report ? (
        <div id="report-content" className="space-y-6">
          <div className="card p-8">
            <div className="text-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Report</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Generated on {formatDate(new Date())}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
                <p className="text-sm text-primary-600 dark:text-primary-400">Total Income</p>
                <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {formatCurrency(report.summary?.totalIncome || 0)}
                </p>
              </div>
              <div className="p-4 bg-danger-50 dark:bg-danger-900/20 rounded-xl text-center">
                <p className="text-sm text-danger-600 dark:text-danger-400">Total Expenses</p>
                <p className="text-2xl font-bold text-danger-700 dark:text-danger-300">
                  {formatCurrency(report.summary?.totalExpense || 0)}
                </p>
              </div>
              <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-xl text-center">
                <p className="text-sm text-success-600 dark:text-success-400">Net Profit</p>
                <p className="text-2xl font-bold text-success-700 dark:text-success-300">
                  {formatCurrency(report.summary?.netProfit || 0)}
                </p>
              </div>
            </div>

            {report.details && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Income List
                  </h3>
                  <div className="overflow-x-auto card">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {report.details.incomeList?.length === 0 && (
                          <tr><td colSpan="3" className="px-4 py-3 text-center text-sm text-gray-500">No income records</td></tr>
                        )}
                        {report.details.incomeList?.map((income, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{income.customerName || income.siteId?.customerName || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(income.paymentDate)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-success-600">
                              +{formatCurrency(income.amount || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Expense List
                  </h3>
                  <div className="overflow-x-auto card">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {report.details.expenseList?.length === 0 && (
                          <tr><td colSpan="3" className="px-4 py-3 text-center text-sm text-gray-500">No expense records</td></tr>
                        )}
                        {report.details.expenseList?.map((expense, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{expense.expenseType || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(expense.expenseDate)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-danger-600">
                              -{formatCurrency(expense.amount || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No report generated</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select a report type and click Generate</p>
        </div>
      )}
    </div>
  )
}

export default Reports
