'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Opportunity = {
  id: string
  title: string
  category: string | null
  level: string | null
  status: string | null
  organization: string | null
  city: string | null
  country: string | null
  location_mode: string | null
  deadline: string | null
  event_start: string | null
  event_end: string | null
  compensation: string | null
  prizes: string | null
  fees: string | null
  skills: string | null
  official_url: string | null
  application_url: string | null
  description_short: string | null
}

const categoryOptions = ['all', 'internship', 'research', 'hackathon']
const statusOptions = ['all', 'ongoing', 'upcoming', 'closed']
const levelOptions = ['all', 'L1', 'L2', 'L3', 'L4']

function formatDate(value: string | null) {
  if (!value) return 'Not specified'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getPrimaryMeta(item: Opportunity) {
  if (item.category === 'hackathon') {
    return item.prizes || item.compensation || 'Prize details not listed'
  }
  if (item.category === 'research') {
    return item.compensation || 'Funding not specified'
  }
  return item.compensation || 'Compensation not specified'
}

function getDateMeta(item: Opportunity) {
  if (item.category === 'hackathon') {
    if (item.event_start) return `Starts ${formatDate(item.event_start)}`
    if (item.event_end) return `Ends ${formatDate(item.event_end)}`
    return 'Dates not specified'
  }
  if (item.deadline) return `Deadline ${formatDate(item.deadline)}`
  return 'Deadline not specified'
}

function statusTone(status: string | null) {
  switch (status) {
    case 'ongoing':
      return 'pill-green'
    case 'upcoming':
      return 'pill-amber'
    case 'closed':
      return 'pill-neutral'
    default:
      return 'pill-neutral'
  }
}

export default function Page() {
  const [items, setItems] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [level, setLevel] = useState('all')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('date_scraped', { ascending: false })

      if (error) {
        setError(error.message)
        setItems([])
      } else {
        setItems((data as Opportunity[]) || [])
      }

      setLoading(false)
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        query.trim() === '' ||
        [
          item.title,
          item.organization,
          item.category,
          item.skills,
          item.city,
          item.country,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())

      const matchesCategory = category === 'all' || item.category === category
      const matchesStatus = status === 'all' || item.status === status
      const matchesLevel = level === 'all' || item.level === level

      return matchesQuery && matchesCategory && matchesStatus && matchesLevel
    })
  }, [items, query, category, status, level])

  const stats = useMemo(() => {
    const internships = items.filter((i) => i.category === 'internship').length
    const research = items.filter((i) => i.category === 'research').length
    const hackathons = items.filter((i) => i.category === 'hackathon').length
    const live = items.filter((i) => i.status === 'ongoing' || i.status === 'upcoming').length

    return { internships, research, hackathons, live }
  }, [items])

  return (
    <main className="page-shell">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />

      <section className="hero">
        <div className="hero-topline">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <span className="eyebrow">Opportunity intelligence dashboard</span>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Track internships, research programs, and hackathons in one elegant workspace.</h1>
            <p>
              A live opportunity board for discovering student-friendly openings, filtering by level and
              status, and scanning what deserves your attention next.
            </p>

            <div className="hero-actions">
              <a href="#opportunities" className="primary-btn">
                Explore opportunities
              </a>
              <div className="mini-note">Live sync pipeline connected to Supabase</div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-label">Current signal</div>
            <div className="hero-panel-value">{stats.live}</div>
            <div className="hero-panel-text">active opportunities worth checking right now</div>
            <div className="hero-panel-bars">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-label">Internships</div>
          <div className="stat-value">{stats.internships}</div>
          <div className="stat-foot">Student and early-career roles</div>
        </article>

        <article className="stat-card">
          <div className="stat-label">Research</div>
          <div className="stat-value">{stats.research}</div>
          <div className="stat-foot">Fellowships and programs</div>
        </article>

        <article className="stat-card">
          <div className="stat-label">Hackathons</div>
          <div className="stat-value">{stats.hackathons}</div>
          <div className="stat-foot">Events and build challenges</div>
        </article>

        <article className="stat-card stat-card-accent">
          <div className="stat-label">Live now</div>
          <div className="stat-value">{stats.live}</div>
          <div className="stat-foot">Ongoing or upcoming</div>
        </article>
      </section>

      <section className="filters-panel" id="opportunities">
        <div className="filters-head">
          <div>
            <div className="section-label">Search and refine</div>
            <h2>Find the best-fit opportunities faster.</h2>
          </div>
          <div className="results-chip">{filtered.length} results</div>
        </div>

        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search by title, org, skill, city, or category"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          <div className="filter-block">
            <label>Category</label>
            <div className="chip-row">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  className={category === option ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setCategory(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <label>Status</label>
            <div className="chip-row">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  className={status === option ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setStatus(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <label>Level</label>
            <div className="chip-row">
              {levelOptions.map((option) => (
                <button
                  key={option}
                  className={level === option ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setLevel(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="opportunity-card skeleton-card">
              <div className="skeleton-line skeleton-line-lg" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line-sm" />
            </article>
          ))}
        </section>
      ) : error ? (
        <section className="message-panel error-panel">
          <div className="section-label">Error</div>
          <h3>Could not load opportunities.</h3>
          <p>{error}</p>
        </section>
      ) : filtered.length === 0 ? (
        <section className="message-panel">
          <div className="section-label">No matches</div>
          <h3>No opportunities matched your filters.</h3>
          <p>Try removing a filter, broadening your search, or checking another category.</p>
        </section>
      ) : (
        <section className="card-grid">
          {filtered.map((item) => (
            <article key={item.id} className="opportunity-card">
              <div className="card-top">
                <div className="card-badges">
                  <span className="soft-badge">{item.category || 'unknown'}</span>
                  <span className={`soft-badge ${statusTone(item.status)}`}>{item.status || 'unknown'}</span>
                  {item.level && <span className="soft-badge">{item.level}</span>}
                </div>
                <div className="card-meta">
                  {[item.city, item.country].filter(Boolean).join(', ') || item.location_mode || 'Location not set'}
                </div>
              </div>

              <div className="card-main">
                <h3>{item.title}</h3>
                <p className="org-line">{item.organization || 'Unknown organization'}</p>
                <p className="desc-line">
                  {item.description_short || 'No short description available for this opportunity yet.'}
                </p>
              </div>

              <div className="card-detail-grid">
                <div>
                  <span className="detail-label">Primary</span>
                  <span className="detail-value">{getPrimaryMeta(item)}</span>
                </div>
                <div>
                  <span className="detail-label">Timeline</span>
                  <span className="detail-value">{getDateMeta(item)}</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="skill-pill">{item.skills || 'General'}</div>
                <div className="action-row">
                  {item.official_url && (
                    <a href={item.official_url} target="_blank" rel="noreferrer" className="ghost-btn">
                      Official
                    </a>
                  )}
                  {item.application_url && (
                    <a href={item.application_url} target="_blank" rel="noreferrer" className="primary-btn small">
                      Apply
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}