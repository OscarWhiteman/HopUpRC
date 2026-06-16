import { useState, useRef, useEffect } from 'react'

function highlight(text, query) {
  const str = String(text ?? '')
  if (!query || !str) return str
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'gi')
  const parts = []
  let last = 0
  let match
  while ((match = regex.exec(str)) !== null) {
    if (match.index > last) parts.push(str.slice(last, match.index))
    parts.push(
      <mark key={match.index} className="search-highlight">
        {str.slice(match.index, match.index + match[0].length)}
      </mark>
    )
    last = match.index + match[0].length
  }
  if (last < str.length) parts.push(str.slice(last))
  return parts.length > 0 ? parts : str
}

function truncate(text, max = 90) {
  if (!text || text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

export default function GlobalSearch({ searchIndex, onSelectModel }) {
  const [query, setQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const resultRefs = useRef([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      inputRef.current?.focus()
    }
  }, [])

  const allResults = query.trim().length > 1
    ? (() => {
        const q = query.toLowerCase()
        const seen = new Set()
        return searchIndex
          .filter((p) =>
            p.partNumber.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
          )
          .filter((p) => {
            const key = `${p.modelId}-${p.partNumber}-${p.type}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
      })()
    : []

  const rawResults = allResults.slice(0, 30)
  const totalResults = allResults.length

  const grouped = {}
  for (const r of rawResults) {
    if (!grouped[r.modelName]) grouped[r.modelName] = []
    grouped[r.modelName].push(r)
  }

  // Flat list in grouped render order — used for keyboard nav
  const flatResults = Object.values(grouped).flat()

  useEffect(() => {
    setFocusedIndex(-1)
    resultRefs.current = []
  }, [query])

  useEffect(() => {
    if (focusedIndex >= 0 && resultRefs.current[focusedIndex]) {
      resultRefs.current[focusedIndex].scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex])

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((i) => Math.min(i + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = focusedIndex >= 0 ? flatResults[focusedIndex] : flatResults[0]
      if (target) onSelectModel(target.modelId, { partNumber: target.partNumber, type: target.type })
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  let flatIdx = 0

  return (
    <div className="search-hero">
      <div className="search-hero-inner">
        <h1 className="search-hero-title">
          Find any <span className="search-hero-accent">Tamiya</span> part
        </h1>
        <p className="search-hero-sub">
          Search across {searchIndex.length} parts — stock and hop-ups — from all models
        </p>
        <input
          ref={inputRef}
          className="search-hero-input"
          type="search"
          placeholder="Part number, name, or description…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search all parts"
        />
        {flatResults.length > 0 && (
          <p className="search-hero-hint">↑ ↓ to navigate · Enter to open · Esc to clear</p>
        )}
      </div>

      {query.trim().length > 1 && rawResults.length === 0 && (
        <p className="no-results">No parts found for "{query}".</p>
      )}

      {rawResults.length > 0 && (
        <div className="global-results">
          <p className="global-results-count">
            {totalResults > 30
              ? `Showing ${rawResults.length} of ${totalResults} results`
              : `${rawResults.length} result${rawResults.length !== 1 ? 's' : ''}`}
          </p>
          {Object.entries(grouped).map(([modelName, items]) => (
            <div key={modelName} className="global-result-group">
              <div className="global-result-group-header">
                <span className="global-result-group-name">{modelName}</span>
                <span className="global-result-group-count">{items.length}</span>
              </div>
              {items.map((r) => {
                const idx = flatIdx++
                const isFocused = idx === focusedIndex
                return (
                  <button
                    key={`${r.modelId}-${r.partNumber}-${r.type}`}
                    ref={(el) => { resultRefs.current[idx] = el }}
                    className={`global-result${isFocused ? ' focused' : ''}`}
                    onClick={() => onSelectModel(r.modelId, { partNumber: r.partNumber, type: r.type })}
                    onMouseEnter={() => setFocusedIndex(idx)}
                  >
                    <div className="global-result-top">
                      <span className={`global-result-type ${r.type === 'Hop-Up' ? 'type-hopup' : 'type-stock'}`}>
                        {r.type}
                      </span>
                      <span className="global-result-number">{highlight(r.partNumber, query)}</span>
                      <span className="global-result-name">{highlight(r.name, query)}</span>
                    </div>
                    {r.description && (
                      <p className="global-result-desc">
                        {highlight(truncate(r.description), query)}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
