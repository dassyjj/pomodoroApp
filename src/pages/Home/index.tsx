import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from "react";
import { CountDown } from "./components/CountDown";
import { NewCycleForm } from "./components/NewCycleForm";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'task required'),
  minutesAmount: zod.number()
  .min(5, 'at least 5 minutes')
  .max(60, 'maximum 60 minutes')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycleId, cycles, handleCreateNewCycle, handleInterruptedCycle } = useContext(CyclesContext)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function triggerCreateNewCycle(data: NewCycleFormData) {
    handleCreateNewCycle(data)
    reset()
  }

  function triggerInterruptedCycle() {
    handleInterruptedCycle()
  }

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')
  const disableWhen = !task || !minutesAmount

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(triggerCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />

          <CountDown />
        </FormProvider>

        {activeCycle ? (
          <StopCountdownButton onClick={triggerInterruptedCycle} type="submit">
            <HandPalm size={24} />
            {'Finish'}
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={disableWhen} type="submit">
            <Play size={24} />
            {'Run'}
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}