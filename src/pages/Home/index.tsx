import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'task required'),
  minutesAmount: zod.number()
  .min(5, 'at least 5 minutes')
  .max(60, 'maximum 60 minutes')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const {register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    console.log(data)
    reset()
  }

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')
  const disableWhen = !task || !minutesAmount

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">I will work on</label>
          <TaskInput id="task" list="task-suggestions" placeholder="add project name" {...register('task')} />

          <datalist id="task-suggestions">
            <option value="Project 1" />
            <option value="Project 1" />
            <option value="Project 1" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">during</label>
          <MinutesAmountInput type="number" id="minutesAmount" placeholder="00" {...register('minutesAmount', { valueAsNumber: true })} step={5} min={5} max={60} />

          <span>minutes.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={disableWhen} type="submit">
          <Play size={24} />
          {'Run'}
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}