
import { useState } from 'react'

export const useTrigger = () => {
  const [trigger, setTrigger] = useState(0)
  
  const triggerRefetch = () => {
    setTrigger(prev => prev + 1)
  }
  
  return { trigger, triggerRefetch }
}
