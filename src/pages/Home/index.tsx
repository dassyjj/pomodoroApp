import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { CountDown } from "./components/CountDown";
import { NewCycleForm } from "./components/NewCycleForm";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'task required'),
  minutesAmount: zod.number()
  .min(1, 'at least 5 minutes')
  .max(60, 'maximum 60 minutes')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const {register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if(activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)
        if(secondsDifference >= totalSeconds) {
          setCycles(currentCycle => currentCycle.map(cycle => {
            if(cycle.id ===  activeCycleId) {
              return {...cycle, finishedDate: new Date()}
            } else {
              return cycle
            }
          }))
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  function handleCreateNewCycle(data: NewCycleFormData) {
   const newCycle:Cycle = {
    id: String(new Date().getTime()),
    task: data.task,
    minutesAmount: data.minutesAmount,
    startDate: new Date(),
   }
   setCycles(state => [...state, newCycle])

   setActiveCycleId(newCycle.id)
   setAmountSecondsPassed(0)

    reset()
  }

  function handleInterruptedCycle() {
    setCycles(currentCycle => currentCycle.map(cycle => {
      if(cycle.id === activeCycleId) {
        return {...cycle, interruptedDate: new Date()}
      } else {
        return cycle
      }
    }))

    setActiveCycleId(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const currentMinutesAmount = Math.floor(currentSeconds / 60)
  const currentSecondsAmount = currentSeconds % 60

  const minutes = String(currentMinutesAmount).padStart(2, "0")
  const seconds = String(currentSecondsAmount).padStart(2, "0")

  useEffect(() => {
    if(document.hidden) {
      activeCycle ? document.title = `${minutes}:${seconds}` : 'appPomodoro'
    } else {
      document.title = 'appPomodoro'
    }
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')
  const disableWhen = !task || !minutesAmount
  const disableWhenActiveCycle = !!activeCycle

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm />

        <CountDown />

        {!activeCycle && (
          <StartCountdownButton disabled={disableWhen} type="submit">
            <Play size={24} />
            {'Run'}
          </StartCountdownButton>
        )}
        {activeCycle && (
          <StopCountdownButton onClick={handleInterruptedCycle} type="submit">
            <HandPalm size={24} />
            {'Finish'}
          </StopCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}