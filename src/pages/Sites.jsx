import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, Building2, LayoutGrid, List, Edit2 } from 'lucide-react'
import api from '../utils/api.js'
import { formatCurrency, formatDate } from '../utils/formatCurrency.js'
import Modal from '../components/common/Modal.jsx'
import SearchBar from '../components/common/SearchBar.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const Sites = () => {
  const { t } = useLanguage()
  
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [viewMode, setViewMode] = useState('card')
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    status: '',
    workType: '',
  })

  useEffect(() => {
    fetchSites()
  }, [searchParams, filters])

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setShowAddModal(true)
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('action')
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const fetchSites = async () => {
    try {
      const params = new URLSearchParams(searchParams)
      if (filters.status) params.set('status', filters.status)
      if (filters.workType) params.set('workType', filters.workType)
      
      const response = await api.get(`/sites?${params.toString()}`)
      setSites(response.data || [])
    } catch (error) {
      toast.error('Failed to load sites')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    if (query) {
      searchParams.set('q', query)
    } else {
      searchParams.delete('q')
    }
    setSearchParams(searchParams)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-success-100 text-success-600'
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Sites', 'साइट्स')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your work sites</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={18} />{t('Add Site', 'साइट जोड़ें')}</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <SearchBar 
              placeholder="Search by customer name or mobile..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md ${viewMode === 'card' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field w-40"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
          </select>
          <select
            value={filters.workType}
            onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
            className="input-field w-48"
          >
            <option value="">All Work Types</option>
            <option value="Marble Polish">Marble Polish</option>
            <option value="Marble Ghisai">Marble Ghisai</option>
            <option value="Re-Polish">Re-Polish</option>
            <option value="Re-Ghisai">Re-Ghisai</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Sites Grid */}
      {sites.length === 0 ? (
        <div className="card p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No sites found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Get started by adding a new site</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Link
              key={site._id}
              to={`/sites/${site._id}`}
              className="card p-6 hover:shadow-md transition-shadow group relative"
            >
              <button 
                onClick={(e) => { e.preventDefault(); setEditingSite(site); setShowEditModal(true); }}
                className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700"
              >
                <Edit2 size={16} />
              </button>
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
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Work Type</span>
                  <span className="text-gray-900 dark:text-gray-200">{site.workType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Area</span>
                  <span className="text-gray-900 dark:text-gray-200">{site.squareFeet} sqft</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rate</span>
                  <span className="text-gray-900 dark:text-gray-200">₹{site.ratePerSqft}/sqft</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-sm font-bold text-primary-600">{formatCurrency(site.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Remaining</span>
                    <span className="text-xs font-medium text-danger-600">{formatCurrency(site.remainingPayment)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{site.siteAddress}</span>
                <span>{formatDate(site.startDate)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">S.No.</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Work Type</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Area</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sites.map((site, index) => (
                  <tr key={site._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => window.location.href = `/sites/${site._id}`}>
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{site.customerName}</div>
                      <div className="text-xs text-gray-500">{site.customerMobile}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{site.workType}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{site.squareFeet} sqft</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">₹{site.ratePerSqft}/sqft</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-primary-600">{formatCurrency(site.totalAmount)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`status-badge ${getStatusColor(site.paymentStatus)}`}>{site.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingSite(site); setShowEditModal(true); }}
                        className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Site Modal */}
      <AddSiteModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchSites}
      />
      
      {/* Edit Site Modal */}
      {editingSite && (
        <EditSiteModal 
          isOpen={showEditModal} 
          onClose={() => { setShowEditModal(false); setEditingSite(null); }} 
          onSuccess={fetchSites}
          site={editingSite}
        />
      )}
    </div>
  )
}

// Add Site Modal Component
const AddSiteModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    customerName: '',
    customerMobile: '',
    siteAddress: '',
    workType: 'Marble Polish',
    squareFeet: '',
    ratePerSqft: '',
    advancePayment: 0,
    startDate: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'squareFeet' || name === 'ratePerSqft' || name === 'advancePayment' 
        ? Number(value) || 0 
        : value
    }))
  }

  const totalAmount = (Number(formData.squareFeet) || 0) * (Number(formData.ratePerSqft) || 0)
  const remainingPayment = totalAmount - (Number(formData.advancePayment) || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/sites', {
        ...formData,
        totalAmount,
        remainingPayment,
        paymentStatus: remainingPayment <= 0 ? 'Paid' : formData.advancePayment > 0 ? 'Partial' : 'Pending',
      })
      toast.success('Site added successfully!')
      onSuccess()
      onClose()
      setFormData({
        customerName: '',
        customerMobile: '',
        siteAddress: '',
        workType: 'Marble Polish',
        squareFeet: '',
        ratePerSqft: '',
        advancePayment: 0,
        startDate: '',
        notes: '',
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add site')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Add New Site', 'नई साइट जोड़ें')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Customer Name', 'ग्राहक का नाम *')}</label>
            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Mobile Number', 'मोबाइल *')}</label>
            <input
              name="customerMobile"
              value={formData.customerMobile}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="10-digit number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Site Address', 'साइट का पता *')}</label>
          <textarea
            name="siteAddress"
            value={formData.siteAddress}
            onChange={handleChange}
            required
            rows={2}
            className="input-field"
            placeholder="Full address of the site"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Work Type', 'कार्य प्रकार')}</label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="input-field"
            >
              <option>Marble Polish</option>
              <option>Marble Ghisai</option>
              <option>Re-Polish</option>
              <option>Re-Ghisai</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Square Feet', 'वर्ग फीट *')}</label>
            <input
              type="number"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              required
              min="1"
              className="input-field"
              placeholder="Area in sqft"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Rate per sqft', 'दर (₹) *')}</label>
            <input
              type="number"
              name="ratePerSqft"
              value={formData.ratePerSqft}
              onChange={handleChange}
              required
              min="1"
              className="input-field"
              placeholder="Rate per sqft"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Advance Payment', 'अग्रिम (₹)')}</label>
            <input
              type="number"
              name="advancePayment"
              value={formData.advancePayment}
              onChange={handleChange}
              min="0"
              className="input-field"
              placeholder="Advance amount"
            />
          </div>
          <div className="md:col-span-1 bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">{t('Total Amount', 'कुल राशि')}</label>
            <p className="text-xl font-bold text-primary-600">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="md:col-span-1 bg-danger-50 dark:bg-danger-900/20 p-3 rounded-lg">
            <label className="block text-sm font-medium text-danger-700 dark:text-danger-300">{t('Remaining', 'बकाया')}</label>
            <p className="text-xl font-bold text-danger-600">₹{remainingPayment.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Start Date', 'शुरुआत तिथि')}</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Notes', 'नोट्स')}</label>
            <input
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              placeholder="Any additional notes"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {t('Save Site', 'साइट सेव करें')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default Sites

// Edit Site Modal Component
const EditSiteModal = ({ isOpen, onClose, onSuccess, site }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    customerName: site?.customerName || '',
    customerMobile: site?.customerMobile || '',
    siteAddress: site?.siteAddress || '',
    workType: site?.workType || 'Marble Polish',
    squareFeet: site?.squareFeet || '',
    ratePerSqft: site?.ratePerSqft || '',
    notes: site?.notes || '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (site) {
      setFormData({
        customerName: site.customerName || '',
        customerMobile: site.customerMobile || '',
        siteAddress: site.siteAddress || '',
        workType: site.workType || 'Marble Polish',
        squareFeet: site.squareFeet || '',
        ratePerSqft: site.ratePerSqft || '',
        notes: site.notes || '',
      });
    }
  }, [site]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'squareFeet' || name === 'ratePerSqft' 
        ? Number(value) || 0 
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.put(`/sites/${site._id}`, formData)
      toast.success('Site updated successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update site')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Edit Site', 'साइट अपडेट करें')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Customer Name', 'ग्राहक का नाम *')}</label>
            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Mobile Number', 'मोबाइल *')}</label>
            <input
              name="customerMobile"
              value={formData.customerMobile}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="10-digit number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Site Address', 'साइट का पता *')}</label>
          <textarea
            name="siteAddress"
            value={formData.siteAddress}
            onChange={handleChange}
            required
            rows={2}
            className="input-field"
            placeholder="Full address of the site"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Work Type', 'कार्य प्रकार')}</label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="input-field"
            >
              <option>Marble Polish</option>
              <option>Marble Ghisai</option>
              <option>Re-Polish</option>
              <option>Re-Ghisai</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Square Feet', 'वर्ग फीट *')}</label>
            <input
              type="number"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              required
              min="1"
              className="input-field"
              placeholder="Area in sqft"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Rate per sqft', 'दर (₹) *')}</label>
            <input
              type="number"
              name="ratePerSqft"
              value={formData.ratePerSqft}
              onChange={handleChange}
              required
              min="1"
              className="input-field"
              placeholder="Rate per sqft"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Notes', 'नोट्स')}</label>
          <input
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field"
            placeholder="Any additional notes"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {t('Update Site', 'अपडेट करें')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
