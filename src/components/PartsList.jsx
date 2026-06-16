import { useState, useRef, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'

const SORTERS = {
  partNumber: (a, b) => a.partNumber.localeCompare(b.partNumber),
  bagCode: (a, b) => (a.bagCode ?? '').localeCompare(b.bagCode ?? ''),
  name: (a, b) => a.name.localeCompare(b.name),
  qty: (a, b) => (a.qty ?? 0) - (b.qty ?? 0),
  category: (a, b) => a.category.localeCompare(b.category),
}

function AlsoInCell({ alsoIn }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const LIMIT = 3

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (alsoIn.length === 0) return null

  const visible = alsoIn.slice(0, LIMIT)
  const overflow = alsoIn.slice(LIMIT)

  return (
    <div className="also-in-wrap" ref={ref}>
      <span className="also-in-names">{visible.join(', ')}</span>
      {overflow.length > 0 && (
        <>
          {', '}
          <button
            className="also-in-more"
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
          >
            +{overflow.length}
          </button>
          {open && (
            <div className="also-in-popover">
              {alsoIn.map((m) => (
                <div key={m} className="also-in-popover-item">{m}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function PartsList({ parts, crossRef, currentModelName, modelId, hopUpList = {}, onToggleStatus }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = sortKey
    ? [...parts].sort((a, b) => {
        const cmp = SORTERS[sortKey](a, b)
        return sortDir === 'asc' ? cmp : -cmp
      })
    : parts

  if (sorted.length === 0) {
    return <p className="no-results">No parts match this filter.</p>
  }

  const hasNotes = sorted.some((p) => p.notes)
  const hasAlsoIn = sorted.some(
    (p) => (crossRef[p.partNumber] || []).filter((m) => m !== currentModelName).length > 0
  )

  function si(col) {
    if (sortKey !== col) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  function thClass(col) {
    return `sortable-th${sortKey === col ? ' sort-active' : ''}`
  }

  return (
    <div className="parts-table-wrap">
      <table className="parts-table">
        <thead>
          <tr>
            <th className={thClass('partNumber')} onClick={() => handleSort('partNumber')}>
              Part No.{si('partNumber')}
            </th>
            <th className={thClass('bagCode')} onClick={() => handleSort('bagCode')}>
              Bag{si('bagCode')}
            </th>
            <th className={thClass('name')} onClick={() => handleSort('name')}>
              Name{si('name')}
            </th>
            <th>Description</th>
            <th className={`col-qty ${thClass('qty')}`} onClick={() => handleSort('qty')}>
              Qty{si('qty')}
            </th>
            <th className={thClass('category')} onClick={() => handleSort('category')}>
              Category{si('category')}
            </th>
            {hasNotes && <th>Notes</th>}
            {hasAlsoIn && <th>Also In</th>}
            <th className="col-list" aria-label="Save to list" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((part) => {
            const alsoIn = (crossRef[part.partNumber] || []).filter(
              (m) => m !== currentModelName
            )
            const listKey = `${modelId}|${part.partNumber}`
            const inList = !!hopUpList[listKey]
            return (
              <tr key={part.partNumber}>
                <td className="part-number" data-label="">{part.partNumber}</td>
                <td className="bag-code" data-label="Bag">{part.bagCode ?? '—'}</td>
                <td className="part-name" data-label="">{part.name}</td>
                <td
                  className="desc-cell"
                  data-label="Desc."
                  title={part.description || undefined}
                >
                  {part.description || null}
                </td>
                <td className="col-qty" data-label="Qty">{part.qty ?? '—'}</td>
                <td data-label="Category">
                  <span className="category-tag">{part.category}</span>
                </td>
                {hasNotes && (
                  <td className="notes-cell" data-label="Notes">{part.notes || null}</td>
                )}
                {hasAlsoIn && (
                  <td className="also-in-cell" data-label="Also In">
                    <AlsoInCell alsoIn={alsoIn} />
                  </td>
                )}
                <td className="col-list" data-label="">
                  {onToggleStatus && (
                    <button
                      className={`part-list-btn${inList ? ' active' : ''}`}
                      title={inList ? 'Remove from list' : 'Add to list'}
                      onClick={() => onToggleStatus(modelId, part.partNumber, 'wanted')}
                    >
                      {inList ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
