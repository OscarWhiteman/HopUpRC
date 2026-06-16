import { forwardRef } from 'react'

const SearchInput = forwardRef(function SearchInput(
  { value, onChange, onClear, className, ...props },
  ref
) {
  return (
    <div className="search-input-wrap">
      <input
        ref={ref}
        className={className}
        value={value}
        onChange={onChange}
        {...props}
      />
      {value && (
        <button
          className="search-clear-btn"
          type="button"
          tabIndex={-1}
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
        >
          ×
        </button>
      )}
    </div>
  )
})

export default SearchInput
