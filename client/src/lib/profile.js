// Constantes, validaciones y almacenamiento del perfil del usuario

export const STORAGE_KEY = 'rutinafit.profile'
export const DRAFT_KEY = 'rutinafit.draft'

export const LEVELS = [
  { value: 'principiante', label: 'Principiante', hint: 'Menos de 6 meses entrenando' },
  { value: 'intermedio', label: 'Intermedio', hint: 'Entre 6 meses y 2 años' },
  { value: 'avanzado', label: 'Avanzado', hint: 'Más de 2 años con constancia' },
]

export const GOALS = [
  { value: 'musculo', label: 'Ganar músculo' },
  { value: 'grasa', label: 'Perder grasa' },
  { value: 'fuerza', label: 'Ganar fuerza' },
  { value: 'resistencia', label: 'Mejorar resistencia' },
  { value: 'salud', label: 'Salud general' },
]

export const SPORTS = [
  { value: 'ninguno', label: 'Ninguno en particular' },
  { value: 'futbol', label: 'Fútbol' },
  { value: 'running', label: 'Running' },
  { value: 'ciclismo', label: 'Ciclismo' },
  { value: 'natacion', label: 'Natación' },
  { value: 'tenis', label: 'Tenis / pádel' },
  { value: 'basquet', label: 'Básquet' },
  { value: 'otro', label: 'Otro' },
]

export const DAYS = [
  { value: 'lun', label: 'Lun' },
  { value: 'mar', label: 'Mar' },
  { value: 'mie', label: 'Mié' },
  { value: 'jue', label: 'Jue' },
  { value: 'vie', label: 'Vie' },
  { value: 'sab', label: 'Sáb' },
  { value: 'dom', label: 'Dom' },
]

export const DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
]

export const PLACES = [
  { value: 'gimnasio', label: 'Gimnasio' },
  { value: 'casa-equipo', label: 'Casa con equipo' },
  { value: 'casa-sin-equipo', label: 'Casa sin equipo' },
]

export const EMPTY_PROFILE = {
  peso: '',
  altura: '',
  edad: '',
  nivel: '',
  objetivos: [],
  deporte: 'ninguno',
  dias: [],
  duracion: '',
  lugar: '',
}

export const STEPS = [
  { id: 'datos', label: 'Tus datos', title: 'Contanos sobre vos' },
  { id: 'objetivo', label: 'Objetivo', title: '¿Qué querés lograr?' },
  { id: 'disponibilidad', label: 'Disponibilidad', title: '¿Cuándo y dónde entrenás?' },
]

// Campos que se validan en cada paso
export const STEP_FIELDS = [
  ['peso', 'altura', 'edad', 'nivel'],
  ['objetivos', 'deporte'],
  ['dias', 'duracion', 'lugar'],
]

/* ---------- Validaciones ---------- */

const toNumber = (value) => Number(String(value).replace(',', '.'))
const isEmpty = (value) => value === '' || value === null || value === undefined

function checkNumber(value, { ask, subject, min, max, unit, integer = false }) {
  if (isEmpty(value)) return ask
  const n = toNumber(value)
  if (Number.isNaN(n)) return `${subject} tiene que ser un número.`
  if (integer && !Number.isInteger(n)) {
    return `${subject} tiene que ser un número entero.`
  }
  if (n < min || n > max) {
    return `${subject} tiene que estar entre ${min} y ${max} ${unit}.`
  }
  return ''
}

const VALIDATORS = {
  peso: (p) =>
    checkNumber(p.peso, {
      ask: 'Ingresá tu peso.',
      subject: 'El peso',
      min: 30,
      max: 300,
      unit: 'kg',
    }),
  altura: (p) =>
    checkNumber(p.altura, {
      ask: 'Ingresá tu altura.',
      subject: 'La altura',
      min: 120,
      max: 230,
      unit: 'cm',
      integer: true,
    }),
  edad: (p) =>
    checkNumber(p.edad, {
      ask: 'Ingresá tu edad.',
      subject: 'La edad',
      min: 14,
      max: 90,
      unit: 'años',
      integer: true,
    }),
  nivel: (p) =>
    LEVELS.some((l) => l.value === p.nivel) ? '' : 'Elegí tu nivel.',
  objetivos: (p) => {
    if (p.objetivos.length === 0) return 'Elegí al menos un objetivo.'
    if (p.objetivos.length > 2) return 'Elegí como máximo 2 objetivos.'
    return ''
  },
  deporte: (p) =>
    SPORTS.some((s) => s.value === p.deporte) ? '' : 'Elegí una opción de la lista.',
  dias: (p) => {
    if (p.dias.length < 2) return 'Elegí al menos 2 días para entrenar.'
    if (p.dias.length > 6) {
      return 'Elegí como máximo 6 días, así te queda al menos uno de descanso.'
    }
    return ''
  },
  duracion: (p) =>
    DURATIONS.some((d) => d.value === Number(p.duracion))
      ? ''
      : 'Elegí cuánto dura cada sesión.',
  lugar: (p) =>
    PLACES.some((l) => l.value === p.lugar) ? '' : 'Elegí dónde entrenás.',
}

export function validateField(field, profile) {
  return VALIDATORS[field](profile)
}

export function validateStep(step, profile) {
  const errors = {}
  for (const field of STEP_FIELDS[step]) {
    const message = validateField(field, profile)
    if (message) errors[field] = message
  }
  return errors
}

export function validateAll(profile) {
  return STEP_FIELDS.reduce(
    (acc, _fields, index) => ({ ...acc, ...validateStep(index, profile) }),
    {},
  )
}

export function normalizeProfile(profile) {
  return {
    ...profile,
    peso: toNumber(profile.peso),
    altura: toNumber(profile.altura),
    edad: toNumber(profile.edad),
    duracion: Number(profile.duracion),
  }
}

/* ---------- Almacenamiento (localStorage, con respaldo si falla) ---------- */

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) }
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const loadProfile = () => read(STORAGE_KEY)
export const loadDraft = () => read(DRAFT_KEY)
export const saveDraft = (profile) => write(DRAFT_KEY, profile)
export const saveProfile = (profile) =>
  write(STORAGE_KEY, normalizeProfile(profile))

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // Sin acceso a localStorage: no hay borrador que limpiar
  }
}

export const labelOf = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value  