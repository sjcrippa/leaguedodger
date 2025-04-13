import { create } from 'zustand'

interface Ability {
  key: string
  name: string
  cooldown: number
  currentCooldown: number
  isReady: boolean
  execute: () => void
}

interface AbilitiesState {
  abilities: Record<string, Ability>
  setAbility: (key: string, ability: Ability) => void
  useAbility: (key: string) => void
  updateCooldowns: (delta: number) => void
}

export const useAbilitiesStore = create<AbilitiesState>((set, get) => ({
  abilities: {},
  
  setAbility: (key: string, ability: Ability) => 
    set((state) => ({
      abilities: {
        ...state.abilities,
        [key]: ability
      }
    })),
  
  useAbility: (key: string) => {
    const state = get()
    const ability = state.abilities[key]
    
    if (ability && ability.isReady) {
      console.log(`Using ability: ${ability.name}`)
      ability.execute()
      
      set((state) => ({
        abilities: {
          ...state.abilities,
          [key]: {
            ...ability,
            currentCooldown: ability.cooldown,
            isReady: false
          }
        }
      }))
    }
  },
  
  updateCooldowns: (delta: number) => 
    set((state) => {
      const updatedAbilities = { ...state.abilities }
      
      Object.keys(updatedAbilities).forEach((key) => {
        const ability = updatedAbilities[key]
        if (!ability.isReady) {
          const newCooldown = Math.max(0, ability.currentCooldown - delta)
          updatedAbilities[key] = {
            ...ability,
            currentCooldown: newCooldown,
            isReady: newCooldown === 0
          }
        }
      })
      
      return { abilities: updatedAbilities }
    })
})) 