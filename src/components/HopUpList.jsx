import { useState, useEffect, useRef } from 'react'

export default function HopUpList({ hopUps, modelId, hopUpList, onToggleStatus, highlightPartNumber }) {
  const [flashPart, setFlashPart] = useState(null)
  const flashRef = useRef(null)

  useEffect(() => {
    if (!highlightPartNumber) return
    setFlashPart(highlightPartNumber)
    const scrollTimer = setTimeout(() => {
      flashRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    const clearTimer = setTimeout(() => setFlashPart(null), 2700)
    return () => { clearTimeout(scrollTimer); clearTimeout(clearTimer) }
  }, [highlightPartNumber])

  if (hopUps.length === 0) {
    return <p className="no-results">No hop-ups match this filter.</p>
  }

  return (
    <div className="hopup-grid">
      {hopUps.map((item) => {
        const key = `${modelId}|${item.partNumber}`
        const status = hopUpList[key]
        const isFlashing = item.partNumber === flashPart
        return (
          <div
            key={item.partNumber}
            ref={isFlashing ? flashRef : null}
            className={`hopup-card${isFlashing ? ' card-highlight' : ''}`}
          >
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
