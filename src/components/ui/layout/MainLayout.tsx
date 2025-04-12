import { Outlet, useLocation } from 'react-router-dom'

export const MainLayout = () => {
  const location = useLocation()
  const isGamePage = location.pathname === '/game'

  return (
    <div className={`min-h-screen ${isGamePage ? '' : 'bg-gray-900'}`}>
      {!isGamePage && (
        <header className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
          <nav className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-white">League Dodger</h1>
          </nav>
        </header>
      )}
      <main className={`${isGamePage ? '' : 'container mx-auto px-4 pt-20 pb-8'}`}>
        <Outlet />
      </main>
    </div>
  )
} 