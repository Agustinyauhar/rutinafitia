import { Link } from 'react-router-dom'
import { ArrowRight, Play, Target, TrendingUp } from 'lucide-react'

const features = [
  { icon: Target, text: 'Según tu objetivo' },
  { icon: Play, text: 'Con gifs de ejercicios' },
  { icon: TrendingUp, text: 'Seguí tu progreso' },
]

export default function Home() {
  return (
    <section className="py-8 md:py-16">
      <h1 className="text-4xl font-bold leading-tight md:text-5xl">
        Tu rutina de gym,{' '}
        <span className="text-primary">hecha a tu medida</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Gratis y en segundos. Contanos cómo entrenás y armamos tu plan semanal.
      </p>

      <Link
        to="/crear"
        className="mt-8 inline-flex items-center gap-2 rounded-btn bg-primary px-6 py-3 font-semibold text-on-primary transition hover:brightness-110"
      >
        Crear mi rutina
        <ArrowRight size={18} />
      </Link>

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 rounded-card border border-border bg-surface p-4"
          >
            <Icon size={20} className="text-primary" />
            <span className="font-medium">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}