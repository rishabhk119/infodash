'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Opportunity = {
  id: string
  title: string
  category: string
  level: string
  status: string
  organization: string
  deadline: string | null
  event_start: string | null
  location_mode: string | null
  compensation: string | null
  prizes: string | null
  domain: string | null
  application_url: string | null
  description_short: string | null
}

const CATEGORY_COLORS: Record<string, string> = {
  internship: 'bg-blue-100 text-blue-800',
  hackathon: 'bg-purple-100 text-purple-800',
  research: 'bg-green-100 text-green-800',
  fellowship: 'bg-yellow-100 text-yellow-800',
}

const LEVEL_COLORS: Record<string, string> = {
  L1: 'bg-gray-100 text-gray-600',
  L2: 'bg-orange-100 text-orange-700',
  L3: 'bg-red-100 text-red-700',
  L4: 'bg-red-200 text-red-900',
}

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-sky-100 text-sky-700',
  ongoing: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-200 text-gray-500',
  unknown: 'bg-gray-100 text-gray-400',
}

export default function Home() {
  const [data, setData] = useState<Opportunity[]>([])
  const [filtered, setFiltered] = useState<Opportunity[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: rows, error } = await supabase
        .from('opportunities')
        .select('id,title,category,level,status,organization,deadline,event_start,location_mode,compensation,prizes,domain,application_url,description_short')
        .order('date_scraped', { ascending: false })
        .limit(200)

      if (!error && rows) {
        setData(rows)
        setFiltered(rows)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    let result = data
    if (search) result = result.filter(o =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      (o.organization || '').toLowerCase().includes(search.toLowerCase())
    )
    if (category !== 'all') result = result.filter(o => o.category === category)
    if (level !== 'all') result = result.filter(o => o.level === level)
    if (status !== 'all') result = result.filter(o => o.status === status)
    setFiltered(result)
  }, [search, category, level, status, data])

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Opportunity Tracker</h1>
          <p className="text-gray-500 mt-1">Internships, Hackathons, and Research — all in one place</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search title or organization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Categories</option>
            <option value="internship">Internship</option>
            <option value="hackathon">Hackathon</option>
            <option value="research">Research</option>
            <option value="fellowship">Fellowship</option>
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Levels</option>
            <option value="L1">L1 - Beginner</option>
            <option value="L2">L2 - Intermediate</option>
            <option value="L3">L3 - Advanced</option>
            <option value="L4">L4 - Elite</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 mb-4">{filtered.length} opportunities found</p>

        {/* Cards */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(opp => (
              <div key={opp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${CATEGORY_COLORS[opp.category] || 'bg-gray-100 text-gray-600'}`}>
                      {opp.category}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${LEVEL_COLORS[opp.level] || 'bg-gray-100'}`}>
                      {opp.level}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[opp.status] || 'bg-gray-100'}`}>
                      {opp.status}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 mb-1">{opp.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{opp.organization}</p>
                  {opp.description_short && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{opp.description_short}</p>
                  )}
                  <div className="text-xs text-gray-400 space-y-1">
                    {opp.deadline && <p>Deadline: <span className="text-gray-600 font-medium">{opp.deadline}</span></p>}
                    {opp.event_start && <p>Starts: <span className="text-gray-600 font-medium">{opp.event_start}</span></p>}
                    {opp.compensation && <p>Stipend: <span className="text-gray-600 font-medium">{opp.compensation}</span></p>}
                    {opp.prizes && <p>Prizes: <span className="text-gray-600 font-medium">{opp.prizes}</span></p>}
                    {opp.location_mode && <p>Mode: <span className="text-gray-600 font-medium">{opp.location_mode}</span></p>}
                  </div>
                </div>
                {opp.application_url && (
                  <a href={opp.application_url} target="_blank" rel="noopener noreferrer"
                    className="mt-4 block text-center text-sm font-medium bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}