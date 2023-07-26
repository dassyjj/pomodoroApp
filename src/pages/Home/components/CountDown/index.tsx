import { useContext, useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { differenceInSeconds } from 'date-fns'

export function CountDown() {
  const {
    cycles,
    activeCycleId,
    markCycleAsFinished,
    amountSecondsPassed,
    handleManipulationSeconds,
  } = useContext(CyclesContext)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )
        if (secondsDifference >= totalSeconds) {
          markCycleAsFinished()
          handleManipulationSeconds(totalSeconds)
          clearInterval(interval)
        } else {
          handleManipulationSeconds(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    markCycleAsFinished,
    handleManipulationSeconds,
  ])

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const currentMinutesAmount = Math.floor(currentSeconds / 60)
  const currentSecondsAmount = currentSeconds % 60

  const minutes = String(currentMinutesAmount).padStart(2, '0')
  const seconds = String(currentSecondsAmount).padStart(2, '0')

  useEffect(() => {
    if (document.hidden) {
      activeCycle ? (document.title = `${minutes}:${seconds}`) : 'appPomodoro'
    } else {
      document.title = 'appPomodoro'
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
