import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import ChoiceGroup from '../components/ChoiceGroup'
import NumberField from '../components/NumberField'
import SelectField from '../components/SelectField'
import Stepper from '../components/Stepper'
import {
  DAYS,
  DURATIONS,
  EMPTY_PROFILE,
  GOALS,
  LEVELS,
  PLACES,
  SPORTS,
  STEPS,
  STEP_FIELDS,
  clearDraft,
  loadDraft,
  loadProfile,
  normalizeProfile,
  saveDraft,
  saveProfile,
  validateAll,
  validateField,
  validateStep,
} from '../lib/profile'

export default function CrearRutina() {
  const navigate = useNavigate()
  const headingRef = useRef(null)
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState(
    () => loadDraft() ?? loadProfile() ?? EMPTY_PROFILE,
  )
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const isLast = step === STEPS.length - 1

  // Guarda un borrador para no perder los datos si se recarga la página
  useEffect(() => {
    saveDraft(profile)
  }, [profile])

  // Al cambiar de paso, el foco va al título (útil para teclado y lectores de pantalla)
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  function change(field, value) {
    const next = { ...profile, [field]: value }
    setProfile(next)
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, next) }))
    }
  }

  function blur(field) {
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors((current) => ({ ...current, [field]: validateField(field, profile) }))
  }

  function back() {
    setStep((current) => Math.max(0, current - 1))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const fields = STEP_FIELDS[step]
    const stepErrors = validateStep(step, profile)

    setTouched((current) => ({
      ...current,
      ...Object.fromEntries(fields.map((field) => [field, true])),
    }))
    setErrors((current) => ({
      ...current,
      ...Object.fromEntries(fields.map((field) => [field, ''])),
      ...stepErrors,
    }))

    const firstInvalid = fields.find((field) => stepErrors[field])
    if (firstInvalid) {
      document.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    if (!isLast) {
      setStep(step + 1)
      return
    }

    // Último paso: se revisa todo antes de guardar
    const allErrors = validateAll(profile)
    const badStep = STEP_FIELDS.findIndex((stepFields) =>
      stepFields.some((field) => allErrors[field]),
    )
    if (badStep !== -1) {
      setErrors(allErrors)
      setStep(badStep)
      return
    }

    saveProfile(profile)
    clearDraft()
    navigate('/rutina', { state: { profile: normalizeProfile(profile) } })
  }

  return (
    <section className="py-8 md:py-12">
      <h1 className="text-3xl font-bold">Crear rutina</h1>

      <div className="mt-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 rounded-card border border-border bg-surface p-5 md:p-8"
      >
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          {STEPS[step].title}
        </h2>

        <div className="mt-6 space-y-6">
          {step === 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <NumberField
                  id="peso"
                  label="Peso"
                  unit="kg"
                  min={30}
                  max={300}
                  step={0.1}
                  placeholder="75"
                  value={profile.peso}
                  onChange={(value) => change('peso', value)}
                  onBlur={() => blur('peso')}
                  error={errors.peso}
                />
                <NumberField
                  id="altura"
                  label="Altura"
                  unit="cm"
                  min={120}
                  max={230}
                  placeholder="178"
                  value={profile.altura}
                  onChange={(value) => change('altura', value)}
                  onBlur={() => blur('altura')}
                  error={errors.altura}
                />
                <NumberField
                  id="edad"
                  label="Edad"
                  unit="años"
                  min={14}
                  max={90}
                  placeholder="24"
                  value={profile.edad}
                  onChange={(value) => change('edad', value)}
                  onBlur={() => blur('edad')}
                  error={errors.edad}
                />
              </div>

              <ChoiceGroup
                legend="Nivel"
                name="nivel"
                type="radio"
                options={LEVELS}
                columns="sm:grid-cols-3"
                value={profile.nivel}
                onChange={(value) => change('nivel', value)}
                error={errors.nivel}
              />
            </>
          )}

          {step === 1 && (
            <>
              <ChoiceGroup
                legend="Objetivo"
                name="objetivos"
                type="checkbox"
                options={GOALS}
                hint="Podés elegir hasta 2."
                value={profile.objetivos}
                onChange={(value) => change('objetivos', value)}
                error={errors.objetivos}
              />

              <SelectField
                id="deporte"
                label="Deporte que practicás"
                options={SPORTS}
                hint="Opcional. Sirve para adaptar la rutina."
                value={profile.deporte}
                onChange={(value) => change('deporte', value)}
                onBlur={() => blur('deporte')}
                error={errors.deporte}
              />
            </>
          )}

          {step === 2 && (
            <>
              <ChoiceGroup
                legend="Días disponibles para entrenar"
                name="dias"
                type="checkbox"
                layout="chips"
                options={DAYS}
                hint="Elegí entre 2 y 6 días."
                value={profile.dias}
                onChange={(value) => change('dias', value)}
                error={errors.dias}
              />

              <ChoiceGroup
                legend="Duración de cada sesión"
                name="duracion"
                type="radio"
                layout="chips"
                options={DURATIONS}
                value={profile.duracion}
                onChange={(value) => change('duracion', value)}
                error={errors.duracion}
              />

              <ChoiceGroup
                legend="Dónde entrenás"
                name="lugar"
                type="radio"
                options={PLACES}
                columns="sm:grid-cols-3"
                value={profile.lugar}
                onChange={(value) => change('lugar', value)}
                error={errors.lugar}
              />
            </>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 rounded-btn border border-border px-4 py-2.5 font-medium text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft size={18} />
              Atrás
            </button>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-btn bg-primary px-6 py-2.5 font-semibold text-on-primary transition hover:brightness-110"
          >
            {isLast ? (
              <>
                Crear mi rutina
                <Check size={18} />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  )
}