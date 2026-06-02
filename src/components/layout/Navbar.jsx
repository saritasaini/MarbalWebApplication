import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Menu, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  User,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [remindersCount, setRemindersCount] = useState(0)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  React.useEffect(() => {
    const fetchRemindersCount = async () => {
      try {
        const { default: api } = await import('../../utils/api.js')
        const response = await api.get('/sites?isCompleted=true&status=Pending,Partial')
        setRemindersCount(response.data?.length || 0)
      } catch (error) {
        console.error('Failed to fetch reminders count', error)
      }
    }
    if (user) {
      fetchRemindersCount()
    }
  }, [user])

  React.useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setShowSearchDropdown(false)
        return
      }
      setIsSearching(true)
      try {
        const { default: api } = await import('../../utils/api.js')
        const response = await api.get(`/sites/search?q=${encodeURIComponent(searchQuery)}`)
        setSearchResults(response.data || [])
        setShowSearchDropdown(true)
      } catch (error) {
        console.error('Search failed', error)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(fetchSearchResults, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/sites?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchDropdown(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu size={20} />
          </button>
          
          {/* Search */}
          <div className="hidden md:block relative z-50">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if(searchResults.length > 0) setShowSearchDropdown(true) }}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </form>
            
            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map(site => (
                      <button
                        key={site._id}
                        type="button"
                        onClick={() => {
                          navigate(`/sites/${site._id}`);
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{site.customerName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{site.customerMobile} • {site.siteAddress}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No customers found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <button 
            onClick={() => navigate('/reminders')}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell size={20} />
            {remindersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-600 rounded-full"></span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                {user?.profilePhoto && user.profilePhoto !== 'default-profile.png' ? (
                  <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.profilePhoto.startsWith('/') ? '' : '/uploads/'}${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <ChevronDown size={16} className="hidden md:block" />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
