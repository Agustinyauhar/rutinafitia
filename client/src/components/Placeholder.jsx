export default function Placeholder({ title, description }) {
  return (
    <section className="py-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>
      <div className="mt-8 rounded-card border border-dashed border-border bg-surface p-8 text-center text-muted">
        Próximamente
      </div>
    </section>
  )
}