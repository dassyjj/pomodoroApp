import { ReactNode, createContext, useEffect, useReducer } from 'react'
import { cyclesReducer } from '../../reducers/cycles'
import { cyclesActionTypes } from '../../reducers/actions'
import { differenceInSeconds } from 'date-fns'

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
  activeCycleId: string | null
  amountSecondsPassed: number
  handleCreateNewCycle: (contentCycle: {
    task: string
    minutesAmount: number
  }) => void
  handleInterruptedCycle: () => void
  markCycleAsFinished: () => void
  handleManipulationSeconds: (value: number) => void
}

export const CyclesContext = createContext({} as CyclesContextProps)

interface Props {
  children: ReactNode
}

export function CyclesContextProvider({ children }: Props) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
      amountSecondsPassed: 0,
    },
    (inicialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@appPomodoro:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return {
        ...inicialState,
        amountSecondsPassed: () => {
          const activeCycle = inicialState.cycles.find(
            (cycle: Cycle) => cycle.id === inicialState.activeCycleId,
          )

          if (activeCycle) {
            return differenceInSeconds(
              new Date(),
              new Date(activeCycle.startDate),
            )
          }

          return 0
        },
      }
    },
  )

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@appPomodoro:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  const { cycles, activeCycleId, amountSecondsPassed } = cyclesState

  function handleCreateNewCycle(contentCycle: {
    task: string
    minutesAmount: number
  }) {
    dispatch({
      type: cyclesActionTypes.CREATE_NEW_CYCLE,
      payload: {
        contentCycle,
      },
    })
  }

  function handleInterruptedCycle() {
    dispatch({
      type: cyclesActionTypes.INTERRUPTED_CYCLE,
      payload: {
        interruptedDate: new Date(),
      },
    })
  }

  function markCycleAsFinished() {
    dispatch({
      type: cyclesActionTypes.MARK_CYCLE_AS_FINISHED,
      payload: {
        finishedDate: new Date(),
      },
    })
  }

  function handleManipulationSeconds(value: number) {
    dispatch({
      type: cyclesActionTypes.MANIPULATION_SECONDS,
      payload: {
        value,
      },
    })
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycleId,
        amountSecondsPassed,
        handleCreateNewCycle,
        handleInterruptedCycle,
        markCycleAsFinished,
        handleManipulationSeconds,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
