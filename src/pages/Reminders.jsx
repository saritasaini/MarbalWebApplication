import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Link } from 'react-router-dom'
import { Bell, AlertCircle } from 'lucide-react'
import api from '../utils/api.js'
import { formatCurrency, formatDate } from '../utils/formatCurrency.js'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const Reminders = () => {
  const { t } = useLanguage()
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      // Fetch sites that are completed but payment is Pending or Partial
      const response = await api.get('/sites?isCompleted=true&status=Pending,Partial')
      setReminders(response.data || [])
    } catch (error) {
      toast.error('Failed to load reminders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Partial': return 'bg-warning-100 text-warning-600'
      case 'Pending': return 'bg-danger-100 text-danger-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-danger-100 text-danger-600 rounded-lg">
          <Bell size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('Reminders', 'रिमाइंडर्स')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sites marked as complete with pending payments
          </p>
        </div>
      </div>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
            <Bell size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">There are no completed sites with pending payments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map((site) => (
            <Link
              key={site._id}
              to={`/sites/${site._id}`}
              className="card p-6 hover:shadow-md transition-shadow group relative border-l-4 border-danger-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {site.customerName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{site.customerMobile}</p>
                </div>
                <span className={`status-badge ${getStatusColor(site.paymentStatus)}`}>
                  {site.paymentStatus}
                </span>
              </div>
              
              <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-danger-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Pending</p>
                    <p className="text-xl font-bold text-danger-600 mt-1">
                      {formatCurrency(site.remainingPayment)}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(site.totalAmount)}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate max-w-[60%]">{site.siteAddress}</span>
                <span>Work: {site.workType}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reminders
