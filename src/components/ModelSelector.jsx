import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function ModelSelector({ models, selectedModelId, onSelect }) {
  return (
    <section className="model-selector">
      <h2 className="selector-label">Select a Model</h2>
      <div className="model-cards">
        {models.map((model) => (
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
    </section>
  )
}
