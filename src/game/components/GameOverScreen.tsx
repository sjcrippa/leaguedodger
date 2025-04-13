import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useEnemyStore } from '../stores/enemyStore'
import { useAbilitiesStore } from '../stores/abilitiesStore'

export const GameOverScreen = () => {
  const isGameOver = useGameStore(state => state.isGameOver)
  const score = useGameStore(state => state.score)
  const resetGame = useGameStore(state => state.resetGame)
  const resetPlayer = usePlayerStore(state => state.reset)
  const resetEnemies = useEnemyStore(state => state.reset)
  const resetAbilities = useAbilitiesStore(state => state.reset)

  const handleRestart = () => {
    resetGame()
    resetPlayer()
    resetEnemies()
    resetAbilities()
  }

  if (!isGameOver) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
    >
      <div 
        style={{
          backgroundColor: '#1F2937',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          pointerEvents: 'auto'
        }}
      >
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '1rem'
        }}>
          ¡Game Over!
        </h2>
        <p style={{
          fontSize: '1.5rem',
          color: '#D1D5DB',
          marginBottom: '2rem'
        }}>
          Puntuación final: {score}
        </p>
        <button
          onClick={handleRestart}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563EB',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.125rem',
            transition: 'background-color 0.2s',
            pointerEvents: 'auto'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
        >
          Volver a jugar
        </button>
      </div>
    </div>
  )
} 