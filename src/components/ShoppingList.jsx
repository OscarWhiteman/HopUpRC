export default function ShoppingList({ hopUpList, allModelData, onToggleStatus, onSelectModel }) {
  const entries = Object.entries(hopUpList)

  if (entries.length === 0) {
    return (
      <div className="shopping-list-empty">
        <p>Your list is empty. Browse hop-ups and mark items as wanted or owned.</p>
      </div>
    )
  }

  const grouped = {}
  for (const [key, status] of entries) {
    const sep = key.indexOf('|')
    const modelId = key.slice(0, sep)
    const partNumber = key.slice(sep + 1)
    const part = allModelData[modelId]?.hopUps.find((h) => h.partNumber === partNumber)
    if (!part) continue
    if (!grouped[modelId]) grouped[modelId] = []
    grouped[modelId].push({ ...part, status, key })
  }

  return (
    <div className="shopping-list">
      <h2 className="shopping-list-title">My List</h2>
      {Object.entries(grouped).map(([modelId, parts]) => {
        const modelName = allModelData[modelId]?.name || modelId
        const wanted = parts.filter((p) => p.status === 'wanted')
        const owned = parts.filter((p) => p.status === 'owned')
        return (
          <div key={modelId} className="shopping-list-group">
            <button className="shopping-list-model-btn" onClick={() => onSelectModel(modelId)}>
              {modelName} <span className="sl-arrow">→</span>
            </button>

            {wanted.length > 0 && (
              <>
                <p className="shopping-list-section-label">Want to buy</p>
                {wanted.map((p) => (
                  <div key={p.key} className="shopping-list-item">
                    <span className="sl-part-number">{p.partNumber}</span>
                    <span className="sl-part-name">{p.name}</span>
                    <div className="sl-actions">
                      <button
                        className="sl-btn sl-btn-owned"
                        onClick={() => onToggleStatus(modelId, p.partNumber, 'owned')}
                      >
                        Mark Owned
                      </button>
                      <button
                        className="sl-btn sl-btn-remove"
                        onClick={() => onToggleStatus(modelId, p.partNumber, 'wanted')}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {owned.length > 0 && (
              <>
                <p className="shopping-list-section-label">Owned</p>
                {owned.map((p) => (
                  <div key={p.key} className="shopping-list-item owned">
                    <span className="sl-part-number">{p.partNumber}</span>
                    <span className="sl-part-name">{p.name}</span>
                    <div className="sl-actions">
                      <button
                        className="sl-btn sl-btn-remove"
                        onClick={() => onToggleStatus(modelId, p.partNumber, 'owned')}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
