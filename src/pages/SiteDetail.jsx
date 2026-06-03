import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Trash2,
  Camera,
  FileText,
  MessageCircle
} from 'lucide-react'
import api from '../utils/api.js'
import { formatCurrency, formatDate } from '../utils/formatCurrency.js'
import Modal from '../components/common/Modal.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const SiteDetail = () => {
  const { t } = useLanguage()

  const { id } = useParams()
  const navigate = useNavigate()
  const [site, setSite] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    fetchSiteDetails()
  }, [id])

  const fetchSiteDetails = async () => {
    try {
      const [siteRes, paymentsRes] = await Promise.all([
        api.get(`/sites/${id}`),
        api.get(`/payments/site/${id}`)
      ])
      setSite(siteRes.data)
      setPayments(paymentsRes.data)
    } catch (error) {
      toast.error('Failed to load site details')
      navigate('/sites')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/sites/${id}`)
      toast.success('Site deleted successfully')
      navigate('/sites')
    } catch (error) {
      toast.error('Failed to delete site')
    }
  }

  const handleMarkComplete = async () => {
    try {
      await api.put(`/sites/${id}`, { isCompleted: true })
      toast.success('Site marked as complete!')
      fetchSiteDetails()
    } catch (error) {
      toast.error('Failed to update site')
    }
  }

  const handleWhatsAppReminder = () => {
    const message = `प्रिय ${site.customerName},\nआपकी साइट ${site.siteAddress} के लिए ₹${formatCurrency(site.remainingPayment)} का भुगतान अभी लंबित है। कृपया यथाशीघ्र भुगतान करने का कष्ट करें।\nधन्यवाद।`
    const url = `https://wa.me/91${site.customerMobile}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleAddPayment = async (paymentData) => {
    try {
      await api.post('/payments', {
        ...paymentData,
        siteId: id,
        customerName: site.customerName,
      })
      toast.success('Payment added successfully!')
      setShowPaymentModal(false)
      fetchSiteDetails()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add payment')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!site) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-success-100 text-success-600'
      case 'Partial': return 'bg-warning-100 text-warning-600'
      case 'Pending': return 'bg-danger-100 text-danger-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Back & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/sites')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{site.customerName}</h1>
            <p className="text-gray-500 dark:text-gray-400">{site.workType}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleWhatsAppReminder}
            className="inline-flex items-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <CheckCircle size={18} />
            Add Payment
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`status-badge ${getStatusColor(site.paymentStatus)} mb-2 inline-block`}>
                  {site.paymentStatus}
                </span>
                {site.isCompleted && (
                  <span className="status-badge bg-success-100 text-success-600 ml-2">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Added on {formatDate(site.createdAt)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                    <p className="font-medium text-gray-900 dark:text-white">{site.customerMobile}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">{site.siteAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(site.startDate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Area</span>
                  <span className="font-medium">{site.squareFeet} sqft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rate</span>
                  <span className="font-medium">₹{site.ratePerSqft}/sqft</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Total Amount</span>
                    <span className="font-bold text-primary-600">{formatCurrency(site.totalAmount)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Advance Paid</span>
                  <span className="font-medium text-success-600">{formatCurrency(site.advancePayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                  <span className="font-bold text-danger-600">{formatCurrency(site.remainingPayment)}</span>
                </div>
              </div>
            </div>

            {site.notes && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</p>
                <p className="text-gray-600 dark:text-gray-400">{site.notes}</p>
              </div>
            )}

            {!site.isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="mt-6 w-full py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-medium"
              >{t('Mark as Complete', 'पूरा हो गया')}</button>
            )}
          </div>

          {/* Photos */}
          {site.photos && site.photos.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Site Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {site.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Site photo ${index + 1}`}
                    className="rounded-lg object-cover h-48 w-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Payment History', 'भुगतान इतिहास')}</h3>
            {payments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No payments recorded</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.paymentMode}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</span>
                    </div>
                    {payment.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{payment.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this site? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
            >{t('Delete', 'हटाएं')}</button>
          </div>
        </div>
      </Modal>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handleAddPayment}
        remainingAmount={site.remainingPayment}
      />
    </div>
  )
}

// Add Payment Modal Component
const AddPaymentModal = ({ isOpen, onClose, onSubmit, remainingAmount }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Add Payment', 'भुगतान जोड़ें')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Amount', 'राशि (₹) *')}</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            max={remainingAmount}
            className="input-field"
            placeholder="Enter amount"
          />
          <p className="text-xs text-gray-500 mt-1">Remaining: {formatCurrency(remainingAmount)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Payment Date', 'भुगतान तिथि')}</label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Payment Mode', 'भुगतान का तरीका')}</label>
            <select
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              className="input-field"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Cheque</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Notes', 'नोट्स')}</label>
          <input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field"
            placeholder="Optional notes"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">{t('Add Payment', 'भुगतान जोड़ें')}</button>
        </div>
      </form>
    </Modal>
  )
}

export default SiteDetail
