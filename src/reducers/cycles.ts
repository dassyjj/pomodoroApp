interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextState {
  cycles: Cycle[]
  activeCycleId: string | null
  amountSecondsPassed: number
}

export function cyclesReducer(state: CyclesContextState, action: any) {
  if (action.type === 'CREATE_NEW_CYCLE') {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: action.payload.contentCycle.task,
      minutesAmount: action.payload.contentCycle.minutesAmount,
      startDate: new Date(),
    }

    return {
      ...state,
      cycles: [...state.cycles, newCycle],
      activeCycleId: newCycle.id,
      amountSecondsPassed: 0,
    }
  }

  if (action.type === 'INTERRUPTED_CYCLE') {
    const interruptedDate = action.payload.interruptedDate

    return {
      ...state,
      cycles: state.cycles.map((cycle) => {
        if (cycle.id === state.activeCycleId) {
          return { ...cycle, interruptedDate }
        } else {
          return cycle
        }
      }),
      activeCycleId: null,
    }
  }

  if (action.type === 'MARK_CYCLE_AS_FINISHED') {
    const finishedDate = action.payload.finishedDate

    return {
      ...state,
      cycles: state.cycles.map((cycle) => {
        if (cycle.id === state.activeCycleId) {
          return { ...cycle, finishedDate }
        } else {
          return cycle
        }
      }),
      activeCycleId: null,
    }
  }

  if (action.type === 'MANIPULATION_SECONDS') {
    return {
      ...state,
      amountSecondsPassed: action.payload.value,
    }
  }

  return state
}
