import { useState } from 'react'

export default function GlobalSearch({ searchIndex, onSelectModel }) {
  const [query, setQuery] = useState('')

  const results = query.trim().length > 1
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
          .slice(0, 24)
      })()
    : []

  return (
    <div className="global-search">
      <input
        className="global-search-input"
        type="search"
        placeholder="Search all models by part number, name, or description…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim().length > 1 && results.length === 0 && (
        <p className="no-results">No parts found for "{query}".</p>
      )}

      {results.length > 0 && (
        <div className="global-results">
          {results.map((r, i) => (
            <button
              key={i}
              className="global-result"
              onClick={() => onSelectModel(r.modelId)}
            >
              <span className="global-result-model">{r.modelName}</span>
              <span className={`global-result-type ${r.type === 'Hop-Up' ? 'type-hopup' : 'type-stock'}`}>
                {r.type}
              </span>
              <span className="global-result-number">{r.partNumber}</span>
              <span className="global-result-name">{r.name}</span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length === 0 && (
        <div className="empty-state">
          <p>Select a model above, or search all parts by number, name, or description.</p>
        </div>
      )}
    </div>
  )
}
