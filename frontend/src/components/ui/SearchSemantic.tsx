import React, { useState } from 'react'
import { AutoComplete, Input } from 'antd'
import { useNavigate } from 'react-router' // ✅ خليها react-router-dom
import './styles.css'

interface IData {
  title: string
  description: string
  category: string
  link: string
}

interface IOption {
  value: string
  label: React.ReactNode
}

const data: IData[] = [
  {
    title: 'Database',
    description:
      'A database is an organized collection of inter-related data that models some aspect of the real-world...',
    category: 'Concepts / Data Storage',
    link: '/database',
  },
  {
    title: 'Relational Model & Algebra',
    description: 'CMU Intro to Database Systems / Fall 2023',
    category: 'Course',
    link: '/relational-model',
  },
  {
    title: 'Relational Algebra',
    description: 'Intro to data operations in relational databases',
    category: 'Concepts',
    link: '/relational-algebra',
  },
]

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="px-0.5 rounded bg-purple-600/40 text-purple-200 font-medium"
      >
        {part}
      </span>
    ) : (
      part
    )
  )
}

function SearchSemantic() {
  const [options, setOptions] = useState<IOption[]>([])
  const navigate = useNavigate()

  const handleSearch = (value: string) => {
    if (!value) {
      setOptions([])
      return
    }

    const filtered: IOption[] = data
      .filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
      .map((item) => ({
        value: item.link,
        label: (
          <div className="p-2 rounded-lg bg-[#2a2a36] hover:bg-[#3a3a4a] transition">
            <div className="font-semibold text-gray-100 text-sm">
              {highlight(item.title, value)}
            </div>
            <div className="text-xs text-gray-400">
              {highlight(item.description, value)}
            </div>
            <div className="text-[10px] text-gray-500 italic mt-0.5">
              {item.category}
            </div>
          </div>
        ),
      }))

    setOptions(filtered)
  }

  const handleSelect = (value: string) => {
    navigate(value) // ✅ React Router navigation
  }

  return (
    <div className="search-semantic w-full max-w-md">
      <AutoComplete
        style={{ width: '100%' }}
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        // dropdownClassName="dark-autocomplete"
      >
        <Input.Search
          className="rounded-xl border border-gray-600 bg-[#1e1e2e] text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          placeholder="Search..."
        />
      </AutoComplete>
    </div>
  )
}

export default SearchSemantic
