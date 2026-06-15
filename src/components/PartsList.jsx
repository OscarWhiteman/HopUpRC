import { useState } from 'react'

const SORTERS = {
  partNumber: (a, b) => a.partNumber.localeCompare(b.partNumber),
  bagCode: (a, b) => (a.bagCode ?? '').localeCompare(b.bagCode ?? ''),
  name: (a, b) => a.name.localeCompare(b.name),
  qty: (a, b) => (a.qty ?? 0) - (b.qty ?? 0),
  category: (a, b) => a.category.localeCompare(b.category),
}

export default function PartsList({ parts, crossRef, currentModelName }) {
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
          </tr>
        </thead>
        <tbody>
          {sorted.map((part, i) => {
            const alsoIn = (crossRef[part.partNumber] || []).filter(
              (m) => m !== currentModelName
            )
            return (
              <tr key={part.partNumber}>
                <td className="part-number" data-label="">{part.partNumber}</td>
                <td className="bag-code" data-label="Bag">{part.bagCode ?? '—'}</td>
                <td className="part-name" data-label="">{part.name}</td>
                <td data-label="Desc.">{part.description || null}</td>
                <td className="col-qty" data-label="Qty">{part.qty ?? '—'}</td>
                <td data-label="Category">
                  <span className="category-tag">{part.category}</span>
                </td>
                {hasNotes && <td className="notes-cell" data-label="Notes">{part.notes || null}</td>}
                {hasAlsoIn && (
                  <td className="also-in-cell" data-label="Also In">
                    {alsoIn.length > 0 ? alsoIn.join(', ') : null}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
