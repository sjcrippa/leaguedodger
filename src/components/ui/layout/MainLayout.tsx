import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <header className="fixed top-0 left-0 right-0 bg-[#0F172A] z-50">
        <nav className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">League Dodger</h1>
        </nav>
      </header>
      <main className="container mx-auto px-4 pt-20">
        <Outlet />
      </main>
    </div>
  )
} 