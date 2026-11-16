import { Check } from 'lucide-react'

// Grupo de opciones (radio o checkbox) con tarjetas o "chips"
export default function ChoiceGroup({
  legend,
  name,
  type,
  options,
  value,
  onChange,
  error,
  hint,
  layout = 'cards',
  columns = 'sm:grid-cols-2',
}) {
  const selected = type === 'checkbox' ? value : [value]
  const hintId = `${name}-hint`
  const errorId = `${name}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined
  const isChips = layout === 'chips'

  function toggle(optionValue) {
    if (type === 'radio') {
      onChange(optionValue)
      return
    }
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    )
  }

  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className={isChips ? 'flex flex-wrap gap-2' : `grid gap-2 ${columns}`}>
        {options.map((option) => {
          const checked = selected.includes(option.value)
          const shape = isChips
            ? 'rounded-full px-4 py-2 text-sm font-medium'
            : 'flex gap-3 rounded-btn px-3 py-2.5'
          const tone = checked
            ? 'border-primary bg-primary/10 text-fg'
            : error
              ? 'border-danger/60 bg-bg'
              : 'border-border bg-bg hover:border-muted'

          return (
            <label
              key={option.value}
              className={`cursor-pointer border transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${shape} ${tone}`}
            >
              <input
                type={type}
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => toggle(option.value)}
                className={isChips ? 'sr-only' : 'mt-1 accent-primary'}
              />
              {isChips ? (
                <span className="inline-flex items-center gap-1.5">
                  {checked && <Check size={14} />}
                  {option.label}
                </span>
              ) : (
                <span>
                  <span className="block text-sm font-medium">{option.label}</span>
                  {option.hint && (
                    <span className="block text-xs text-muted">{option.hint}</span>
                  )}
                </span>
              )}
            </label>
          )
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </fieldset>
  )
}