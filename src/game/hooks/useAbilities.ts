import { useEffect } from 'react'
import { useAbilitiesStore } from '../stores/abilitiesStore'

export const useAbilities = () => {
  const { useAbility, setAbility } = useAbilitiesStore()

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      
      // Check if the key is a valid ability key
      if (['q', 'w', 'e', 'r', 'd', 'f'].includes(key)) {
        useAbility(key)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [useAbility])

  // Initialize abilities
  useEffect(() => {
    // Basic ability template
    const createAbility = (key: string, name: string, cooldown: number) => ({
      key,
      name,
      cooldown,
      currentCooldown: 0,
      isReady: true,
      execute: () => console.log(`Executing ${name} ability`)
    })

    // Set up all abilities
    setAbility('q', createAbility('q', 'Q Ability', 5))
    setAbility('w', createAbility('w', 'W Ability', 8))
    setAbility('e', createAbility('e', 'E Ability', 10))
    setAbility('r', createAbility('r', 'R Ability', 30))
    setAbility('d', createAbility('d', 'D/F Ability', 15))
  }, [setAbility])
} 