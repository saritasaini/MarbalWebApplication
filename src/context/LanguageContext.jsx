import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const language = 'en'
  const toggleLanguage = () => {}

  // Simple translation helper
  const t = (enString, hiString) => enString

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
