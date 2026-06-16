export default function ModelSelector({ models, selectedModelId, onSelect }) {
  return (
    <section className="model-selector">
      <h2 className="selector-label">Select a Model</h2>
      <div className="model-cards">
        {models.map((model) => (
          <button
            key={model.id}
            className={`model-card${selectedModelId === model.id ? ' selected' : ''}`}
            onClick={() => onSelect(model.id)}
          >
            <div className="card-name">{model.name}</div>
            <div className="card-meta">
              <span>{model.driveType}</span>
              <span>{model.scale}</span>
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
    </section>
  )
}
