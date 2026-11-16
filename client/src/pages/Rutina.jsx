import { Link, useLocation } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import {
  DAYS,
  GOALS,
  LEVELS,
  PLACES,
  SPORTS,
  labelOf,
  loadProfile,
} from '../lib/profile'

export default function Rutina() {
  const { state } = useLocation()
  const profile = state?.profile ?? loadProfile()

  if (!profile) {
    return (
      <section className="py-8">
        <h1 className="text-3xl font-bold">Tu rutina</h1>
        <p className="mt-2 text-muted">Todavía no creaste tu rutina.</p>
        <Link
          to="/crear"
          className="mt-6 inline-flex items-center rounded-btn bg-primary px-6 py-3 font-semibold text-on-primary transition hover:brightness-110"
        >
          Crear mi rutina
        </Link>
      </section>
    )
  }

  const rows = [
    ['Peso', `${profile.peso} kg`],
    ['Altura', `${profile.altura} cm`],
    ['Edad', `${profile.edad} años`],
    ['Nivel', labelOf(LEVELS, profile.nivel)],
    ['Objetivo', profile.objetivos.map((o) => labelOf(GOALS, o)).join(', ')],
    ['Deporte', labelOf(SPORTS, profile.deporte)],
    ['Días', profile.dias.map((d) => labelOf(DAYS, d)).join(', ')],
    ['Duración por sesión', `${profile.duracion} min`],
    ['Lugar', labelOf(PLACES, profile.lugar)],
  ]

  return (
    <section className="py-8">
      <h1 className="text-3xl font-bold">Tu rutina</h1>
      <p className="mt-2 text-muted">
        Guardamos tu perfil. La rutina generada va a aparecer acá en las
        próximas semanas.
      </p>

      <div className="mt-8 rounded-card border border-border bg-surface p-5 md:p-8">
        <h2 className="text-xl font-semibold">Tu perfil</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <Link
          to="/crear"
          className="mt-8 inline-flex items-center gap-2 rounded-btn border border-border px-4 py-2.5 font-medium text-muted transition-colors hover:text-fg"
        >
          <Pencil size={16} />
          Editar mis datos
        </Link>
      </div>
    </section>
  )
}