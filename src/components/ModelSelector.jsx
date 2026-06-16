import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const FILTERS = [
  { label: 'All',            categories: null },
  { label: 'Buggies',        categories: ['Off-Road Buggy'] },
  { label: 'Trucks',         categories: ['Off-Road Truck', 'Military'] },
  { label: 'Monster Trucks', categories: ['Monster Truck'] },
  { label: 'Stadium Racers', categories: ['Stadium Racer'] },
]

export default function ModelSelector({ models, selectedModelId, onSelect }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? models
    : models.filter((m) => {
        const f = FILTERS.find((f) => f.label === activeFilter)
        return f?.categories?.includes(m.category)
      })

  return (
    <section className="model-selector">
      <div className="filter-bar selector-filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            className={`filter-btn${activeFilter === f.label ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.label)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <h2 className="selector-label">Select a Model</h2>

      {filtered.length === 0 ? (
        <p className="no-results">No models in this category yet.</p>
      ) : (
        <div className="model-cards">
          {filtered.map((model) => (
            <Card
              key={model.id}
              className={cn('model-card', selectedModelId === model.id && 'selected')}
              onClick={() => onSelect(model.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(model.id)
                }
              }}
            >
              <div className="card-name">{model.name}</div>
              <div className="card-meta">
                <span className={`card-badge ${model.driveType === '2WD' ? 'badge-2wd' : 'badge-4wd'}`}>
                  {model.driveType}
                </span>
                <span className="card-badge badge-scale">{model.scale}</span>
              </div>
              <div className="card-items">Item {model.itemNumbers.join(' / ')}</div>
              <div className="card-year">
                {model.releaseYear}
                {model.rereleaseYear ? ` · Re-release ${model.rereleaseYear}` : ''}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
