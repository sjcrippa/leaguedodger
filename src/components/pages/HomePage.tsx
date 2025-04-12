import { Link } from 'react-router-dom'

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-6xl font-bold mb-8">League Dodger</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link
          to="/game"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-center text-xl transition-colors"
        >
          Start Game
        </Link>
        <Link
          to="/tutorial"
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-center text-xl transition-colors"
        >
          Tutorial
        </Link>
        <Link
          to="/settings"
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-center text-xl transition-colors"
        >
          Settings
        </Link>
      </div>
    </div>
  )
} 