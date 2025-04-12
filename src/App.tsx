import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@components/ui/layout/MainLayout'
import { HomePage } from '@components/pages/HomePage'
import { GamePage } from '@components/pages/GamePage'
import '@styles/globals.css'

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl mb-8">Página no encontrada</p>
    <a href="/" className="text-blue-500 hover:text-blue-400 underline">
      Volver al inicio
    </a>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="game" element={<GamePage />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
