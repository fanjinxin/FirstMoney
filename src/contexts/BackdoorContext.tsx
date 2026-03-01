import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type BackdoorContextType = {
  showBackdoorBtn: boolean
  onDisclaimerTap: () => void
}

const BackdoorContext = createContext<BackdoorContextType | null>(null)

export function BackdoorProvider({ children }: { children: ReactNode }) {
  const [disclaimerTapCount, setDisclaimerTapCount] = useState(0)
  const showBackdoorBtn = disclaimerTapCount >= 20

  const onDisclaimerTap = useCallback(() => {
    setDisclaimerTapCount((c) => c + 1)
  }, [])

  return (
    <BackdoorContext.Provider value={{ showBackdoorBtn, onDisclaimerTap }}>
      {children}
    </BackdoorContext.Provider>
  )
}

export function useBackdoor() {
  const ctx = useContext(BackdoorContext)
  return ctx ?? { showBackdoorBtn: false, onDisclaimerTap: () => {} }
}
