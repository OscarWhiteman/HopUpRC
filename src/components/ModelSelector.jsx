import { useState } from 'react'

const CATEGORIES = ['Off-Road Buggy', 'Monster Truck', 'Military', 'Off-Road Truck']
const DRIVES = ['2WD', '4WD']

export default function ModelSelector({ models, selectedModelId, onSelect }) {
  const [category, setCategory] = useState('All')
  const [drive, setDrive] = useState('All')

  const filtered = models.filter(
    (m) =>
      (category === 'All' || m.category === category) &&
      (drive === 'All' || m.driveType === drive)
  )

  return (
    <section className="model-selector">
      <div className="model-filters">
        <div className="filter-bar">
          <button
            className={`filter-btn${category === 'All' ? ' active' : ''}`}
            onClick={() => setCategory('All')}
          >
            All Types
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${category === cat ? ' active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <span className="filter-divider" />
          {DRIVES.map((d) => (
            <button
              key={d}
              className={`filter-btn${drive === d ? ' active' : ''}`}
              onClick={() => setDrive(drive === d ? 'All' : d)}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="model-count">{filtered.length} models</span>
      </div>

      {filtered.length === 0 ? (
        <p className="no-results">No models match these filters.</p>
      ) : (
        <div className="model-cards">
          {filtered.map((model) => (
            <button
              key={model.id}
              className={`model-card${selectedModelId === model.id ? ' selected' : ''}`}
              onClick={() => onSelect(model.id)}
            >
              <div className="card-name">{model.name}</div>
              <div className="card-meta">
                <span>{model.driveType}</span>
                <span>{model.scale}</span>
                <span>{model.category}</span>
              </div>
              <div className="card-items">
                Item {model.itemNumbers.join(' / ')}
              </div>
              <div className="card-year">
                {model.releaseYear}
                {model.rereleaseYear ? ` · Re-release ${model.rereleaseYear}` : ''}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
