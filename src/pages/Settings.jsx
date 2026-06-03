import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { User, Moon, Lock, Building2, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { t } = useLanguage()
  
  const { user, updateProfile, changePassword } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    businessOwnerName: user?.businessOwnerName || '',
    phone: user?.phone || '',
    gstNumber: user?.gstNumber || '',
  })

  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        businessName: user.businessName || '',
        businessOwnerName: user.businessOwnerName || '',
        phone: user.phone || '',
        gstNumber: user.gstNumber || '',
      })
    }
  }, [user])

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    // Frontend validation
    if (profileData.phone && profileData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    const formData = new FormData()
    formData.append('name', profileData.name)
    formData.append('businessName', profileData.businessName)
    formData.append('businessOwnerName', profileData.businessOwnerName)
    formData.append('phone', profileData.phone)
    formData.append('gstNumber', profileData.gstNumber)
    
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto)
    }

    await updateProfile(formData)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePhoto(file)
      setProfilePhotoPreview(URL.createObjectURL(file))
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, hindi: 'प्रोफाइल' },
    { id: 'business', label: 'Business', icon: Building2, hindi: 'व्यवसाय' },
    { id: 'password', label: 'Password', icon: Lock, hindi: 'पासवर्ड' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Settings', 'सेटिंग्स')}</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="card overflow-hidden">
            <nav className="flex overflow-x-auto lg:flex-col hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-colors whitespace-nowrap flex-shrink-0 lg:w-full ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={18} />
                  <div>
                    <span className="font-medium text-sm">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : user?.profilePhoto && user.profilePhoto !== 'default-profile.png' ? (
                      <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.profilePhoto.startsWith('/') ? '' : '/uploads/'}${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-primary-600 dark:text-primary-400" size={24} />
                    )}
                  </div>
                  <label className="btn-secondary text-sm cursor-pointer">
                    {t('Change Photo', 'फोटो बदलें')}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Full Name', 'पूरा नाम')}</label>
                    <input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Phone', 'फोन')}</label>
                    <input
                      value={profileData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setProfileData({ ...profileData, phone: val })
                      }}
                      className={`input-field ${profileData.phone && profileData.phone.length !== 10 ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="10-digit number"
                    />
                    {profileData.phone && profileData.phone.length !== 10 && (
                      <p className="text-sm text-red-500 mt-1">Please add a valid 10-digit phone number</p>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={profileData.phone && profileData.phone.length !== 10}
                >
                  {t('Save Changes', 'बदलाव सेव करें')}
                </button>
              </form>
            )}

            {activeTab === 'business' && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Business Name', 'व्यवसाय का नाम')}</label>
                  <input
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Business Owner Name', 'व्यवसाय के मालिक का नाम')}</label>
                  <input
                    value={profileData.businessOwnerName}
                    onChange={(e) => setProfileData({ ...profileData, businessOwnerName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('GST Number', 'जीएसटी नंबर')}</label>
                  <input
                    value={profileData.gstNumber}
                    onChange={(e) => setProfileData({ ...profileData, gstNumber: e.target.value })}
                    className="input-field"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <button type="submit" className="btn-primary">{t('Save Business Info', 'व्यवसाय की जानकारी सेव करें')}</button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Current Password', 'वर्तमान पासवर्ड')}</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('New Password', 'नया पासवर्ड')}</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Confirm Password', 'पासवर्ड की पुष्टि')}</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>

                <button type="submit" className="btn-primary">{t('Change Password', 'पासवर्ड बदलें')}</button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
