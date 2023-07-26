import { ReactNode, createContext, useState } from "react"

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextProps {
  cycles: Cycle[]
  activeCycleId: string
  amountSecondsPassed: number
  handleCreateNewCycle: (contentCycle: { task: string, minutesAmount: number }) => void
  handleInterruptedCycle: () => void
  markCycleAsFinished: () => void
  handleManipulationSeconds: (value: number) => void
}

export const CyclesContext = createContext({} as CyclesContextProps)

interface Props {
  children: ReactNode
}

export function CyclesContextProvider({ children }: Props) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  function handleCreateNewCycle(contentCycle: { task: string, minutesAmount: number }) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: contentCycle.task,
      minutesAmount: contentCycle.minutesAmount,
      startDate: new Date(),
    }

    setCycles(cycle => [...cycle, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)
  }

  function handleInterruptedCycle() {
    setCycles(cyclesState => cyclesState.map(cycle => {
      if(cycle.id === activeCycleId) {
        return {...cycle, interruptedDate: new Date()}
      } else {
        return cycle
      }
    }))

    setActiveCycleId(null)
  }

  function markCycleAsFinished() {
    setCycles(cycleState => cycleState.map(cycle => {
      if(cycle.id === activeCycleId) {
        return {...cycle, finishedDate: new Date()}
      } else {
        return cycle
      }
    }))

    setActiveCycleId(null)
  }

  function handleManipulationSeconds(value: number) {
    setAmountSecondsPassed(value)
  }

  return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycleId,
      amountSecondsPassed,
      handleCreateNewCycle,
      handleInterruptedCycle,
      markCycleAsFinished,
      handleManipulationSeconds
    }}>
      {children}
    </CyclesContext.Provider>
  )
}