import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Plus, Fuel, Users, Package, Utensils, Plane, MoreHorizontal, LayoutGrid, List, Receipt } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import api from '../utils/api.js'
import { formatCurrency, formatDate } from '../utils/formatCurrency.js'
import Modal from '../components/common/Modal.jsx'
import SearchBar from '../components/common/SearchBar.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const expenseTypes = [
  'Petrol', 'Labor', 'Material', 'Food', 'Travel', 'Other'
]

const COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#d97706', '#dc2626', '#6b7280']

const getExpenseIcon = (type) => {
  switch (type) {
    case 'Petrol': return <Fuel size={20} className="text-blue-600" />
    case 'Labor': return <Users size={20} className="text-purple-600" />
    case 'Material': return <Package size={20} className="text-green-600" />
    case 'Food': return <Utensils size={20} className="text-orange-600" />
    case 'Travel': return <Plane size={20} className="text-red-600" />
    default: return <MoreHorizontal size={20} className="text-gray-600" />
  }
}

const Expenses = () => {
  const { t } = useLanguage()
  
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState('All Time')

  const getDateRange = (type) => {
    const start = new Date();
    const end = new Date();
    if (type === 'Today') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'Yesterday') {
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'Weekly') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'Monthly') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    } else {
      return null;
    }
    return { start, end };
  };

  useEffect(() => {
    fetchExpenses()
  }, [filterType, searchQuery, timeFilter])

  const fetchExpenses = async () => {
    try {
      const params = new URLSearchParams()
      if (filterType) params.set('type', filterType)
      if (searchQuery) params.set('q', searchQuery)
      
      const dates = getDateRange(timeFilter);
      if (dates) {
        params.set('startDate', dates.start.toISOString());
        params.set('endDate', dates.end.toISOString());
      }

      const expensesRes = await api.get(`/expenses?${params.toString()}`)
      const expensesData = expensesRes.data || [];
      
      setExpenses(expensesData);
      
      const dynamicSummary = expenseTypes.map(type => {
        const typeExpenses = expensesData.filter(e => e.expenseType === type);
        return {
          type,
          total: typeExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
          count: typeExpenses.length
        };
      });
      setSummary(dynamicSummary);
    } catch (error) {
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Expenses', 'खर्चे')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your business expenses</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={18} />{t('Add Expense', 'खर्च जोड़ें')}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {expenseTypes.map((type, index) => {
          const itemSummary = summary.find(s => s.type === type) || { total: 0, count: 0 }
          const isSelected = filterType === type
          return (
            <div 
              key={type} 
              onClick={() => setFilterType(isSelected ? '' : type)}
              className={`card p-4 cursor-pointer transition-all border-2 ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent hover:border-primary-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  {getExpenseIcon(type)}
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {itemSummary.count} entries
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{type}</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(itemSummary.total)}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card p-6 h-[400px]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Breakdown
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="type"
                >
                  {summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[expenseTypes.indexOf(entry.type) % COLORS.length] || COLORS[0]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="input-field py-1.5 h-[38px] text-sm"
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Weekly">This Week</option>
                <option value="Monthly">This Month</option>
              </select>
              <SearchBar 
                placeholder="Search expenses..."
                onSearch={setSearchQuery}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            {expenses.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No expenses found</h3>
                <p className="text-sm text-gray-500 max-w-sm">Try adjusting your filters or click "Add Expense" to create a new record.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">S.No.</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map((expense, index) => (
                    <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getExpenseIcon(expense.expenseType)}
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{expense.expenseType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {expense.description || '-'}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(expense.expenseDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchExpenses}
      />
    </div>
  )
}

const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    expenseType: 'Petrol',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/expenses', {
        ...formData,
        amount: Number(formData.amount),
      })
      toast.success('Expense added successfully!')
      onSuccess()
      onClose()
      setFormData({
        expenseType: 'Petrol',
        amount: '',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      toast.error('Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Add Expense', 'खर्च जोड़ें')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Expense Type', 'खर्च का प्रकार')}</label>
            <select
              value={formData.expenseType}
              onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
              className="input-field"
            >
              {expenseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Amount', 'राशि (₹) *')}</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1"
              className="input-field"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Description', 'विवरण')}</label>
          <input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            placeholder="Optional description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Date', 'तिथि')}</label>
          <input
            type="date"
            value={formData.expenseDate}
            onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {t('Save', 'सेव करें')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default Expenses
