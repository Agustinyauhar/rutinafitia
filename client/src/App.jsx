import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Placeholder from './components/Placeholder'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="crear"
          element={
            <Placeholder
              title="Crear rutina"
              description="Acá va el formulario con tu perfil (Sem 4)."
            />
          }
        />
        <Route
          path="rutina"
          element={
            <Placeholder
              title="Tu rutina"
              description="Acá se va a ver la rutina generada (Sem 8)."
            />
          }
        />
        <Route
          path="progreso"
          element={
            <Placeholder
              title="Mi progreso"
              description="Acá van los gráficos y el registro de sesiones (Sem 11)."
            />
          }
        />
        <Route
          path="historial"
          element={
            <Placeholder
              title="Historial"
              description="Acá van tus rutinas anteriores (Sem 12)."
            />
          }
        />
        <Route
          path="ajustes"
          element={
            <Placeholder
              title="Ajustes"
              description="Idioma, tema y recordatorios."
            />
          }
        />
        <Route
          path="*"
          element={
            <Placeholder
              title="Página no encontrada"
              description="La dirección que buscás no existe."
            />
          }
        />
      </Route>
    </Routes>
  )
}