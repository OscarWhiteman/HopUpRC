export default function HopUpList({ hopUps, modelId, hopUpList, onToggleStatus }) {
  if (hopUps.length === 0) {
    return <p className="no-results">No hop-ups match this filter.</p>
  }

  return (
    <div className="hopup-grid">
      {hopUps.map((item) => {
        const key = `${modelId}|${item.partNumber}`
        const status = hopUpList[key]
        return (
          <div key={item.partNumber} className="hopup-card">
            <div className="hopup-card-header">
              <span className="hopup-part-number">{item.partNumber}</span>
              <span className="category-tag">{item.category}</span>
            </div>
            <h3 className="hopup-name">{item.name}</h3>
            <p className="hopup-description">{item.description}</p>
            {item.notes && (
              <p className="hopup-notes">
                <span className="notes-label">Note:</span> {item.notes}
              </p>
            )}
            {item.compatibility?.length > 0 && (
              <div className="hopup-compat">
                Fits: {item.compatibility.join(', ')}
              </div>
            )}
            <div className="hopup-list-actions">
              <button
                className={`hopup-list-btn${status === 'wanted' ? ' active-wanted' : ''}`}
                onClick={() => onToggleStatus(modelId, item.partNumber, 'wanted')}
              >
                {status === 'wanted' ? '★ Wanted' : '☆ Want'}
              </button>
              <button
                className={`hopup-list-btn${status === 'owned' ? ' active-owned' : ''}`}
                onClick={() => onToggleStatus(modelId, item.partNumber, 'owned')}
              >
                {status === 'owned' ? '✓ Owned' : '○ Own'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
