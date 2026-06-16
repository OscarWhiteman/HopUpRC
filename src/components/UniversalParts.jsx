import { useState, useRef, useEffect } from 'react'

function ModelsList({ models }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const LIMIT = 3

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const visible = models.slice(0, LIMIT)
  const overflow = models.slice(LIMIT)

  return (
    <div className="also-in-wrap" ref={ref}>
      <span className="also-in-names">{visible.join(', ')}</span>
      {overflow.length > 0 && (
        <>
          {', '}
          <button
            className="also-in-more"
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
          >
            +{overflow.length}
          </button>
          {open && (
            <div className="also-in-popover">
              {models.map((m) => (
                <div key={m} className="also-in-popover-item">{m}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const MIN_OPTIONS = [
  { label: '3+ models', min: 3 },
  { label: '5+ models', min: 5 },
  { label: '10+ models', min: 10 },
]

const SORTERS = {
  count:      (a, b) => b.count - a.count,
  partNumber: (a, b) => a.partNumber.localeCompare(b.partNumber),
  name:       (a, b) => a.name.localeCompare(b.name),
  category:   (a, b) => a.category.localeCompare(b.category),
}

export default function UniversalParts({ universalParts }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [minCount, setMinCount] = useState(3)
  const [sortKey, setSortKey] = useState('count')
  const [sortDir, setSortDir] = useState('desc')

  const categories = ['All', ...[...new Set(universalParts.map((p) => p.category))].sort()]

  const filtered = universalParts.filter((p) => {
    if (p.count < minCount) return false
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!p.partNumber.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q)) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const cmp = SORTERS[sortKey](a, b)
    return sortDir === 'asc' ? cmp : -cmp
  })

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'count' ? 'desc' : 'asc')
    }
  }

  function si(col) {
    if (sortKey !== col) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  function thClass(col) {
    return `sortable-th${sortKey === col ? ' sort-active' : ''}`
  }

  return (
    <section className="universal-parts">
      <div className="universal-parts-header">
        <h2 className="universal-parts-title">Universal Parts</h2>
        <p className="universal-parts-sub">
          Parts shared across multiple models — useful for bulk buying spares.
        </p>
      </div>

      <div className="filter-bar">
        {MIN_OPTIONS.map((opt) => (
          <button
            key={opt.min}
            className={`filter-btn${minCount === opt.min ? ' active' : ''}`}
            onClick={() => setMinCount(opt.min)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <input
          className="search-input"
          type="search"
          placeholder="Search by part number or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn${categoryFilter === cat ? ' active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="universal-parts-count">
        {sorted.length} part{sorted.length !== 1 ? 's' : ''}
        {(search || categoryFilter !== 'All') ? ' matching filters' : ''}
      </p>

      {sorted.length === 0 ? (
        <p className="no-results">No parts match this filter.</p>
      ) : (
        <div className="parts-table-wrap">
          <table className="parts-table">
            <thead>
              <tr>
                <th className={thClass('partNumber')} onClick={() => handleSort('partNumber')}>
                  Part No.{si('partNumber')}
                </th>
                <th className={thClass('name')} onClick={() => handleSort('name')}>
                  Name{si('name')}
                </th>
                <th className={thClass('category')} onClick={() => handleSort('category')}>
                  Category{si('category')}
                </th>
                <th className={thClass('count')} onClick={() => handleSort('count')}>
                  Fits{si('count')}
                </th>
                <th>Models</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.partNumber}>
                  <td className="part-number" data-label="Part No.">{p.partNumber}</td>
                  <td className="part-name" data-label="Name">{p.name}</td>
                  <td data-label="Category">
                    <span className="category-tag">{p.category}</span>
                  </td>
                  <td data-label="Fits">
                    <span className="fits-badge">{p.count}</span>
                  </td>
                  <td className="also-in-cell" data-label="Models">
                    <ModelsList models={p.models} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
