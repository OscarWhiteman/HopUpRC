import { ExternalLink } from 'lucide-react'

function BuyLinks({ partNumber }) {
  const ebayUrl = `https://www.ebay.co.uk/sch/i.html?_nkw=tamiya+${encodeURIComponent(partNumber)}`
  return (
    <div className="sl-buy-links">
      <a
        href={ebayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sl-buy-link"
        title="Search eBay UK"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={13} />
        <span>Search eBay</span>
      </a>
    </div>
  )
}

export default function ShoppingList({ hopUpList, allModelData, onToggleStatus, onSelectModel }) {
  const entries = Object.entries(hopUpList)

  if (entries.length === 0) {
    return (
      <div className="shopping-list-empty">
        <p className="sl-empty-heading">No parts saved yet</p>
        <p className="sl-empty-sub">Browse a model to start building your list.</p>
      </div>
    )
  }

  const grouped = {}
  let orphanCount = 0
  let totalWanted = 0
  let totalOwned = 0

  for (const [key, status] of entries) {
    const sep = key.indexOf('|')
    const modelId = key.slice(0, sep)
    const partNumber = key.slice(sep + 1)
    const part = allModelData[modelId]?.hopUps.find((h) => h.partNumber === partNumber)
    if (!part) { orphanCount++; continue }
    if (!grouped[modelId]) grouped[modelId] = []
    grouped[modelId].push({ ...part, status, key })
    if (status === 'wanted') totalWanted++
    else if (status === 'owned') totalOwned++
  }

  const modelCount = Object.keys(grouped).length

  return (
    <div className="shopping-list">
      <div className="sl-header">
        <h2 className="shopping-list-title">My List</h2>
        <div className="sl-stats">
          <span className="sl-stat sl-stat-wanted">{totalWanted} wanted</span>
          <span className="sl-stat sl-stat-owned">{totalOwned} owned</span>
          <span className="sl-stat sl-stat-models">{modelCount} {modelCount === 1 ? 'model' : 'models'}</span>
        </div>
      </div>

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
                    <BuyLinks partNumber={p.partNumber} />
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
                    <span className="sl-owned-check">✓</span>
                    <span className="sl-part-number">{p.partNumber}</span>
                    <span className="sl-part-name">{p.name}</span>
                    <BuyLinks partNumber={p.partNumber} />
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
      {orphanCount > 0 && (
        <p className="sl-orphan-notice">
          {orphanCount} saved item{orphanCount !== 1 ? 's' : ''} could not be found and may have been removed from the database.
        </p>
      )}
    </div>
  )
}
