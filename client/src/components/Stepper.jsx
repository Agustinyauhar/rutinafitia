export default function Stepper({ steps, current }) {
  return (
    <div>
      <p className="text-sm text-muted">
        Paso {current + 1} de {steps.length}:{' '}
        <span className="font-medium text-fg">{steps[current].label}</span>
      </p>
      <div
        className="mt-3 flex gap-2"
        role="progressbar"
        aria-label="Progreso del formulario"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={current + 1}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index <= current ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}