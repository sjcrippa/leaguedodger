import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { HomePage } from "@/pages/HomePage";
import { GamePage } from "@/pages/GamePage";
import { TutorialPage } from "@/pages/TutorialPage";
import { MainLayout } from "@/pages/layouts/MainLayout";
import { GameLayout } from "@/pages/layouts/GameLayout";

import "./index.css";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl mb-8">Página no encontrada</p>
    <a href="/" className="text-blue-500 hover:text-blue-400 underline">
      Volver al inicio
    </a>
  </div>
);

const UnderConstruction = () => (
  <div className="flex flex-col items-center justify-center">
    <h1 className="text-6xl font-bold mb-4">🚧</h1>
    <p className="text-xl mb-8">Página en construcción</p>
    <p className="text-gray-300 mb-4">Estamos trabajando en esta sección. ¡Vuelve pronto!</p>
    <a href="/" className="text-blue-500 hover:text-blue-400 underline">
      Volver al inicio
    </a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas principales con MainLayout */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="404" element={<NotFound />} />
          <Route path="settings" element={<UnderConstruction />} />
          <Route path="tutorial" element={<TutorialPage />} />
        </Route>

        {/* Ruta del juego con GameLayout */}
        <Route element={<GameLayout />}>
          <Route path="game" element={<GamePage />} />
        </Route>

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
