import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  Receipt, 
  BarChart3, 
  Settings, 
  X,
  HardHat
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, hindi: 'डैशबोर्ड' },
    { path: '/sites', label: 'Sites', icon: Building2, hindi: 'साइट्स' },
    { path: '/payments', label: 'Payments', icon: CreditCard, hindi: 'भुगतान' },
    { path: '/expenses', label: 'Expenses', icon: Receipt, hindi: 'खर्चे' },
    { path: '/reports', label: 'Reports', icon: BarChart3, hindi: 'रिपोर्ट्स' },
    { path: '/settings', label: 'Settings', icon: Settings, hindi: 'सेटिंग्स' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen z-10">
        <SidebarContent user={user} navItems={navItems} onClose={onClose} />
      </aside>

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-card transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-primary-600">MarblePro</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>
        <SidebarContent user={user} navItems={navItems} onClose={onClose} />
      </aside>
    </>
  )
}

const SidebarContent = ({ user, navItems, onClose }) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-primary-600 rounded-lg">
          <HardHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">MarblePro</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{t(item.label, item.hindi)}</span>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.businessName || 'Business'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
