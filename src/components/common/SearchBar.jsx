import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

const SearchBar = ({ placeholder = 'Search...', onSearch, debounce = 300 }) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounce)

    return () => clearTimeout(timer)
  }, [query, debounce, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
